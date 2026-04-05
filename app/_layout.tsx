import { retrieveData, storeData } from "@/components/async-storage";

import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

export default function RootLayout() {
  const generateUserId = async () => {
    const existingId = await retrieveData('userId');
    console.log("Existing user ID:", existingId);
    if (!existingId) {
      const userId : any = uuid.v4();
      console.log("Generated new user ID:", userId);
      await storeData('userId', userId);
    }
  };

  useEffect(() => {
    generateUserId();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
