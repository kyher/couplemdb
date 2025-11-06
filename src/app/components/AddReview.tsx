"use client";

import { useActionState } from "react";
import { addReviewAction } from "../actions";

const initialState = {
  message: "",
};
export default function AddReview({ movieId }: { movieId: string }) {
  const [state, formAction, pending] = useActionState(
    addReviewAction,
    initialState
  );
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input
        type="text"
        name="id"
        value={movieId}
        className="hidden"
        readOnly
      />
      <input
        type="number"
        placeholder="Rating (one to five)"
        min={1}
        max={5}
        name="rating"
        className="border border-gray-300 rounded p-2 w-100"
      />
      <textarea
        name="note"
        placeholder="Review notes..."
        className="border border-gray-300 rounded p-2 w-100 h-24"
      />
      <p className="text-red-500">{state?.message}</p>

      <button
        type="submit"
        className="rounded bg-blue-600 p-2 cursor-pointer text-white hover:bg-blue-700 w-100"
      >
        Add review
      </button>
    </form>
  );
}
