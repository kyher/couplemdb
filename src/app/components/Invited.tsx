import { acceptInvitationAction, rejectInvitationAction } from "../actions";

export default function Invited() {
  return (
    <div>
      <p>Your partner has invited you!</p>
      <form className="mb-4 flex gap-4 mt-2">
        <button
          formAction={acceptInvitationAction}
          className="bg-green-600 p-2 rounded cursor-pointer"
        >
          Accept
        </button>
        <button
          formAction={rejectInvitationAction}
          className="bg-red-600 p-2 rounded cursor-pointer"
        >
          Reject
        </button>
      </form>
    </div>
  );
}
