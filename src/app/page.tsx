import { auth } from "../../auth";
import { getInvitationForUser } from "./actions";
import InvitePartner from "./components/InvitePartner";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";

export default async function Home() {
  const session = await auth();
  const invitation = await getInvitationForUser(session?.user?.id || "");
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
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
        {session && !invitation && <InvitePartner />}
        {session && invitation && (
          <div>
            {invitation.inviterId === session.user?.id ? (
              <p>You have invited your partner! Waiting for them to accept.</p>
            ) : (
              <p>Your partner has invited you! Please click below to accept!</p>
              // Todo: Add accept/reject invite
            )}
          </div>
        )}
      </main>
    </div>
  );
}
