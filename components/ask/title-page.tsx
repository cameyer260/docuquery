"use client";

import { useState, useEffect } from "react";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";

export default function TitlePage({ title }: { title: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [found, setFound] = useState<boolean>(false);
  // then try to find the document that user owns using our title param
  //
  // on fail show dne page, on success show actual page. while loading show loading page.
  if (loading) return <Loading />;
  else if (!found) return <NotFound />;
  else
    return (
      <div>
        <h1>chat page for specific document</h1>
      </div>
    );
}
