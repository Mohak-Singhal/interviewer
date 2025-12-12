# app/routes/websocket_routes.py
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.webrtc_manager import manager

router = APIRouter()

@router.websocket("/ws/interview/{interview_id}")
async def interview_websocket(websocket: WebSocket, interview_id: str):
    # 1. Connect
    await manager.connect(interview_id, websocket)
    
    try:
        while True:
            # 2. Listen
            data = await websocket.receive_text()
            message = json.loads(data)

            # 3. Handle Offer
            if message.get("type") == "offer":
                response = await manager.handle_offer(
                    interview_id, 
                    message["sdp"], 
                    message["type"]
                )
                if response:
                    await websocket.send_json(response)

    except WebSocketDisconnect:
        manager.disconnect(interview_id)
    except Exception as e:
        print(f"Error in websocket: {e}")
        manager.disconnect(interview_id)