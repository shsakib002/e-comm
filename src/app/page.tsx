import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/dashboard">
        <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
      </Link>
    </main>
  );
}
