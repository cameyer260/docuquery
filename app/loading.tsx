"use client"

import Lottie from "lottie-react";
import loading from "../public/loading/loading.json"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center text-xl p-8">
      <h1>Please wait while we load your content...</h1>
      <Lottie animationData={loading} loop={true} className="w-50 h-50"/>
    </div>
  );
}
