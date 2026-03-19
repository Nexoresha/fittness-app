import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getWorkouts } from "../storage";

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadWorkouts = async () => {
        const stored = await getWorkouts();
        setWorkouts(stored);
      };
      loadWorkouts();
    }, [])
  );

  const renderItem = ({ item }) => {
    const d = new Date(item.date);
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.date}>{d.toLocaleDateString()} {d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
        </View>
        <Text style={styles.value}>Sets: {item.sets} | Reps: {item.reps}{item.weight ? ` | Weight: ${item.weight}kg` : ''}</Text>
        {item.duration > 0 && <Text style={styles.duration}>Timer: {item.duration}s</Text>}
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {workouts.length === 0 ? (
        <Text style={styles.empty}>No workouts yet. Start exercising!</Text>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#6c757d" },
  card: { backgroundColor: "#f8f9fa", padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#e9ecef" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  type: { fontSize: 18, fontWeight: "bold", color: "#007bff" },
  date: { color: "#6c757d", fontSize: 14 },
  value: { fontSize: 16, fontWeight: "500" },
  duration: { fontSize: 14, color: "#28a745", marginTop: 5 },
  notes: { marginTop: 10, fontStyle: "italic", color: "#495057" }
});
