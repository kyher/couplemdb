import { MovieReview } from "@/db/schema";
import { auth } from "../../../auth";

export default async function MovieReviews({
  reviews,
  summary,
}: {
  reviews: MovieReview[];
  summary: boolean;
}) {
  const session = await auth();
  return (
    <>
      {reviews.map((review) => (
        <div key={review.id} className="my-4">
          <>
            <p>
              {review.reviewerId === session?.user?.id
                ? "Your "
                : "Your Partner's "}{" "}
              rating
            </p>
            <p className="font-bold">{review.rating}</p>
          </>
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
    </>
  );
}
