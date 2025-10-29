import Link from "next/link";
import { auth } from "../../auth";
import { getInvitationForUser } from "./actions";
import Invited from "./components/Invited";
import InvitePartner from "./components/InvitePartner";
import { InviteStatus } from "./helpers/InviteStatus";
import Header from "./components/Header";

export default async function Home() {
  const session = await auth();
  const invitation = await getInvitationForUser(session?.user?.id || "");
  return (
    <>
      <Header session={session} />
      {session && !invitation && <InvitePartner />}
      {session && invitation && invitation.status === InviteStatus.Invited && (
        <div>
          {invitation.inviterId === session.user?.id ? (
            <p>You have invited your partner! Waiting for them to accept.</p>
          ) : (
            <Invited />
          )}
        </div>
      )}
      {session && invitation && invitation.status === InviteStatus.Accepted && (
        <div>
          <Link
            href="/add-movie"
            className="bg-blue-600 p-2 rounded text-white hover:bg-blue-700"
          >
            Add movie
          </Link>
        </div>
      )}
    </>
  );
}
