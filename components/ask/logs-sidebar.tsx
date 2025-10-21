"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import ErrorBanner from "../global/error-banner";
import Link from "next/link";

export default function LogsSidebar() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [titles, setTitles] = useState<string[]>([
    "doctitle1",
    "doctitle2",
    "doctitle3",
    "doctitle4",
    "doctitle5",
    "doctitle1",
    "doctitle2",
    "doctitle3",
    "doctitle4",
    "doctitle5",
    "doctitle1",
    "doctitle2",
    "doctitle3",
    "doctitle4",
    "doctitle5",
    "doctitle1",
    "doctitle2",
    "doctitle3",
    "doctitle4",
    "doctitle5",
    "doctitle1",
    "doctitle2",
    "doctitle3",
    "doctitle4",
    "doctitle5",
    "doctitle1",
    "doctitle2",
    "doctitle3",
    "doctitle4",
    "doctitle5",
    "doctitle1",
    "doctitle2",
    "doctitle3",
    "doctitle4",
    "doctitle5",
  ]);

  /**
   * useEffect for fetching the titles of all the logs the user owns and providing links to their pages
   * currently just simulates with fake data
   */
  useEffect(() => {
    const res = true;

    // setTitles here

    setLoading(false);
    if (!res) setError(true);
  }, []);

  if (loading) return <Loading />;
  else
    return (
      <div className="flex flex-col border-r border-foreground/30 h-full overflow-y-auto text-xl">
        {error && (
          <ErrorBanner text="Sorry, but we could not fetch your other logs. Please try again later." />
        )}
        {titles.map((el, i) => (
          <Link
            key={i}
            className="border-b border-foreground/30 py-1 px-2"
            href={`/ask/${el}`}
          >
            {el}
          </Link>
        ))}
      </div>
    );
}
