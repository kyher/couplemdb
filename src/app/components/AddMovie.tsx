"use client";

import { useActionState } from "react";
import { addMovieAction } from "../actions";

const initialState = {
  message: "",
};
export default function AddMovie() {
  const [state, formAction, pending] = useActionState(
    addMovieAction,
    initialState
  );
  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input
        type="text"
        name="title"
        placeholder="Movie Title"
        className="border border-gray-300 rounded p-2 w-100"
      />
      <p className="text-red-500">{state?.message}</p>

      <button
        type="submit"
        className="rounded bg-blue-600 p-2 cursor-pointer text-white hover:bg-blue-700 w-100"
      >
        Add movie
      </button>
    </form>
  );
}
