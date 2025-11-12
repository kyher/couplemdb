import { signOut } from "@/../auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="bg-blue-600 rounded p-2 text-sm text-white cursor-pointer hover:bg-blue-700"
      >
        Sign out
      </button>
    </form>
  );
}
