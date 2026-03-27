"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  FileCheck2,
  FileSearch,
  FileText,
  GraduationCap,
  LibraryBig,
  MessageSquare,
  NotebookPen,
  Quote,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: smoothEase,
    },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Grounded Answers",
    description:
      "Responses are meant to stay anchored to the uploaded PDF instead of drifting into generic AI output.",
  },
  {
    icon: Quote,
    title: "Source References You Can Verify",
    description:
      "When the document supports an answer, the response can point back to the uploaded file and retrieved context so you can check it yourself.",
  },
  {
    icon: FileCheck2,
    title: "Honest Fallbacks",
    description:
      "If the answer is not in the document, DocuQuery should say no answer was found rather than filling in the gap.",
  },
];

const workflowSteps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload a reading",
    description:
      "Bring in a textbook section, course handout, article, or assignment PDF and give it a clear name.",
  },
  {
    icon: FileSearch,
    step: "02",
    title: "Ask specific questions",
    description:
      "Query definitions, arguments, equations, methods, or evidence from the document without skimming the whole file again.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Review the answer carefully",
    description:
      "Use the cited response when the source supports it, or get a clear no-answer signal when it does not.",
  },
];

const academicUses = [
  {
    icon: BookOpenText,
    title: "Course Readings",
    description:
      "Pull out key arguments, definitions, and supporting passages before class or discussion.",
  },
  {
    icon: NotebookPen,
    title: "Assignments",
    description:
      "Check what the document actually says before drafting a response, solving a problem, or studying for a quiz.",
  },
  {
    icon: LibraryBig,
    title: "Research Material",
    description:
      "Revisit long papers faster and keep answers traceable when you need to verify a claim or method section.",
  },
];

const heroSignals = [
  "Built for readings, chapters, papers, and assignments",
  "Useful when you need a source-backed answer, not a guess",
  "Designed to feel credible in real academic workflows",
];

