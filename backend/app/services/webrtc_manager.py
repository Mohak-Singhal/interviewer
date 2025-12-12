import logging
from typing import Dict, Optional
from fastapi import WebSocket
from aiortc import RTCPeerConnection, RTCSessionDescription

logging.basicConfig(level=logging.INFO)
logging.getLogger("aiortc").setLevel(logging.WARNING)
logging.getLogger("aioice").setLevel(logging.WARNING)
logger = logging.getLogger("webrtc")

class InterviewSession:
    def __init__(self, interview_id: str, websocket: WebSocket):
        self.interview_id = interview_id
        self.websocket = websocket
        self.pc = RTCPeerConnection()

    async def close(self):
        if self.pc:
            await self.pc.close()

class ConnectionManager:
    def __init__(self):
        self.active_sessions: Dict[str, InterviewSession] = {}

    async def connect(self, interview_id: str, websocket: WebSocket):
        await websocket.accept()
        session = InterviewSession(interview_id, websocket)
        self.active_sessions[interview_id] = session
        logger.info(f"✅ [Manager] User connected: {interview_id}")
        return session

    def disconnect(self, interview_id: str):
        if interview_id in self.active_sessions:
            del self.active_sessions[interview_id]
            logger.info(f"❌ [Manager] User disconnected: {interview_id}")

    async def handle_offer(self, interview_id: str, sdp: str, type: str):
        logger.info(f"🔄 [Manager] Received Offer for {interview_id}...")
        
        session = self.active_sessions.get(interview_id)
        if not session:
            logger.error(f"⚠️ [Manager] Session not found: {interview_id}")
            return None

        try:
            offer = RTCSessionDescription(sdp=sdp, type=type)
            await session.pc.setRemoteDescription(offer)
            
            answer = await session.pc.createAnswer()
            await session.pc.setLocalDescription(answer)

            logger.info("✅ [Manager] Handshake Complete. Returning Answer.")
            
            return {
                "sdp": session.pc.localDescription.sdp,
                "type": session.pc.localDescription.type
            }
        
        except Exception as e:
            logger.error(f"❌ [Manager] Error during handshake: {str(e)}")
            return None

manager = ConnectionManager()