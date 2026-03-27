import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  FileSearch,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Footer() {
  const session = await getServerSession(authOptions);
  const year = new Date().getFullYear();
  const footerSections = [
    {
      title: "Product",
      links: [
        ...(session
          ? [
              { href: "/main/upload", label: "Upload PDFs", icon: FileText },
              { href: "/main/ask", label: "Ask Questions", icon: FileSearch },
            ]
          : []),
        { href: "/about", label: "About DocuQuery", icon: BookOpenText },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy-policy", label: "Privacy Policy", icon: ShieldCheck },
        { href: "/terms", label: "Terms of Service", icon: ShieldCheck },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border/70 bg-muted/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-12">
        <div className="space-y-5">
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-primary shadow-sm">
                <FileSearch className="h-5 w-5" />
              </span>
              <span>DocuQuery</span>
            </Link>

            <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Trustworthy document Q&amp;A for readings, assignments, textbook
              sections, and research PDFs. Ask focused questions, review the
              returned source context, and verify before you rely on the answer.
            </p>
          </div>

          <Link
            href="https://christophermeyer.dev#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Contact
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.links.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 text-sm text-foreground/85 transition-colors hover:text-foreground"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>&copy; {year} DocuQuery</p>
          <p>Grounded answers from your documents, with source context.</p>
        </div>
      </div>
    </footer>
  );
}
