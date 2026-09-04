import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl text-du-purple-deep">Page not found</h1>
      <p className="mt-2 text-sm text-du-muted">The requested page is not part of this portal.</p>
      <Link href="/" className="mt-6 inline-block font-semibold text-du-purple hover:underline">
        Return to home
      </Link>
    </div>
  );
}
