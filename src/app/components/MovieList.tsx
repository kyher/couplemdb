import Link from "next/link";
import { getMovies } from "../actions";
import MovieReviews from "./MovieReviews";
import { auth } from "../../../auth";
import { MovieReview } from "@/db/schema";
import { get } from "http";
import StarRating from "./StarRating";

export default async function MovieList({ coupleId }: { coupleId: string }) {
  const movies = await getMovies(coupleId);
  const session = await auth();

  function getUserReview(reviews: MovieReview[]) {
    return reviews.find((review) => review.reviewerId === session?.user?.id);
  }

  function getPartnerReview(reviews: MovieReview[]) {
    return reviews.find((review) => review.reviewerId !== session?.user?.id);
  }
  return (
    <table>
      <thead>
        <tr>
          <th className="text-left p-2">Title</th>
          <th className="text-left p-2">Your review</th>
          <th className="text-left p-2">Your Partner's review</th>
          <th className="text-left p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {movies.map((movie) => (
          <tr key={movie.id} className="border-t border-gray-700">
            <td className="p-2">{movie.title}</td>
            <td className="p-2">
              <StarRating
                rating={getUserReview(movie.movieReviews)?.rating ?? 0}
              />
            </td>
            <td className="p-2">
              <StarRating
                rating={getPartnerReview(movie.movieReviews)?.rating ?? 0}
              />
            </td>
            <td className="p-2 flex gap-2">
              {!movie.movieReviews.length && (
                <Link
                  href={`/movies/${movie.id}/add-review`}
                  className=" bg-blue-600 p-2 rounded"
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
