import { MovieReview } from "@/db/schema";
import { auth } from "../../../auth";
import StarRating from "./StarRating";

export default async function MovieReviews({
  reviews,
  summary,
}: {
  reviews: MovieReview[];
  summary: boolean;
}) {
  const session = await auth();
  return (
    <div className="flex gap-12">
      {reviews.map((review) => (
        <div key={review.id} className="my-4">
          <div>
            <p>
              {review.reviewerId === session?.user?.id
                ? "Your "
                : "Your Partner's "}{" "}
              rating
            </p>
            <StarRating rating={review.rating} />
          </div>
          {!summary && (
            <>
              <p>
                {" "}
                {review.reviewerId === session?.user?.id
                  ? "Your review notes"
                  : "Your Partner's review notes"}{" "}
              </p>
              <p className="font-bold">{review.reviewText}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
