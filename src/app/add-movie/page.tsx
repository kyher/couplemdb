import Link from "next/link";
import { auth } from "../../../auth";
import Header from "../components/Header";

export default async function Page() {
  const session = await auth();
  return (
    <>
      <Header session={session} />
      <Link
        href="/"
        className="bg-blue-600 p-2 rounded text-white hover:bg-blue-700 w-max"
      >
        Back
      </Link>
      <h2 className="text-xl">Add movie page</h2>
    </>
  );
}
