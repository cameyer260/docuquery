import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-row justify-between border-t border-foreground/30 text-xl p-4">
      <div className="flex gap-8">
        <h1>@ 2025 Docuquery</h1>
        <Link href="https://christophermeyer.dev#contact">Contact Me</Link>
      </div>
      <div className="flex gap-8">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-of-service">Terms of Service</Link>
      </div>
    </footer>
  );
}
