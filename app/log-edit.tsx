import { retrieveData, storeData } from '../components/async-storage';

import { router, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const LogEdit = () => {
  const [title, setTitle] = useState("");
  const navigation = useNavigation();

  const addNewLog = async () => {
    const logCountRaw = await retrieveData('log_count');
    let log_count = Number(logCountRaw) || 0;
    
    const new_log = {
        id: log_count,
        text: "",
        title: title
    };

    await storeData(`log_${log_count}`, JSON.stringify(new_log));
    log_count++;
    await storeData('log_count', log_count.toString());
    
    openLog(new_log.id.toString());
  }

  const openLog = (logId: string) => {
      router.replace({
          pathname: "/log-page",
          params: { id: logId }
      });
  }

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#1d1b1b', // Match your container background
      },
      headerTintColor: '#ffffff', // Color of the back button and title text
      headerTitleStyle: {
        color: '#ffffff', // Title text color (alternative to headerTintColor)
      },
      // Optional: Change the title
      title: "Create New Log"
    });
  }, [navigation]); 

  return (
    <View style={styles.container}>
      <View style={styles.container2} >
          <Text style={[styles.text, styles.profileHeader]}>Title: </Text>
          <TextInput
            value={title}
            style={styles.input}
            placeholder='Input title for new log'
            onChangeText={setTitle}
          ></TextInput>
          <Pressable onPress={addNewLog} style={styles.button}>
           <Text style={[styles.text, styles.buttonText]}>Create Log</Text>
          </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#575757"
    },
    container2: {
      flex: 1,
      backgroundColor: "#1d1b1b",
    },
    text: {
      fontFamily: "Inter",
      color: 'white',
    },
    profileHeader: {
      fontSize: 20,
      marginLeft: 10,
      marginTop: 10,
      textDecorationLine: 'underline'
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 10,
      width: '80%',
      marginLeft: 15,
      marginVertical: 10,
      backgroundColor: "white",
    },
    button: {
      position: 'absolute',
      padding: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#433f3f',
      width: '40%',
      bottom: 60,
      right: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 25,
    }
});

export default LogEdit;