import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function AddButton({ onPress } : Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 5,
    backgroundColor: '#3a3e43',
  }
});