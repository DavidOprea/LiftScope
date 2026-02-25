import { retrieveData } from "@/components/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Library = () => {
  const machineData = require("../../data/machines").MACHINES;
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [filteredMachineData, setFilteredMachineData] = useState(machineData)
  const [unlockedMachines, setUnlockedMachines] = useState<{ [key: string]: boolean }>({});

  useFocusEffect(
    useCallback(() => {
      const fetchUnlockedMachines = async () => {
        const unlocked : { [key: string]: boolean } = {};
        for (const machine of machineData) {
          const isUnlocked = await retrieveData(machine.id);
          console.log(`Machine ${machine.id} unlocked: `, isUnlocked);
          unlocked[machine.id] = isUnlocked !== null ? true : false;
        }
        setUnlockedMachines(unlocked);
      };
      fetchUnlockedMachines();
    }, [])
  );

  const handleMachineClick = (machineId: string) => {
    router.push({
      pathname: "/machine-info",
      params: { id: machineId }
    });
  }

  const handleSearchFilter = (text: string) => {
    setSearchVal(text);

    if (text.trim() === '') {
      setFilteredMachineData(machineData);
      return;
    }

    const newData = machineData.filter((item: { name: string; }) => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.includes(textData);
    })

    setFilteredMachineData(newData);
  }

  return (
    <View style={styles.container2}>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={handleSearchFilter}
          value={searchVal}
          placeholder="Search for a machine..."
          placeholderTextColor="black"
        />
      </SafeAreaView>

      <View 
        style={styles.container2}
      >
        <FlatList
          data={filteredMachineData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            (unlockedMachines[item.id]) ? (
              <TouchableOpacity onPress={() => handleMachineClick(item.id)} >
                <LinearGradient
                  colors={['#ffffff', '#888888', '#000000']}
                  style={styles.listContainer}
                >
                  <Text style={styles.text} numberOfLines={1}>{item.id}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled = {true} style={{ opacity: 0.5 }} >
                <LinearGradient
                  colors={['#ffffff', '#888888', '#000000']}
                  style={styles.listContainer}
                >
                  <Text style={styles.text}>???</Text>
                </LinearGradient>
              </TouchableOpacity>
            )
          )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#575757"
  },
  container2: {
    flex: 1,
    backgroundColor: "#1d1b1b"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginTop: 20,
    marginBottom: -30,
    backgroundColor: "white",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 80,
    paddingVertical: 20,
    margin: 5,
    alignItems: "center",
  },
  text : {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter",
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1}
  }
});

export default Library;