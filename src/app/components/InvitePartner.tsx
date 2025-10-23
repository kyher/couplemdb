"use client";
import { useActionState } from "react";
import { inviteAction } from "../actions";

const initialState = {
  message: "",
};

export default function InvitePartner() {
  const [state, formAction, pending] = useActionState(
    inviteAction,
    initialState
  );

  return (
    <div>
      <h2>Invite your partner!</h2>
      <p>
        Once your partner has also registered, please enter their email here to
        connect up!
      </p>
      <form className="mt-4 flex flex-col gap-2" action={formAction}>
        <input
          type="email"
          name="email"
          placeholder="Partner's email"
          className="border border-gray-300 rounded p-2"
        />
        <p className="text-red-500">{state?.message}</p>
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-600 rounded p-2 text-white"
        >
          Invite
        </button>
      </form>
    </div>
  );
}
