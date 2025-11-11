import { Session } from "next-auth";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
import Link from "next/link";

export default function Header({ session }: { session: Session | null }) {
  return (
    <div className="border-b pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
      {!session && (
        <Link href="/login" className="bg-blue-600 text-white p-2 rounded">
          Sign in / Register
        </Link>
      )}
      {session && (
        <div className="flex gap-2 items-center">
          <p className="text-sm">Signed in as {session.user?.email}</p>
          <SignOut />
        </div>
      )}
      <h1 className="text-3xl">CoupleMDB</h1>
      <p className="text-lg text-center sm:text-left">
        Track your couple movie experiences.
      </p>
    </div>
  );
}
