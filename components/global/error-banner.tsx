"use client";

import { useState, useEffect } from "react";

export default function ErrorBanner({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setShow(false), 5000);
  }, []);

  return (
    show && <div className="bg-red-600 text-foreground text-xl">{text}</div>
  );
}
