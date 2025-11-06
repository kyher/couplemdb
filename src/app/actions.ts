'use server'
import { coupleInvitations, couples, movieReviews, movies, users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import z from "zod";
import { auth } from "../../auth";
import { InviteStatus } from "./helpers/InviteStatus";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";

export async function inviteAction(initialState: any, formData: FormData) {
    const currentAuth = await auth();
    const currentUser = currentAuth?.user;

    if (!currentUser) {
      return {
        message: "Invalid auth state"
      }
    }

    const InviteSchema = z.object({
      email: z.email(),
    });
    const parsedData = InviteSchema.safeParse({
      email: formData.get("email")?.toString().toLowerCase(),
    });
    if (!parsedData.success) {
      return {
        message: "Please enter a valid email address.",
      }
    }

    if (parsedData.data.email === currentUser.email) {
      return {
        message: "You can't invite yourself!"
      }
    }

    const userToInvite = await db.select().from(users).where(eq(users.email, parsedData.data.email));

    if (!userToInvite[0]) {
      return {
        message: "This user is not available to invite."
      }
    }
    
    const inviteeInvitations = await db.select().from(coupleInvitations)
      .where(
        or(
          eq(coupleInvitations.inviteeId, userToInvite[0].id), 
          eq(coupleInvitations.inviterId, userToInvite[0].id)
        )
      )

    if (inviteeInvitations.length > 0) {
      return {
        message: "This user already has an active invite."
      }
    }

    const inviterInvitations = await db.select().from(coupleInvitations)
      .where(
        or(
          eq(coupleInvitations.inviteeId, currentUser.id as string), 
          eq(coupleInvitations.inviterId, currentUser.id as string)
        )
      )

    if (inviterInvitations.length > 0) {
      return {
        message: "You already have an active invite."
      }
    }

    await db.insert(coupleInvitations).values({
      inviterId: currentUser.id as string,
      inviteeId: userToInvite[0].id,
      status: InviteStatus.Invited
    });

    revalidatePath("/");
  } 

export async function getInvitationForUser(userId: string) {
  const invitation = await db.select().from(coupleInvitations)
    .where(
      or(
        eq(coupleInvitations.inviteeId, userId), 
        eq(coupleInvitations.inviterId, userId)
      )
    ).limit(1);

  return invitation[0];
}

export async function acceptInvitationAction() {
  const currentAuth = await auth();
  const currentUser = currentAuth?.user;

  if (!currentUser) {
    return;
  }

  const invitation = await db.select().from(coupleInvitations)
    .where(
      eq(coupleInvitations.inviteeId, currentUser.id as string)
    ).limit(1);

  if (invitation.length === 0) {
    return;
  }

  await db.update(coupleInvitations)
    .set({ status: InviteStatus.Accepted })
    .where(eq(coupleInvitations.id, invitation[0].id));

  await db.insert(couples).values({
    userAId: invitation[0].inviterId,
    userBId: invitation[0].inviteeId
  });

    revalidatePath("/");
}

export async function rejectInvitationAction() {
  const currentAuth = await auth();
  const currentUser = currentAuth?.user;

  if (!currentUser) {
    return;
  }

  const invitation = await db.select().from(coupleInvitations)
    .where(
      eq(coupleInvitations.inviteeId, currentUser.id as string)
    ).limit(1);

  if (invitation.length === 0) {
    return;
  }

  await db.delete(coupleInvitations)
    .where(eq(coupleInvitations.id, invitation[0].id));
    
    revalidatePath("/");
}

export async function addMovieAction(initialState: any, formData: FormData) {
  const currentAuth = await auth();
  const currentUser = currentAuth?.user;

  if (!currentUser) {
    return {
      message: "Invalid auth state"
    }
  }

  const couple = await db.select().from(couples)
    .where(
      or(
        eq(couples.userAId, currentUser.id as string),
        eq(couples.userBId, currentUser.id as string)
      )
    )
    .limit(1);

  if (couple.length === 0) {
    return {
      message: "You are not in a couple yet."
    }
  }

  const AddMovieSchema = z.object({
    title: z.string().min(1),
  });

  const parsedData = AddMovieSchema.safeParse({
    title: formData.get("title")?.toString(),
  });

  if (!parsedData.success) {
    return {
      message: "Please enter a valid movie title."
    }
  }

  await db.insert(movies).values({
    title: parsedData.data.title,
    coupleId: couple[0].id
  });

  redirect("/");
}

export async function getCoupleIdForUser(userId: string) {
  const couple = await db.select().from(couples)
    .where(
      or(
        eq(couples.userAId, userId),
        eq(couples.userBId, userId)
      )
    )
    .limit(1);
    
  return couple[0].id;
}

export async function getMovies(coupleId: string) {
  const coupleMovies = await db.query.movies.findMany({
    where: eq(movies.coupleId, coupleId),
    with: {
      movieReviews: true
    }
  })
    
  return coupleMovies;
}

export async function getMovie(movieId: string) {
  return await db.query.movies.findFirst({
    where: eq(movies.id, movieId)
  })
}

export async function addReviewAction(initialState: any, formData: FormData) {

  const currentAuth = await auth();
  const currentUser = currentAuth?.user;

  if (!currentUser) {
    return {
      message: "Invalid auth state"
    }
  }

  const ReviewMovieSchema = z.object({
    id: z.string(),
    rating: z.coerce.number().min(1).max(5),
    note: z.string().max(255).optional()
  });

  const parsedData = ReviewMovieSchema.safeParse({
    id: formData.get("id"),
    rating: formData.get("rating"),
    note: formData.get("note")
  });

  if (!parsedData.success) {
    console.log(parsedData.error);
    return {
      message: "Please enter a valid rating and note for your review"
    }
  }

  const movie = await getMovie(parsedData.data.id);

  if(!movie) {
    return {
      message: "Movie not found"
    }
  }

  await db.insert(movieReviews).values({
    movieId: movie.id,
    reviewerId: currentUser.id as string,
    rating: parsedData.data.rating,
    reviewText: parsedData.data.note
  })
  
  redirect('/')
}