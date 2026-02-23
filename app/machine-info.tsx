import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MACHINES } from "../data/machines";

const { width, height } = Dimensions.get("window");

const MachineInfo = () => {
  const { id } = useLocalSearchParams();
  const machine = MACHINES.find(m => m.id === id);
  const imageSource = machine?.image_loc;
  const videoSource = machine?.video_loc;
  const player = useVideoPlayer(videoSource, (player) => {
      player.loop = true;
      player.play();
  });

  return (
    <SafeAreaProvider>
      <LinearGradient 
        colors={['#ffffff', '#888888', '#000000']}
        style={styles.container}
      >
        <Text style={[styles.title, styles.text]}>{machine?.name}</Text>
        <Text style={[styles.description, styles.text]}>{machine?.description}</Text>
        {videoSource && <VideoView
          player={player}
          style={styles.video}
        />}
        {imageSource && <Image 
          source={imageSource} 
          style={styles.image} 
        />}
        <View style={[styles.container, styles.listContainer]}>
          <Text style={[styles.header, styles.text]}>Muscle Groups</Text>
          <FlatList
            data={machine?.muscle_groups}
            scrollEnabled={false}
            style={{flexGrow: 0}}
            renderItem={({item}) => 
              <Text style={{fontSize: 20, alignSelf: "center"}}>
                {item}
              </Text>
            }
          />
        </View>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  listContainer: {
    flex: 0,
    padding: 10,
    borderWidth: 5,
    borderRadius: 20,
    borderColor: "#000000",
    backgroundColor: "#8d8d8d",
  },
  text: {
    fontFamily: "inter",
    fontWeight: 600,
    marginBottom: 10
  },
  title: {
    fontSize: 25,
    fontWeight: 600,
    marginTop: 10,
    textDecorationLine: "underline"
  },
  header: {
    fontSize: 20,
    fontWeight: 600,
    textDecorationLine: "underline"
  },
  description: {
    fontSize: 20,
    fontWeight: 600,
    backgroundColor: "#8d8d8d",
    borderRadius: 10,
    color: "#ffffff",
    padding: 10,
    width: '95%'
  },
  video: { 
    width: '95%', 
    height: height * 0.3,
    marginBottom: 10
  },
  image: {
    width: '95%',
    height: height * 0.3,
    marginBottom: 10
  }
});

export default MachineInfo;