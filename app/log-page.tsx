import { removeData, retrieveData, storeData } from '@/components/async-storage';
import RemoveLogButton from '@/components/remove-log-button';

import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const deleteLogFromServer = async (logId: string) => {
    try {
        const response = await fetch(`https://liftscope.onrender.com/logs/delete/${logId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete log: ' + response.statusText);
        }
        
        const logData = await response.json();

        console.log("Deleted log from server:", logData);
    } catch (error) {
        console.log('Error deleting log from server:', error);
    }
}

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
    await deleteLogFromServer(id as string).catch((e) => {console.log(e)});

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
      title: data ? `${data.title}` : `Log ${id}`,
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