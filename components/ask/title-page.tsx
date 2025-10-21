"use client";

import LogsSidebar from "./logs-sidebar";
import Log from "./log";

export default function TitlePage({ title }: { title: string }) {
  return (
    <div className="flex h-[calc(100vh-128px)]">
      <div className="flex-2">
        <LogsSidebar />
      </div>
      <div className="flex-10">
        <Log title={title} />
      </div>
    </div>
  );
}
