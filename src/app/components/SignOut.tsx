import { signOut } from "@/../auth";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" className="bg-blue-600 rounded p-2 text-sm">
        Sign out
      </button>
    </form>
  );
}
