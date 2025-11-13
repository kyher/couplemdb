"use client";
import { useActionState } from "react";
import { removeMovieAction } from "../actions";
const initialState = {
  message: "",
};
export default function RemoveMovie({ movieId }: { movieId: string }) {
  const [state, formAction, pending] = useActionState(
    removeMovieAction,
    initialState
  );
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={movieId} />
      <button
        className="bg-red-600 p-2 rounded hover:bg-red-800 cursor-pointer text-white"
        type="submit"
      >
        Remove movie
      </button>
    </form>
  );
}
