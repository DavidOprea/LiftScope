import { retrieveData, storeData } from '@/components/async-storage';
import CameraButton from '@/components/camera-button';
import RequestPermissionButton from '@/components/request-permission-button';

import { Asset } from 'expo-asset';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router';
import jpeg from 'jpeg-js';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { loadTensorflowModel } from 'react-native-fast-tflite';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

const labels = [
  "Ab Crunch Machine",
  "Assisted Pull Up",
  "Bench Press",
  "Cable Machine",
  "Hack Squat Machine",
  "Hyperextension Machine",
  "Lat Pulldown Machine",
  "Lying Leg Curl Machine",
  "Smith Machine",
  "Treadmill"
];

function isYesterday(targetDateStr: string) {
  const lastDate = new Date(targetDateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    lastDate.getFullYear() === yesterday.getFullYear() &&
    lastDate.getMonth() === yesterday.getMonth() &&
    lastDate.getDate() === yesterday.getDate()
  );
}

async function changeStreak() {
  const rawStreakData = await retrieveData('streakData');
  const currentDateStr = new Date().toDateString();
  console.log(currentDateStr);
  console.log("Current streak data:", rawStreakData);
  
  if (!rawStreakData || rawStreakData === "null") {
    await storeData('streakData', JSON.stringify({ streak: 1, date: currentDateStr }));
    return "Streak Started!";
  }

  const streakData = JSON.parse(rawStreakData);
  
  if (streakData.date === currentDateStr) {
    await storeData('streakData', JSON.stringify({ streak: 1, date: currentDateStr }));
    return "";
  }
  
  if (isYesterday(currentDateStr)) {
    streakData.streak++;
    streakData.date = currentDateStr;
    await storeData('streakData', JSON.stringify(streakData));
    return "Streak Maintained!";
  } else {
    streakData.streak = 1;
  }
  streakData.date = currentDateStr;
  await storeData('streakData', JSON.stringify(streakData));
  return "Streak Lost :C";
}

