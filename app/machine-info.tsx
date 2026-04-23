import { useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ViewMoreText from 'react-native-view-more-text';
import { MACHINES } from "../data/machines";

const { width, height } = Dimensions.get("window");

const MachineInfo = () => {
  const { id } = useLocalSearchParams();
  const machine = MACHINES.find(m => m.id === id);
  const imageSource = machine?.image_loc;
  const videoSource = machine?.video_loc;
  const player = useVideoPlayer(videoSource || "null", (player) => {
      player.loop = true;
      player.play();
  });
  const [isVideoReady, setIsVideoReady] = useState(imageSource ? true : false);
  useEventListener(player, 'statusChange', ({ status }) => {
    if (status == 'readyToPlay' || status == 'error') {
      setIsVideoReady(true);
    }
  });

  return (
    <SafeAreaProvider>
      <LinearGradient 
        colors={['#ffffff', '#888888', '#000000']}
        style={styles.container}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, styles.text]}>{machine?.name}</Text>
          <Text style={[styles.description, styles.descriptionSize, styles.text]}>{machine?.description}</Text>
          {videoSource && <VideoView
            player={player}
            style={styles.video}
          />}
          {!isVideoReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
          )}
          {imageSource && <Image 
            source={imageSource} 
            style={styles.image} 
          />}
          {videoSource && 
            <View style={styles.description}>
              <ViewMoreText
                numberOfLines={1}
                renderViewMore={(onPress) => (
                  <Text style={[styles.text, styles.transcriptButton]} onPress={onPress}>View More Transcript</Text>)
                }
                renderViewLess={(onPress) => (
                  <Text style={[styles.text, styles.transcriptButton]} onPress={onPress}>View Less Transcript</Text>)
                }
                textStyle={{textAlign: 'center'}}
              >
              <Text style={[styles.text, styles.description, styles.transcriptSize]}>
                {machine?.video_transcript || "No transcript available."}
              </Text>
            </ViewMoreText> 
          </View>}
          {imageSource && machine?.recommended_exercises &&
            <View style={styles.description}>
              <Text style={[styles.text, styles.header]}>
                {"Recommended Exercises:"}
              </Text>
              <Text style={[styles.text, styles.transcriptSize]}>
                {machine?.recommended_exercises?.join("\n")}
              </Text>
            </View>
          }
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
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 0,
    padding: 10,
    marginTop: 10,
    borderWidth: 5,
    borderRadius: 20,
    borderColor: "#000000",
    backgroundColor: "#8d8d8d",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40, // Adds extra space at the bottom so content doesn't hug the screen edge
  },
  text: {
    fontWeight: 500,
    marginBottom: 10,
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
    backgroundColor: "#8d8d8d",
    borderRadius: 10,
    borderWidth: 3,
    padding: 10,
    width: '95%'
  },
  descriptionSize: {
    fontSize: 20,
    fontWeight: 600,
  },
  transcriptSize: {
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 22,
  },
  transcriptButton: {
    fontSize: 18,
    fontWeight: 400,
    textDecorationLine: "underline",
    alignSelf: "center"
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
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  }
});

export default MachineInfo;