export default function LandingContent() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_42%),radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.16),transparent_30%)] dark:bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.16),transparent_42%),radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.14),transparent_28%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.08),transparent)] dark:bg-[linear-gradient(to_bottom,transparent,rgba(148,163,184,0.05),transparent)]"
      />

      <section className="px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur"
            >
              <BadgeCheck className="h-4 w-4 text-primary" />
              Verifiable document Q&amp;A for academic work
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-6">
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:leading-[1.04]">
                  Ask precise questions about your PDFs and trace the answer
                  back to the source.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  DocuQuery helps students and researchers upload readings,
                  textbook sections, and papers, then get grounded answers with
                  source references. If the document does not support the
                  answer, it should say so clearly.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 rounded-full px-6">
                  <Link href="/auth/signin">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-full border-border/70 bg-background/70 px-6 backdrop-blur"
                >
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </div>

              <ul className="space-y-3 pt-2 text-sm text-muted-foreground">
                {heroSignals.map((signal) => (
                  <li key={signal} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: smoothEase, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full bg-primary/10 blur-3xl lg:block" />
            <div className="absolute -right-6 bottom-10 hidden h-32 w-32 rounded-full bg-slate-400/20 blur-3xl dark:bg-slate-200/10 lg:block" />

            <Card className="overflow-hidden rounded-[28px] border-border/70 bg-card/85 py-0 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur supports-[backdrop-filter]:bg-card/75">
              <div className="border-b border-border/70 px-6 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      BIO 221 / Chapter 6 Reading
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Indexed for grounded Q&amp;A with file-backed source
                      references
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Ready to ask
                  </div>
                </div>
              </div>

              <CardContent className="grid gap-4 p-4 md:grid-cols-[0.92fr_1.08fr] md:p-6">
                <div className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    Document excerpt
                  </div>

                  <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                    <p>
                      Cellular respiration converts stored chemical energy into
                      ATP through glycolysis, the citric acid cycle, and
                      oxidative phosphorylation.
                    </p>
                    <p className="rounded-2xl border border-primary/20 bg-primary/10 px-3 py-2 text-foreground shadow-sm">
                      The electron transport chain establishes a proton
                      gradient, and ATP synthase uses that gradient to generate
                      ATP.
                    </p>
                    <p>
                      Oxygen functions as the final electron acceptor in aerobic
                      respiration, allowing the transport chain to continue.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-border/70 bg-background/80 p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Question
                    </p>
                    <p className="mt-3 text-sm leading-7 text-foreground">
                      What does the chapter say ATP synthase uses to produce
                      ATP?
                    </p>
                  </div>

                  <div className="rounded-3xl border border-border/70 bg-primary/[0.08] p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Quote className="h-4 w-4 text-primary" />
                      Grounded answer
                    </div>
                    <p className="mt-3 text-sm leading-7 text-foreground">
                      ATP synthase uses the proton gradient established by the
                      electron transport chain to generate ATP.
                    </p>
                    <div className="mt-4 inline-flex items-center rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-primary">
                      Source: BIO 221 / Chapter 6 Reading.pdf
                    </div>
                  </div>

                  <div className="rounded-3xl border border-dashed border-border/80 bg-background/75 p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Quote className="h-4 w-4 text-primary" />
                      Top matching chunks
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="rounded-2xl border border-border/70 bg-background/80 px-3 py-2">
                        BIO 221 / Chapter 6 Reading.pdf
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background/80 px-3 py-2">
                        BIO 221 / Chapter 6 Reading.pdf
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-background/80 px-3 py-2">
                        BIO 221 / Chapter 6 Reading.pdf
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-dashed border-border/80 bg-background/75 p-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      When the retrieved context does not support it
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      DocuQuery should return a clear no answer found response
                      instead of inventing support that is not in the document.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="trustworthy" className="px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="mx-auto max-w-7xl"
        >
          <motion.div variants={fadeUp} className="mb-8 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Why it feels trustworthy
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Built around verification, not just speed.
            </h2>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              The product value is not simply answering quickly. It is helping
              you study from what the document actually contains and making that
              easy to check.
            </p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-3">
            {trustPoints.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} variants={fadeUp}>
                <InfoCard icon={Icon} title={title} description={description} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-7xl"
        >
          <motion.div variants={fadeUp} className="mb-10 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Workflow
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A cleaner path from long reading to useful answers.
            </h2>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              The workflow stays simple, but the presentation now reflects a
              polished product instead of placeholder blocks.
            </p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-3">
            {workflowSteps.map(({ icon: Icon, step, title, description }) => (
              <motion.div key={step} variants={fadeUp}>
                <Card className="h-full rounded-[24px] border-border/70 bg-card/80 py-0 shadow-sm backdrop-blur">
                  <CardContent className="flex h-full flex-col gap-6 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {step}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">{title}</h3>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <motion.div variants={fadeUp} className="max-w-xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Academic fit
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Made for students who still need to verify what they cite and
              study.
            </h2>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              The tone, surfaces, and structure lean academic and product-grade
              rather than flashy. That matches the job DocuQuery is trying to
              do: help with careful reading and trustworthy recall.
            </p>
            <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
              <GraduationCap className="h-5 w-5 text-primary" />
              Useful for textbook chapters, lecture readings, research PDFs, and
              assignment support.
            </div>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {academicUses.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} variants={fadeUp}>
                <InfoCard icon={Icon} title={title} description={description} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: smoothEase }}
          className="mx-auto max-w-5xl"
        >
          <Card className="overflow-hidden rounded-[32px] border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(245,245,245,0.88))] py-0 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.3)] dark:bg-[linear-gradient(135deg,rgba(38,38,38,0.94),rgba(23,23,23,0.94))]">
            <CardContent className="relative flex flex-col gap-6 p-8 sm:p-10 md:flex-row md:items-end md:justify-between">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_60%)] md:block dark:bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.12),transparent_60%)]"
              />

              <div className="relative max-w-2xl space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Start with a real reading
                </p>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Turn dense PDFs into answers you can inspect before you trust.
                </h2>
                <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                  Upload a document, ask a focused question, and verify the
                  result against the returned source files before you use it for
                  class, studying, or research review.
                </p>
              </div>

              <div className="relative flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 rounded-full px-6">
                  <Link href="/auth/signin">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-full border-border/70 bg-background/80 px-6"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full rounded-[24px] border-border/70 bg-card/80 py-0 shadow-sm backdrop-blur">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
