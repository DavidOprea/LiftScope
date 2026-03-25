import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
    onPress: () => void;
}

export default function CameraButton({ onPress } : Props) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.captureBtn}>
            <View style={styles.captureInner} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center'},
    captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white'}
});