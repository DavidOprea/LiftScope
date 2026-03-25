import { removeData, retrieveData, storeData } from '@/components/async-storage';
import RemoveLogButton from '@/components/remove-log-button';

import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const LogPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState("");

  const isDeleting = useRef(false);
  const textRef = useRef(text);
  const dataRef = useRef(data);

  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { dataRef.current = data; }, [data]);

  const handleTextChange = (newText: string) => {
    setText(newText);
  }

  const getData = async () => {
    setIsLoading(true);
    const raw = await retrieveData(`log_${id}`);
    if (!raw) {
      setData(null);
      setText("");
      setIsLoading(false);
      return;
    }
    const jsonData = JSON.parse(raw);
    jsonData.date = new Date(jsonData.date);
    
    setData(jsonData);
    setText(jsonData.text ?? "");
    setIsLoading(false);
  }

  const setJSONData = async () => {
    if (isDeleting.current || !dataRef.current) return;

    const updatedData = { ...dataRef.current, text: textRef.current };
    console.log("Saving:", updatedData);
    await storeData(`log_${id}`, JSON.stringify(updatedData));
  }

  const removeLog = async () => {
    isDeleting.current = true; // Block auto-save
    await removeData(`log_${id}`);
    
    const rawLogCount = await retrieveData('log_count');
    let log_count = Number(rawLogCount) || 0;
    const start = Number(id ?? -1) + 1;

    if (isNaN(log_count) || isNaN(start)) {
      navigation.goBack();
      return;
    }

    for (let i = start; i < log_count; i++) {
      const otherRaw = await retrieveData(`log_${i}`);
      if (!otherRaw) continue;
      let otherData = JSON.parse(otherRaw);
      otherData.id = i - 1;
      await storeData(`log_${i - 1}`, JSON.stringify(otherData));
    }

    await removeData(`log_${log_count - 1}`);
    log_count--;
    await storeData('log_count', log_count.toString());
    
    navigation.goBack();
  }
  
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Because we use refs, we only need to bind this listener ONCE. 
    // This entirely removes the lag when typing in the TextInput.
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setJSONData(); 
    });

    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#1d1b1b', // Match your container background
      },
      headerTintColor: '#ffffff', // Color of the back button and title text
      headerTitleStyle: {
        color: '#ffffff', // Title text color (alternative to headerTintColor)
      },
      // Optional: Change the title
      title: data ? `Log ${id}: ${data.date.toLocaleDateString()}` : `Log ${id}`,
    });

    return unsubscribe;
  }, [navigation, data, id]); 

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {!isLoading && data ? (
            <TextInput
              style={styles.input}
              value={text}
              multiline
              onChangeText={handleTextChange}
              placeholder="Input log..."
              placeholderTextColor="black"
            />
        ) : (
          <Text style={styles.text}>Loading...</Text>
        )}
        <RemoveLogButton onPress={removeLog} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#1d1b1b",
    paddingTop: 10
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 18,
    color: 'white',
  },
  input: {
    minHeight: 0,
    maxHeight: 400,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    width: '80%',
    backgroundColor: "white",
    textAlignVertical: "top"
  },
});

export default LogPage;