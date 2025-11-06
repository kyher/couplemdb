import BackLink from "@/app/components/BackLink";
import Header from "@/app/components/Header";
import { auth } from "@/../auth";
import { getMovie } from "@/app/actions";
import AddReview from "@/app/components/AddReview";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const movie = await getMovie(id);
  return (
    <>
      <Header session={session} />
      <BackLink href="/" />
      <h2 className="text-xl">Add Review of {movie?.title}</h2>
      {movie && <AddReview movieId={movie.id} />}
    </>
  );
}
