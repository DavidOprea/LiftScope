# LiftScope 🏋️‍♂️

LiftScope is a React Native mobile app designed to help gym-goers instantly identify gym machines, access tutorial videos and transcripts, and log their daily workouts. 

## Features
- **Smart Machine Identification:** Point your camera at any gym machine to instantly identify it. Uses a custom on-device TensorFlow Lite model for offline speed, with a cloud PyTorch fallback for high accuracy.
  - ***Note on Model Scope🔎:** The current ML model is specifically trained and optimized for the equipment found at Purdue University gyms. Because different manufacturers build similar-looking machines for completely different exercises, generalizing the model across all global gym brands currently causes a decent drop in accuracy.*
- **Daily Streaks:** Stay motivated! The app automatically tracks your gym streak when you successfully scan a machine each day.
- **Workout Logging:** Write, edit, and save daily workout logs. Logs are synced seamlessly between local device storage and a cloud PostgreSQL database.
- **Machine Info:** View detailed information about recognized machines, including target muscle groups, recommended exercises, and video transcripts.

## Tech Stack
- **Frontend:** React Native, Expo, Expo Router
- **Machine Learning (On-Device):** `react-native-fast-tflite`
- **Backend/API:** Python, FastAPI, SQLAlchemy
- **Database:** PostgreSQL (Hosted on Render)
- **Deployment:** Render (Backend), EAS (Mobile Build)

## Running the App Locally

### 1. Prerequisites
- Node.js and npm installed
- Python 3.11+ (for the backend server)
- Expo CLI

### 2. Mobile App Setup
Clone the repository and install the frontend dependencies:
```bash
git clone [https://github.com/DavidOprea/LiftScope/main](https://github.com/DavidOprea/LiftScope/main)
cd LiftScope
npm install
```
Start the expo development server:
```bash
npx expo start
```
#### ⚠️ **Important Camera & OS Limitations:**
- **Developer Build Required:** Because this app uses custom native machine learning modules (react-native-fast-tflite), the camera will not work in the standard Expo Go app. You must create a custom development build (e.g., npx expo run:android).
- **Windows Developers:** If you are developing on a Windows machine, you cannot compile the iOS version of this app locally. You will need a physical Android device plugged into your computer (or an Android emulator with webcam passthrough configured) to test the camera functionality.

### 3. Backend Setup (Optional for local testing)

If you want to run the FastAPI server locally instead of relying on the Render cloud URL:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a .env file in the backend directory and add your database URL:
```bash
DATABASE_URL=postgresql://user:password@localhost/liftscope
```

Start the Uvicorn server:
```bash
uvicorn app.api:app --reload --host 0.0.0.0 --port 8000
```

### 4. Branch notes
- `main` = this branch (React Native mobile app)
- `machine-learning-model` = Google Colab for creating the machine learning model
