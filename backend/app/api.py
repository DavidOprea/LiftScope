from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import logs, image, profile

app = FastAPI()
app.include_router(logs.router)
app.include_router(image.router)
app.include_router(profile.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)