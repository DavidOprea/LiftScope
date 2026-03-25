import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'

type itemJSON = {
  id: number;
  text: string;
  date: Date;
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
        <Text style={[styles.listText, styles.text]} numberOfLines={1}>{`Log ${item.id}: ${item.date.toLocaleDateString()}`}</Text>
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