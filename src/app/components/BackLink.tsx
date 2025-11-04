import Link from "next/link";

export default function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="text-white hover:underline mb-4 inline-block">
      {"<- Back"}
    </Link>
  );
}
