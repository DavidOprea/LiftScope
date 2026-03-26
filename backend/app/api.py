from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastai.vision.all import *
from torchvision import transforms
from PIL import Image
import torch
import pathlib
import uuid
import platform

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

# 1. The Linux -> Windows Path Hack
temp = None
if platform.system() == 'Windows':
    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath

print("Loading model... this might take a second.")
learn = load_learner(MODEL_PATH)
print("Model loaded successfully!")

if platform.system() == 'Windows':
    pathlib.PosixPath = temp

# 2. Extract the raw PyTorch model and set it to Evaluation Mode
model = learn.model.cpu()
model.eval()

# 3. Define the exact mathematical transformations fastai uses under the hood
img_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.post("/upload-image", tags=["root"])
async def upload_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    temp_filename = BASE_DIR / f"{uuid.uuid4()}.jpg"
    
    with open(temp_filename, "wb") as f:
        f.write(image_bytes)
        
    try:
        # 4. Load image cleanly with PIL
        img = Image.open(temp_filename).convert('RGB')
        
        # 5. Convert image to a PyTorch Tensor
        img_tensor = img_transform(img).unsqueeze(0) 
        
        # 6. THE BYPASS: Run pure PyTorch inference (bypassing fastai completely)
        with torch.no_grad():
            logits = model(img_tensor)
            probs = torch.nn.functional.softmax(logits[0], dim=0)
            
            # Get the winning prediction index and confidence score
            pred_idx = torch.argmax(probs).item()
            confidence = probs[pred_idx].item()
            
            # Use fastai's vocabulary to translate the index back to the machine name
            pred_class = learn.dls.vocab[pred_idx]

        print(str(pred_class), str(confidence))
            
        return {
            "machine": str(pred_class),
            "confidence": float(confidence)
        }
        
    finally:
        if temp_filename.exists():
            temp_filename.unlink()