import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key : any, value : any) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

const retrieveData = async (key : any) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const data = JSON.parse(value);
      return data;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export { retrieveData, storeData };
