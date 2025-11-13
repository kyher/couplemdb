import BackLink from "@/app/components/BackLink";
import Header from "@/app/components/Header";
import { auth } from "../../../../auth";
import { getCoupleIdForUser, getMovie, removeMovieAction } from "@/app/actions";
import MovieReviews from "@/app/components/MovieReviews";
import RemoveMovie from "@/app/components/RemoveMovie";

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
      {!movie && "Loading..."}
      {movie && (
        <>
          <h2 className="text-xl">{movie.title}</h2>
          <RemoveMovie movieId={movie.id} />
          <MovieReviews reviews={movie.movieReviews} summary={false} />
        </>
      )}
    </>
  );
}
