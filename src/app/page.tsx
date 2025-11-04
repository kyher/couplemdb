import Link from "next/link";
import { auth } from "../../auth";
import { getCoupleIdForUser, getInvitationForUser } from "./actions";
import Invited from "./components/Invited";
import InvitePartner from "./components/InvitePartner";
import { InviteStatus } from "./helpers/InviteStatus";
import Header from "./components/Header";
import MovieList from "./components/MovieList";

export default async function Home() {
  const session = await auth();
  const invitation = await getInvitationForUser(session?.user?.id || "");
  const coupleId =
    invitation && invitation.status === InviteStatus.Accepted
      ? await getCoupleIdForUser(session!.user!.id!)
      : null;
  return (
    <>
      <Header session={session} />
      {!session && (
        <p>
          Welcome to CoupleMDB - an application to track movie reviews for you
          and your partner! Please sign in / register to continue.
        </p>
      )}
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
      {session &&
        invitation &&
        invitation.status === InviteStatus.Accepted &&
        coupleId && (
          <div className="flex flex-col gap-4">
            <Link
              href="/add-movie"
              className="bg-blue-600 p-2 rounded text-white hover:bg-blue-700 w-fit"
            >
              Add movie
            </Link>
            <MovieList coupleId={coupleId} />
          </div>
        )}
    </>
  );
}
