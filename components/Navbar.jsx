import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-zinc-800 bg-black px-6 py-4 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6">
        <Link href="/" className="font-bold tracking-wide">
          Pixora
        </Link>

        <Link href="/explore">Explore</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/health">Health</Link>
      </div>
    </nav>
  );
}