async function runOnDeviceInference(
  imageUri: string,
  model: any
): Promise<{ machine: string; confidence: number } | null> {
  try {
    // Read the 224x224 JPEG as base64
    const base64Data = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Decode base64 → raw bytes
    const binaryStr = atob(base64Data);
    const jpegBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      jpegBytes[i] = binaryStr.charCodeAt(i);
    }

    // Decode JPEG → actual RGBA pixel data
    const decoded = jpeg.decode(jpegBytes, { useTArray: true });

    // Build Float32 input tensor with ImageNet normalization
    const inputTensor = new Float32Array(224 * 224 * 3);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < 224 * 224; i++) {
      const offset = i * 3;
      inputTensor[offset]     = ((decoded.data[i * 4]     / 255) - mean[0]) / std[0]; // R
      inputTensor[offset + 1] = ((decoded.data[i * 4 + 1] / 255) - mean[1]) / std[1]; // G
      inputTensor[offset + 2] = ((decoded.data[i * 4 + 2] / 255) - mean[2]) / std[2]; // B
    }

    const outputs = model.runSync([inputTensor]);
    const result = outputs[0];

    let maxScore = -Infinity;
    let maxIndex = -1;
    for (let i = 0; i < result.length; i++) {
      if (result[i] > maxScore) {
        maxScore = result[i];
        maxIndex = i;
      }
    }

    return {
      machine: labels[maxIndex] ?? 'Unknown',
      confidence: maxScore,
    };
  } catch (e) {
    console.error('❌ On-device inference error:', e);
    return null;
  }
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [modelState, setModelState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const [lastPhotoURI, setLastPhotoURI] = useState<string | null>(null);
  const [predictionLabel, setPredictionLabel] = useState<string>('');

  const [zoom, setZoom] = useState(0);
  const savedScale = useSharedValue(0);

  const cameraRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const router = useRouter();

  // Copy model from bundle to device filesystem on first launch, then load via file://
  useEffect(() => {
    async function loadModel() {
      try {
        const asset = Asset.fromModule(require('../../assets/gym_model_mobile.tflite'));
        await asset.downloadAsync();

        // FileSystem.documentDirectory already ends with '/'
        const destPath = `${FileSystem.documentDirectory}gym_model_mobile.tflite`;
        const info = await FileSystem.getInfoAsync(destPath);

        if (!info.exists) {
          await FileSystem.copyAsync({ from: asset.localUri!, to: destPath });
          console.log('📦 Model copied to filesystem');
        }

        // Strip the file:// prefix since loadTensorflowModel prepends its own
        const filePath = destPath.startsWith('file://')
          ? destPath.slice('file://'.length)
          : destPath;

        const model = await loadTensorflowModel({ url: `file://${filePath}` });
        modelRef.current = model;
        setModelState('loaded');
        console.log('✅ On-device model loaded');
      } catch (e) {
        console.error('❌ Failed to load on-device model:', e);
        setModelState('error');
      }
    }
    loadModel();
  }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event: any) => {
      const newZoom = savedScale.value + (event.scale - 1) * 0.5;
      runOnJS(setZoom)(Math.max(0, Math.min(1, newZoom)));
    })
    .onEnd((event: any) => {
      savedScale.value = Math.max(0, Math.min(1, savedScale.value + (event.scale - 1) * 0.5));
    });

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      console.log('📸 Snapping...');

      const photo = await cameraRef.current.takePictureAsync({
        base64: false,
        quality: 1.0,
      });

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 224, height: 224 } }],
        { format: ImageManipulator.SaveFormat.JPEG, base64: false }
      );

      setPredictionLabel('Analyzing...');
      setLastPhotoURI(manipulated.uri);

      let machine: string | null = null;
      let confidence: number | null = null;

      // Try cloud first
      try {
        const formData = new FormData();
        formData.append('file', {
          uri: manipulated.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);

        const res = await fetch('https://liftscope.onrender.com/image/upload', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const data = await res.json();
        console.log('✅ Cloud Response:', data);
        machine = data['machine'];
        if (machine === "Hyper Extension Machine") {
          machine = "Hyperextension Machine"; // Normalize old label to new
        }
        confidence = data['confidence'] * 100;

      } catch (cloudError) {
        console.log('☁️ Cloud unavailable, falling back to on-device model...');

        if (modelRef.current) {
          const result = await runOnDeviceInference(manipulated.uri, modelRef.current);
          if (result) {
            machine = result.machine;
            confidence = result.confidence * 100;
          }
        } else {
          Alert.alert(
            'Offline',
            modelState === 'loading'
              ? 'The on-device model is still loading, please wait a moment.'
              : 'No network connection and the on-device model failed to load.'
          );
          return;
        }
      }

      // Handle result
      if (machine && confidence !== null && confidence > 60) {
        const streakResponse = await changeStreak();
        const existingData = await retrieveData(machine);
        if (existingData === null) {
          await storeData(machine, "true");
          setPredictionLabel(`New Machine Unlocked: ${machine}! 🎉 ${streakResponse}`);
          console.log('Found new machine:', machine);
        } else {
          setPredictionLabel(`Class: ${machine} (${confidence.toFixed(2)}%) ${streakResponse}`);
        }
        router.push({
          pathname: "/machine-info",
          params: { id: machine }
        });
      } else if (confidence !== null) {
        setPredictionLabel(`Maybe (${machine || 'Unknown'}) (${confidence.toFixed(2)}%)`);
      }

    } catch (error: any) {
      console.error('❌ Error:', error);
      Alert.alert('Error', error.message);
    }
  };

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
  overlay: { flex: 1, justifyContent: 'flex-end', paddingBottom: 10 },
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
    borderColor: '#fff',
  },
  previewTitle: { color: 'white', marginBottom: 5, fontWeight: 'bold' },
  previewImage: { width: 224, height: 224, backgroundColor: '#000', borderRadius: 8 },
  previewResult: { color: '#4cd137', fontSize: 16, marginTop: 5, fontWeight: 'bold' },
  closeBtn: { marginTop: 10, backgroundColor: '#444', padding: 8, borderRadius: 6, width: '100%', alignItems: 'center' },
  closeText: { color: 'white' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});