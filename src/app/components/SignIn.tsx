import { signIn } from "@/../auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button type="submit" className="bg-blue-600 rounded p-4">
        Signin with GitHub
      </button>
    </form>
  );
}
