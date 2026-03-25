import { retrieveData, storeData } from '@/components/async-storage';

import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [streakData, setStreakData] = useState<any>(null);

  const nameRef = useRef(name);
  const ageRef = useRef(age);

  useEffect(() => { nameRef.current = name; }, [name]);
  useEffect(() => { ageRef.current = age; }, [age]);

  const getData = async () => {
    const rawName = await retrieveData('name');
    const rawAge = await retrieveData('age');
    const rawStreakData = await retrieveData('streakData');
    if (!rawName || !rawAge || !rawStreakData) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setName("");
      setAge("");
      setStreakData({'streak': 0, 'date': yesterday});
      return;
    }
    setName(JSON.parse(rawName));
    setAge(JSON.parse(rawAge));
    setStreakData(JSON.parse(rawStreakData));
  }

  const setData = async () => {
    await storeData('name', JSON.stringify(name));
    await storeData('age', JSON.stringify(age));
    await storeData('streakData', JSON.stringify(streakData));
  }

  const handleNameTextChange = (nameText: string) => {
    setName(nameText);
  }

  const handleAgeTextChange = (ageText: string) => {
    setAge(ageText);
  }
  
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setData();
  }, [name, age]); 

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