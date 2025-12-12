// app/interview/[id]/page.tsx
"use client";

import ActiveSession from "@/app/components/ActiveSession";
import { use } from "react"; 

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InterviewRoomPage({ params }: PageProps) {
  // In Next.js 15+, params is a Promise, so we unwrap it using 'use()'
  const resolvedParams = use(params);
  const interviewId = resolvedParams.id;

  return (
    <main className="h-screen w-screen bg-black">
      {/* This is the component we just built. 
        It will now wake up, take this ID, and connect to the socket.
      */}
      <ActiveSession interviewId={interviewId} />
    </main>
  );
}