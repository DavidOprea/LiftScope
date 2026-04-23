import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type itemJSON = {
  id: number;
  text: string;
  title: string;
};

type Props = {
  item: itemJSON
  onPress: () => void;
};

export default function ListButton({ item, onPress } : Props) {
  return (
    <TouchableOpacity onPress={onPress} >
      <LinearGradient
        colors={['#ffffff', '#888888', '#000000']}
        style={styles.listContainer}
      >
        <Text style={[styles.listText, styles.text]} numberOfLines={1}>{`${item.title}`}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 80,
    paddingVertical: 20,
    margin: 5,
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter",
    color: 'white',
  },
  listText: {
    fontSize: 18,
  },
})