from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastai.vision.all import *
from torchvision import transforms
from PIL import Image
import torch
import pathlib
import platform
import io

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
# Only applies the Windows hack if it detects you are running locally on your laptop.
# Render's Linux servers will safely ignore this.
is_windows = platform.system() == 'Windows'
if is_windows:
    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath

# 3. Robust Model Loading with Diagnostics
print("Loading model... this might take a second.")
try:
    learn = load_learner(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print("\n" + "="*50)
    print("🚨 REAL ERROR DETECTED 🚨")
    print("Make sure 'purdue_gym_model.pkl' is actually uploaded to GitHub!")
    print(f"Error Type: {type(e)}")
    print(f"Error Message: {e}")
    print("="*50 + "\n")
    raise e
finally:
    # Safely revert the path hack if it was applied
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
    # Read raw bytes from the HTTP request
    image_bytes = await file.read()
    
    # 6. IN-MEMORY PROCESSING: Open image directly from RAM, no temp files needed
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    
    # Convert PIL Image to a PyTorch Tensor and add batch dimension
    img_tensor = img_transform(img).unsqueeze(0)
    
    # 7. Pure PyTorch Inference (Bypassing fastai completely)
    with torch.no_grad():
        logits = model(img_tensor)
        probs = torch.nn.functional.softmax(logits[0], dim=0)
        
        # Get winning prediction index and confidence score
        pred_idx = torch.argmax(probs).item()
        confidence = probs[pred_idx].item()
        
        # Translate the index back to the gym machine name
        pred_class = learn.dls.vocab[pred_idx]
        
    return {
        "machine": str(pred_class),
        "confidence": float(confidence)
    }