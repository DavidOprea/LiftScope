import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function RemoveLogButton({ onPress } : Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Ionicons name="remove" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    padding: 5,
    backgroundColor: '#3a3e43',
  }
});