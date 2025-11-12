import BackLink from "@/app/components/BackLink";
import Header from "@/app/components/Header";
import { auth } from "@/../auth";
import { getCoupleIdForUser, getMovie } from "@/app/actions";
import AddReview from "@/app/components/AddReview";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user) {
    return (
      <>
        <p>Not found</p>
      </>
    );
  }
  const coupleId = await getCoupleIdForUser(session.user.id!);
  const movie = await getMovie(id, coupleId);
  if (!movie) {
    return (
      <>
        <p>Not found</p>
      </>
    );
  }
  return (
    <>
      <Header session={session} />
      <BackLink href="/" />
      <h2 className="text-xl">Add Review of {movie?.title}</h2>
      {movie && <AddReview movieId={movie.id} />}
    </>
  );
}
