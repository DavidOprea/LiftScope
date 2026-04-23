import AddButton from '@/components/add-button';
import { retrieveData, storeData } from "@/components/async-storage";
import ListButton from '@/components/list-button';

import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const syncLogsToServer = async () => {
    try {
        const userId = await retrieveData('userId') || 'admin';
        const logCountRaw = await retrieveData('log_count');
        const log_count = Number(logCountRaw) || 0;

        const allLogs = [];
        for (let i = 0; i < log_count; i++) {
            const logRaw = await retrieveData(`log_${i}`);
            if (logRaw) {
                allLogs.push(JSON.parse(logRaw));
            }
        }

        const response = await fetch('https://liftscope.onrender.com/logs/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({logs : allLogs, userId: userId}) // Replace 'admin' with actual user ID if available
        });

        if (!response.ok) {
            console.log('Failed to sync logs:', response.statusText);
        }
    } catch (error) {
        console.log('Error syncing logs:', error);
    }
}

const loadLogsFromServer = async () => {
    try {
        const userId = await retrieveData('userId') || 'admin';
        const response = await fetch(`https://liftscope.onrender.com/logs/get?userId=${userId}`); // Replace 'admin' with actual user ID if available
        
        if (!response.ok) {
            throw new Error('Failed to load logs: ' + response.statusText);
        }
        
        const logData = await response.json();
        const logCountRaw = await retrieveData('log_count');
        const localLogCount = Number(logCountRaw) || 0;

        console.log("Received logs from server:", logData);

        for (const log of logData.logs) {
            const localLog = await retrieveData(`log_${log.id}`);
            if (!localLog) {
                await storeData(`log_${log.id}`, JSON.stringify(log));

                if (log.id >= localLogCount) {
                    await storeData('log_count', (log.id + 1).toString());
                }
            }
        }

    } catch (error) {
        console.log('Error loading logs from server:', error);
    }
}

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

    const addNewLog = () => {
        router.push({
            pathname: "/log-edit"
        });
    }

    const openLog = (logId: string) => {
        router.push({
            pathname: "/log-page",
            params: { id: logId }
        });
    }

    useFocusEffect(
        useCallback(() => {
            loadLogsFromServer();
            getLogs(); 
            return () => {
                syncLogsToServer();
            }
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
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <ListButton item={item} onPress={() => openLog(item.id.toString())}/>
                    )}
                />
            </View>
            <View style={styles.buttonContainer}>
                <AddButton onPress={addNewLog} />
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