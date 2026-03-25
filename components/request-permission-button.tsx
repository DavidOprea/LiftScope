import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
    onPress: () => void;
}

export default function RequestPermissionButton({ onPress } : Props) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.btn}>
            <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8 },
    btnText: { color: 'white' }
});