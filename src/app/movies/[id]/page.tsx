import BackLink from "@/app/components/BackLink";
import Header from "@/app/components/Header";
import { auth } from "../../../../auth";
import { getMovie } from "@/app/actions";
import MovieReviews from "@/app/components/MovieReviews";

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
      {!movie && "Loading..."}
      {movie && (
        <>
          <h2 className="text-xl">{movie.title}</h2>
          <MovieReviews reviews={movie.movieReviews} summary={false} />
        </>
      )}
    </>
  );
}
