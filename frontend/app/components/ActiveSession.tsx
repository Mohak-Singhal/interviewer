"use client";

import { useEffect, useRef, useState } from "react";

export default function ActiveSession({ interviewId }: { interviewId: string }) {
  const [status, setStatus] = useState("Initializing...");
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Refs to hold connections across renders
  const socketRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Start the call immediately on mount
    startCall();

    // Cleanup function: Closes connections when leaving the page
    return () => {
      if (socketRef.current) socketRef.current.close();
      if (pcRef.current) pcRef.current.close();
    };
  }, []);

  const startCall = async () => {
    try {
      setStatus("Requesting Camera...");
      
      // 1. Get Camera/Mic Access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Show local video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 2. Connect to WebSocket
      setStatus("Connecting to Server...");
      const wsUrl = `${process.env.NEXT_PUBLIC_BACKEND_WS_URL || "ws://localhost:8000"}/ws/interview/${interviewId}`;
      
      // Create local variable to avoid race conditions
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      // 3. Setup WebRTC
      ws.onopen = async () => {
        setStatus("Connected! Starting Handshake...");
        
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        pcRef.current = pc;

        // Add local tracks to PeerConnection
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Create Offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        // Send Offer via the OPEN websocket (ws variable)
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ 
            type: "offer", 
            sdp: offer.sdp 
          }));
        }
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        
        // Handle Server Answer
        if (msg.type === "answer" && pcRef.current) {
          await pcRef.current.setRemoteDescription(msg);
          setStatus("✅ AI Connected (Ready to Talk)");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setStatus("❌ Connection Error");
      };

    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + (err as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-3xl aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline 
          className="w-full h-full object-cover mirror-mode" 
          style={{ transform: "scaleX(-1)" }} // Mirror effect
        />
        
        <div className="absolute top-4 left-4 bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">
          <p className="text-sm font-semibold">{status}</p>
        </div>
      </div>
    </div>
  );
}