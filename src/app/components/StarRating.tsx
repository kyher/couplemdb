import { StarIcon } from "@heroicons/react/16/solid";

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {Array.from({ length: rating }, (_, index) => {
        return <StarIcon className="size-6 text-yellow-400" key={index} />;
      })}
    </div>
  );
}
