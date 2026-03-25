import torch
import pathlib
import pickle
from fastai.vision.all import *

# The Path Hack
temp = pathlib.PosixPath
pathlib.PosixPath = pathlib.WindowsPath

print("Attempting to load the model directly with PyTorch...")

try:
    # Bypassing fastai to see the REAL error
    model = torch.load("purdue_gym_model.pkl", map_location="cpu", pickle_module=pickle)
    print("Wait... it loaded successfully?!")
except Exception as e:
    print("\n" + "="*50)
    print("🚨 HERE IS THE REAL ERROR 🚨")
    print(e)
    print("="*50 + "\n")

# Revert Path Hack
pathlib.PosixPath = temp