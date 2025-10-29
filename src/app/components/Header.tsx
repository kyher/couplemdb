import { Session } from "next-auth";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

export default function Header({ session }: { session: Session | null }) {
  return (
    <>
      {!session && <SignIn />}
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
    </>
  );
}
