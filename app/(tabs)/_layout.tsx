import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#000000",
        borderTopColor: "#333333",
        paddingBottom: insets.bottom,
        height: 60 + insets.bottom,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600"
      }
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Camera",
          tabBarIcon: () => <Ionicons name="camera-outline" color="gray" size={28} />
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: () => <Ionicons name="book-outline" color="gray" size={28} />
        }}
      />
    </Tabs>
  );
}

export default TabLayout;