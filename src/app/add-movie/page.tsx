import Link from "next/link";
import { auth } from "../../../auth";
import Header from "../components/Header";
import AddMovie from "../components/AddMovie";
import BackLink from "../components/BackLink";

export default async function Page() {
  const session = await auth();
  return (
    <>
      <Header session={session} />
      <BackLink href="/" />
      <h2 className="text-xl">Add Movie</h2>
      <AddMovie />
    </>
  );
}
