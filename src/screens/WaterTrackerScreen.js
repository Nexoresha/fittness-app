import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ProgressBarAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getWater, saveWater } from "../storage";

const GLASSES_GOAL = 8;

export default function WaterTrackerScreen() {
  const [water, setWater] = useState({ count: 0, date: new Date().toISOString().split('T')[0] });

  useFocusEffect(
    useCallback(() => {
      const loadWater = async () => {
        const stored = await getWater();
        const today = new Date().toISOString().split('T')[0];
        if (stored.date !== today) {
          // Reset for new day
          const newWater = { count: 0, date: today };
          setWater(newWater);
          await saveWater(newWater);
        } else {
          setWater(stored);
        }
      };
      loadWater();
    }, [])
  );

  const addGlass = async () => {
    if (water.count < GLASSES_GOAL) {
      const newCount = water.count + 1;
      const updated = { ...water, count: newCount };
      setWater(updated);
      await saveWater(updated);
    }
  };

  const reset = async () => {
    const updated = { ...water, count: 0 };
    setWater(updated);
    await saveWater(updated);
  };

  const progress = water.count / GLASSES_GOAL;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Water Tracker</Text>
      <Text style={styles.count}>{water.count} / {GLASSES_GOAL} glasses</Text>
      <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} style={styles.progress} />
      <TouchableOpacity style={styles.button} onPress={addGlass} disabled={water.count >= GLASSES_GOAL}>
        <Text style={styles.buttonText}>Add Glass</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  count: { fontSize: 48, fontWeight: "bold", marginBottom: 20, color: "#007bff" },
  progress: { width: '80%', height: 20, marginBottom: 30 },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 10, marginBottom: 10, width: '60%', alignItems: "center" },
  resetButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});