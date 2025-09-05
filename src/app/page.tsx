import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/dashboard">
        <h1 className="text-3xl font-bold underline text-cneter min-h-screen flex justify-center items-center">
          Dashboard!
        </h1>
      </Link>
    </main>
  );
}
