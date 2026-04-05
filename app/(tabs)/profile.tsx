import { retrieveData, storeData } from '@/components/async-storage';
import { useFocusEffect } from 'expo-router';

import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [streakData, setStreakData] = useState<any>(null);

  const nameRef = useRef(name);
  const ageRef = useRef(age);
  const streakDataRef = useRef(streakData);

  useEffect(() => { nameRef.current = name; }, [name]);
  useEffect(() => { ageRef.current = age; }, [age]);
  useEffect(() => { streakDataRef.current = streakData; }, [streakData]);

  const syncProfileToServer = async (name: string, age: string, streakData: any) => {
      try {
          const userId = await retrieveData('userId') || 'admin';
          console.log("Syncing profile to server with data:", {name, age, streakData});
          const response = await fetch('https://liftscope.onrender.com/profile/sync', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({name : name, age: age, streakData: streakData, userId: userId}) // Replace 'admin' with actual user ID if available
          });

          if (!response.ok) {
              throw new Error('Failed to sync profile');
          }
      } catch (error) {
          console.error('Error syncing profile:', error);
      }
  }

  const loadProfileFromServer = async () => {
      try {
          const userId = await retrieveData('userId') || 'admin';
          const response = await fetch(`https://liftscope.onrender.com/profile/get?userId=${userId}`); // Replace 'admin' with actual user ID if available
          
          if (!response.ok) {
              throw new Error('Failed to load profile: ' + response.statusText);
          }
          
          const profileData = await response.json();

          console.log("Received profile data from server:", profileData);

          if (profileData.name) {
              await storeData('name', profileData.name);
              setName(profileData.name);
          }
          if (profileData.age) {
              await storeData('age', profileData.age);
              setAge(profileData.age);
          }
          if (profileData.streakData) {
              await storeData('streakData', JSON.stringify(profileData.streakData));
              setStreakData(profileData.streakData);
          } else {
              // If no streakData from server, initialize it
              const yesterday = new Date(); // Date is stored as tomorrow, so set it to yesterday to avoid accidentally breaking streak on first load
              yesterday.setDate(yesterday.getDate() - 1);
              setStreakData({'streak': 0, 'date': yesterday});
          }
      } catch (error) {
          console.error('Error loading profile from server:', error);
      }
  }

  const getData = async () => {
    const rawName = await retrieveData('name');
    const rawAge = await retrieveData('age');
    const rawStreakData = await retrieveData('streakData');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Only reset if ALL values are truly missing (null/undefined)
    if (rawName === null && rawAge === null && rawStreakData === null) {
      setName("");
      setAge("");
      setStreakData({'streak': 0, 'date': yesterday});
      return;
    }
    
    // Set values (empty strings are valid!)
    setName(rawName !== null ? rawName : "");
    setAge(rawAge !== null ? rawAge : "");
    setStreakData(rawStreakData ? JSON.parse(rawStreakData) : {'streak': 0, 'date': yesterday});
  }

  const setData = async () => {
    await storeData('name', name);
    await storeData('age', age);
    await storeData('streakData', JSON.stringify(streakData));
  }

  const handleNameTextChange = (nameText: string) => {
    setName(nameText);
  }

  const handleAgeTextChange = (ageText: string) => {
    setAge(ageText);
  }

  useFocusEffect(
    useCallback(() => {
      loadProfileFromServer().then(() => {
        getData();
      });
      return () => {
        setData();
        syncProfileToServer(nameRef.current, ageRef.current, streakDataRef.current);
      }
    }, [])
  );

  return (
      <View style={styles.container}>
        <SafeAreaView style={styles.textContainer}>
            <Text style={[styles.titleText, styles.text]}>Profile</Text>
        </SafeAreaView>
        <View style={styles.container2} >
            <Text style={[styles.text, styles.profileHeader]}>Name: </Text>
            <TextInput
              value={name}
              style={styles.input}
              placeholder='Input name'
              onChangeText={handleNameTextChange}
            ></TextInput>
            <Text style={[styles.text, styles.profileHeader]}>Age: </Text>
            <TextInput
              value={age}
              style={styles.input}
              placeholder='Input age'
              onChangeText={handleAgeTextChange}
            ></TextInput>
            {streakData && <Text style={[styles.text, styles.profileHeader]}>Streak: {streakData.streak}🔥</Text>}
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
    container3: {
      flex: 1,
      justifyContent: 'center'
    },
    titleText: {
      fontSize: 40,
      fontWeight: "bold",
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
    textContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: -40,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 10,
      width: '60%',
      marginLeft: 15,
      marginTop: 10,
      backgroundColor: "white",
    },
});

export default Profile;