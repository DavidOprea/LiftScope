from fastapi import APIRouter
from sqlalchemy import create_engine, text
from typing import Any
import json

import dotenv
dotenv.load_dotenv()
import os

from pydantic import BaseModel

class ProfileEntry(BaseModel):
    name: str 
    age: str 
    streakData: Any
    userId: str

router = APIRouter()

engine = create_engine(os.getenv("DATABASE_URL"))

@router.post("/profile/sync", tags=["profile"])
async def sync_logs(request: ProfileEntry):
    streak_data_string = json.dumps(request.streakData)

    with engine.begin() as db:
        db.execute(
            text('''
                    INSERT INTO profiles (user_id, name, age, streak) 
                    VALUES (:user_id, :name, :age, :streak)
                    ON CONFLICT (user_id) DO UPDATE
                    SET name = EXCLUDED.name, age = EXCLUDED.age, streak = EXCLUDED.streak
                    '''),
            {
                "user_id": request.userId,
                "name": request.name,
                "age": request.age,
                "streak": streak_data_string
            }
        )

    return {"status": "success", "message": f"Received {request.name} profile for user {request.userId}."}

@router.get("/profile/get", tags=["profile"])
async def get_profile(userId: str):
    with engine.begin() as db:
        rows = db.execute(
            text("SELECT name, age, streak FROM profiles WHERE user_id = :user_id"), 
            {"user_id": userId})
        profile = rows.fetchone()
        if profile:
            return {"name": profile.name, "age": profile.age, "streakData": profile.streak}
        else:
            return {"error": "Profile not found"}