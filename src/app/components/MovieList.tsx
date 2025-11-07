import Link from "next/link";
import { getMovies } from "../actions";
import MovieReviews from "./MovieReviews";

export default async function MovieList({ coupleId }: { coupleId: string }) {
  const movies = await getMovies(coupleId);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {movies.map((movie) => (
        <div key={movie.id} className="p-4 bg-gray-800 rounded mb-2">
          <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
          {movie.movieReviews.length > 0 && (
            <MovieReviews reviews={movie.movieReviews} summary={true} />
          )}
          <div className="flex gap-2">
            {!movie.movieReviews.length && (
              <Link
                href={`/movies/${movie.id}/add-review`}
                className="bg-blue-600 p-2 rounded"
              >
                Add a review
              </Link>
            )}
            <Link
              href={`/movies/${movie.id}`}
              className="bg-orange-500 p-2 rounded"
            >
              View movie
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
