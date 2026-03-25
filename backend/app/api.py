from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastai.vision.all import *
from torchvision import transforms
from PIL import Image
import torch
import pathlib
import platform
import io
import os
import pickle

# 1. Dynamic Pathing
BASE_DIR = pathlib.Path(__file__).parent.resolve()
MODEL_PATH = BASE_DIR / "purdue_gym_model.pkl"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 2. Environment-Aware Path Hack
is_windows = platform.system() == 'Windows'
if is_windows:
    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath

# 3. The Ultimate Diagnostic Loading Block
print(f"Checking file at: {MODEL_PATH}")
if not MODEL_PATH.exists():
    raise FileNotFoundError("The purdue_gym_model.pkl file is COMPLETELY missing from the server.")

file_size = os.path.getsize(MODEL_PATH)
print(f"File size is: {file_size} bytes")

if file_size < 10000:  # Less than 10KB
    raise ValueError(f"\n🚨 GIT LFS TRAP TRIGGERED 🚨\nYour model is only {file_size} bytes! GitHub replaced your 20MB file with a tiny text pointer.\nYou MUST run the 'git lfs untrack' commands locally to push the raw bytes!")

print("Loading model... this might take a second.")
try:
    # We must run pure PyTorch first to bypass fastai's error swallowing
    torch.load(MODEL_PATH, map_location="cpu", pickle_module=pickle)
    
    # If pure PyTorch succeeds, let fastai wrap it
    learn = load_learner(MODEL_PATH)
    print("Model loaded successfully!")
    
except Exception as e:
    print("\n" + "="*50)
    print("🚨 REAL PYTORCH ERROR DETECTED 🚨")
    print(f"Error Type: {type(e)}")
    print(f"Error Message: {e}")
    print("="*50 + "\n")
    raise e
finally:
    if is_windows:
        pathlib.PosixPath = temp

# 4. Extract Pure PyTorch Model for Inference
model = learn.model.cpu()
model.eval()

# 5. Define mathematical transformations
img_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.post("/upload-image", tags=["root"])
async def upload_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img_tensor = img_transform(img).unsqueeze(0)
    
    with torch.no_grad():
        logits = model(img_tensor)
        probs = torch.nn.functional.softmax(logits[0], dim=0)
        pred_idx = torch.argmax(probs).item()
        confidence = probs[pred_idx].item()
        pred_class = learn.dls.vocab[pred_idx]
        
    return {
        "machine": str(pred_class),
        "confidence": float(confidence)
    }