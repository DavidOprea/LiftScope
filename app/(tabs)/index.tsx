import { retrieveData, storeData } from '@/components/async-storage';
import CameraButton from '@/components/camera-button';
import RequestPermissionButton from '@/components/request-permission-button';

import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const labels = [
    "Ab Crunch Machine",
    "Assisted Pull Up",
    "Bench Press",
    "Cable Machine",
    "Hack Squat Machine",
    "Hyper Extension Machine",
    "Lat Pulldown Machine",
    "Lying Leg Curl Machine",
    "Smith Machine",
    "Treadmill"
];

// Base64 decoding function
function decodeBase64(input: string) {
  const str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 == 1) throw new Error("'atob' failed");
  for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
    buffer = chars.indexOf(buffer);
  }
  const len = output.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = output.charCodeAt(i);
  return bytes;
}

function isTomorrow(targetDate : Date) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
      targetDate.getFullYear() === tomorrow.getFullYear() &&
      targetDate.getMonth() === tomorrow.getMonth() &&
      targetDate.getDate() === tomorrow.getDate()
  );
}

async function changeStreak() {
  const rawStreakData = await retrieveData('streakData');
  const currentDate = new Date();
  if (!rawStreakData) {
    const streakData = {'streak': 1, 'date': currentDate};
    console.log(streakData);
    await storeData('streakData', JSON.stringify(streakData));
    return "Streak Started!";
  }
  let response = "";
  const streakData = JSON.parse(rawStreakData);
  if (streakData === null) {
    const streakData = {'streak': 1, 'date': currentDate};
    console.log(streakData);
    await storeData('streakData', JSON.stringify(streakData));
    return "Streak Started!";
  } else if (streakData.date !== currentDate.toLocaleDateString()) {
      if (!isTomorrow(currentDate)) {
          streakData.streak = 1;
          response = "Streak Lost :C";
      } else {
          streakData.streak++;
          response = "Streak Maintained!"
      }
      streakData.date = currentDate.toLocaleDateString();
      console.log(streakData);
      await storeData('streakData', JSON.stringify(streakData));
  }
  return response;
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [modelState, setModelState] = useState('not-started');
  
  const [lastPhotoURI, setLastPhotoURI] = useState<string | null>(null);
  const [predictionLabel, setPredictionLabel] = useState<string>('');

  const [zoom, setZoom] = useState(0);
  const savedScale = useSharedValue(0);
  
  const cameraRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  
  const modelAsset = useTensorflowModel(require('../../assets/gym_model_purdue.tflite'));
  const router = useRouter();

  useEffect(() => {
    if (modelAsset.state === 'loaded') {
      console.log('✅ Model loaded');
      modelRef.current = modelAsset.model;
      setModelState('loaded');
      // removeData("streakData");
    }
  }, [modelAsset.state]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event : any) => {
      const newZoom = savedScale.value + (event.scale - 1) * 0.5; 
      const clampedZoom = Math.max(0, Math.min(1, newZoom));
      runOnJS(setZoom)(clampedZoom);
    })
    .onEnd((event : any) => {
      const finalZoom = savedScale.value + (event.scale - 1) * 0.5;
      savedScale.value = Math.max(0, Math.min(1, finalZoom));
    });

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      console.log('📸 Snapping...');
      // 1. Take Picture
      const photo = await cameraRef.current.takePictureAsync({
        base64: false, 
        quality: 1.0
      });

      // 2. Resize to 224x224
      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          { resize: { width: 224, height: 224 } }
        ],
        { format: ImageManipulator.SaveFormat.JPEG, base64: false } 
      );

      const formData = new FormData();

      formData.append('file', {
        uri: manipulated.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const res = await fetch('https://liftscope.onrender.com/upload-image', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      // 5. UNPACK THE JSON (This is what was missing!)
      const data = await res.json();
      console.log('✅ Cloud Response:', data);

      const confidence = data['confidence'] * 100; // Convert to percentage
      const prediction = data['machine'];

      if (confidence > 70) {
        const response = await changeStreak();
        setPredictionLabel(`Class: ${prediction} (${confidence.toFixed(2)}%) ${response}`);
        const data = await retrieveData(prediction);
        if (data === null) {
          await storeData(prediction, "true");
          setPredictionLabel(`New Machine Unlocked: ${prediction}! 🎉 ${response}`);
          console.log('Found new machine, storing in AsyncStorage: ', prediction);
        }
        router.push({
          pathname: "/machine-info",
          params: { id: prediction }
        });
      } else {
        setPredictionLabel(`Uncertain Prediction (${confidence.toFixed(2)}%)`);
      }

      setLastPhotoURI(manipulated.uri);

      /*

      if (modelRef.current) {
        console.log('📂 Reading file...');
        const base64Data = await FileSystem.readAsStringAsync(manipulated.uri, {
            encoding: 'base64'
        });

        const jpegBytes = decodeBase64(base64Data);
        const { width, height, data } = jpeg.decode(jpegBytes, { useTArray: true });
        
        const inputTensor = new Float32Array(224 * 224 * 3);
        let pixelIndex = 0;
        let totalBrightness = 0;

        const mean = [0.485, 0.456, 0.406];
        const std = [0.229, 0.224, 0.225];

        for (let i = 0; i < width * height; i++) {
          const r = data[i * 4];
          const g = data[i * 4 + 1];
          const b = data[i * 4 + 2];
          
          totalBrightness += (r+g+b);

          inputTensor[pixelIndex++] = ((r / 255) - mean[0]) / std[0];
          inputTensor[pixelIndex++] = ((g / 255) - mean[1]) / std[1];
          inputTensor[pixelIndex++] = ((b / 255) - mean[2]) / std[2];
        }
        
        const avgBrightness = Math.floor(totalBrightness / (width * height));
        console.log(`💡 Brightness: ${avgBrightness}`);

        // Run Model
        const outputs = await modelRef.current.run([inputTensor]);
        const result = outputs[0];

        // 3. Find the highest probability directly
        let maxScore = -Infinity;
        let maxIndex = -1;
        
        for (let i = 0; i < result.length; i++) {
          // result[i] is already a clean percentage from 0.0 to 1.0!
          console.log(`Class ${labels[i]}: ${(result[i] * 100).toFixed(2)}%`);
          
          if(result[i] > maxScore) {
              maxScore = result[i];
              maxIndex = i;
          }
        }
      } */
    } catch (error: any) {
      console.error('❌ Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  // --- UI CODE ---
  if (!permission || !permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <RequestPermissionButton onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={pinchGesture}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            flash={flash}
            mode="picture"
            zoom={zoom}
          >
            <View style={styles.overlay}>
                
                {/* 🖼️ DEBUG PREVIEW BOX 🖼️ */}
                {lastPhotoURI && (
                    <View style={styles.previewBox}>
                        <Text style={styles.previewTitle}>Captured Image:</Text>
                        <Image source={{ uri: lastPhotoURI }} style={styles.previewImage} />
                        <Text style={styles.previewResult}>{predictionLabel}</Text>
                        <TouchableOpacity onPress={() => setLastPhotoURI(null)} style={styles.closeBtn}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.controls}>
                    <CameraButton onPress={takePicture} />
                </View>
            </View>
          </CameraView>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'flex-end', paddingBottom: 10},
  
  // Preview Styles
  previewBox: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    width: 250,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 100,
    borderWidth: 2,
    borderColor: '#fff'
  },
  previewTitle: { color: 'white', marginBottom: 5, fontWeight: 'bold' },
  previewImage: { width: 224, height: 224, backgroundColor: '#000', borderRadius: 8 },
  previewResult: { color: '#4cd137', fontSize: 16, marginTop: 5, fontWeight: 'bold' },
  closeBtn: { marginTop: 10, backgroundColor: '#444', padding: 8, borderRadius: 6, width: '100%', alignItems: 'center' },
  closeText: { color: 'white' },

  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}
});