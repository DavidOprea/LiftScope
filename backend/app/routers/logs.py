from fastapi import APIRouter
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

import dotenv
dotenv.load_dotenv()
import os

from pydantic import BaseModel
from typing import List, Optional

class LogEntry(BaseModel):
    id: int
    text: str 
    date: str 

class SyncRequest(BaseModel):
    logs: Optional[List[LogEntry]] = []
    userId: str

router = APIRouter()

engine = create_engine(os.getenv("DATABASE_URL"))

@router.post("/logs/sync", tags=["logs"])
async def sync_logs(request: SyncRequest):
    for log in request.logs:
        with engine.begin() as db:
            db.execute(
                text('''
                     INSERT INTO logs (log_id, user_id, text, date) 
                     VALUES (:id, :user_id, :text, :date)
                     ON CONFLICT (log_id, user_id) DO UPDATE
                     SET text = EXCLUDED.text, date = EXCLUDED.date
                     '''),
                {
                    "id": log.id,
                    "user_id": request.userId,
                    "text": log.text,
                    "date": log.date,
                }
            )

    return {"status": "success", "message": f"Received {len(request.logs)} logs for user {request.userId}."}

@router.get("/logs/get", tags=["logs"])
async def get_logs(userId: str):
    with engine.begin() as db:
        rows = db.execute(
            text("SELECT log_id, text, date FROM logs WHERE user_id = :user_id"), 
            {"user_id": userId})
        logs = [LogEntry(id=row.log_id, text=row.text, date=str(row.date)) for row in rows]
        print(f"Fetched {len(logs)} logs for user {userId} from database.")
        return {"logs": logs}

@router.delete("/logs/delete/{log_id}", tags=["logs"])
async def delete_log(log_id: str):
    with engine.begin() as db:
        db.execute(
            text("DELETE FROM logs WHERE log_id = :log_id"),
            {"log_id": log_id}
        )
        print(f"Deleted log with ID {log_id} from database.")
        return {"status": "success", "message": f"Log with ID {log_id} deleted."}