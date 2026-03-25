import AddLogButton from '@/components/add-log-button';
import { retrieveData, storeData } from '@/components/async-storage';
import ListButton from '@/components/list-button';

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Logs = () => {
    const router = useRouter();
    const [logs, setLogs] = useState<any[]>([]);

    const getLogs = async () => {
        const loaded_logs = [];
        const logCountRaw = await retrieveData('log_count');
        const log_count = Number(logCountRaw) || 0; 
        
        if (log_count === 0) {
            setLogs([]);
            return;
        }

        for (let i = 0; i < log_count; i++) {
            const raw = await retrieveData(`log_${i}`);
            if (!raw) continue;
            let data = JSON.parse(raw);
            if (data && data.date) {
                data.date = new Date(data.date);
            }
            loaded_logs.push(data);
        }
        setLogs(loaded_logs);
    }

    const addNewLog = async () => {
        const logCountRaw = await retrieveData('log_count');
        let log_count = Number(logCountRaw) || 0;
        const today = new Date();
        today.setDate(today.getDate() - 1);
        
        const new_log = {
            id: log_count,
            text: "",
            date: today
        };

        await storeData(`log_${log_count}`, JSON.stringify(new_log));
        log_count++;
        await storeData('log_count', log_count.toString());
        
        openLog(new_log.id.toString());
    }

    const openLog = (logId: string) => {
        router.push({
            pathname: "/log-page",
            params: { id: logId }
        });
    }

    useFocusEffect(
        useCallback(() => {
            getLogs(); 
        }, [])
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.textContainer}>
                <Text style={[styles.titleText, styles.text]}>Logs</Text>
            </SafeAreaView>
            <View style={styles.container2} >
                <FlatList
                    data={logs}
                    // Fix: Use the actual item ID instead of the array index
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <ListButton item={item} onPress={() => openLog(item.id.toString())}/>
                    )}
                />
            </View>
            <View style={styles.buttonContainer}>
                <AddLogButton onPress={addNewLog} />
            </View>
        </View>
    )
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
    titleText: {
        fontSize: 40,
        fontWeight: "bold",
    },
    text: {
        fontFamily: "Inter",
        color: 'white',
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: -40,
    },
    buttonContainer: {
        justifyContent: 'center',
    }
});

export default Logs;