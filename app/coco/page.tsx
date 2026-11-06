"use client";

import dynamic from "next/dynamic";
const CocoWebcam = dynamic(() => import("./CocoWebcam"), {
  ssr: false,
  loading: () => <div className="p-6">Loading webcam detector...</div>,
});

export default function CocoWebcamShell() {
  return <CocoWebcam />;
}
