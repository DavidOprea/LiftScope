# GymVision Model Training
## Train a gym equipment classifier using your own photos. 📸

### 1. Take photos
For each machine, create a folder and add 50-100 photos:
- Different angles
- Different lighting

### 2. Upload to Google Drive
```
Gym_Machines_Better_Train/     # Training photos
├── leg_press/
├── lat_pulldown/
└── [your_machine]/

Gym_Machines_Better_Eval/      # Validation photos (same folder names)
├── leg_press/
├── lat_pulldown/
└── [your_machine]/
```

### 3. Run the notebook
The notebook:
- Mounts Google Drive
- Copies your folders
- Converts `HEIC` → `JPG` (if needed)
- Trains MobileNetV3 via transfer learning
- Exports `.tflite` for the mobile app

### 4. Get your model
Download `gym_model_mobile.tflite` from Colab and copy it to your mobile app's assets/ folder.

### Info/Tips
- Expected accuracy: 150-200 photos/class → 70-90% depending on machine distinctness
- Similar looking machines (e.g., machine leg curl and machine leg extension) need more photos

### Branch notes
- `machine-learning-model` = this branch (Colab notebook, no app code)
- `main` = React Native mobile app
