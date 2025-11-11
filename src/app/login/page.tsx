import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import SignIn from "../components/SignIn";

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl my-4">
        Sign in or register using a provider below
      </h1>
      <SignIn />
    </div>
  );
}
