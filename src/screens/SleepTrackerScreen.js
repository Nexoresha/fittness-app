import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getSleep, saveSleep } from "../storage";

export default function SleepTrackerScreen() {
  const [hours, setHours] = useState("");
  const [sleep, setSleep] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadSleep = async () => {
        const stored = await getSleep();
        setSleep(stored);
      };
      loadSleep();
    }, [])
  );

  const handleAdd = async () => {
    if (!hours) {
      Alert.alert("Error", "Please enter sleep hours");
      return;
    }
    const newSleep = {
      id: Date.now().toString(),
      hours: parseFloat(hours),
      date: new Date().toISOString()
    };
    const updated = await saveSleep(newSleep);
    setSleep(updated);
    setHours("");
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysSleep = sleep.filter(s => new Date(s.date).toISOString().split('T')[0] === today);
  const totalHours = todaysSleep.reduce((sum, s) => sum + s.hours, 0);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.hours} hours - {new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sleep Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Hours slept"
        keyboardType="numeric"
        value={hours}
        onChangeText={setHours}
      />
      <Button title="Add Sleep" onPress={handleAdd} />
      <Text style={styles.total}>Total Sleep Today: {totalHours} hours</Text>
      <Text style={styles.recommendation}>
        Recommended: 7-9 hours per night
      </Text>
      <FlatList
        data={sleep.slice(0, 10)} // Last 10 entries
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 10, borderRadius: 5 },
  total: { fontSize: 18, fontWeight: "bold", marginVertical: 20, textAlign: "center" },
  recommendation: { fontSize: 14, color: "#6c757d", textAlign: "center", marginBottom: 20 },
  item: { padding: 10, backgroundColor: "#f8f9fa", marginBottom: 5, borderRadius: 5 },
});