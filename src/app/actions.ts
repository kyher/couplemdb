'use server'
import { coupleInvitations, db, users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import z from "zod";
import { auth } from "../../auth";
import { InviteStatus } from "./helpers/InviteStatus";
import { revalidatePath } from "next/cache";

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