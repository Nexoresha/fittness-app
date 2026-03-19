import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Pedometer } from 'expo-sensors';
import { getSteps, saveSteps } from "../storage";

const STEP_GOAL = 10000;

export default function StepCounterScreen() {
  const [steps, setSteps] = useState({ count: 0, date: new Date().toISOString().split('T')[0] });
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [subscription, setSubscription] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const loadSteps = async () => {
        const stored = await getSteps();
        const today = new Date().toISOString().split('T')[0];
        if (stored.date !== today) {
          const newSteps = { count: 0, date: today };
          setSteps(newSteps);
          await saveSteps(newSteps);
        } else {
          setSteps(stored);
        }
      };
      loadSteps();
    }, [])
  );

  useEffect(() => {
    // Check pedometer availability
    Pedometer.isAvailableAsync().then(
      result => {
        setIsPedometerAvailable(result ? 'available' : 'unavailable');
      },
      error => {
        setIsPedometerAvailable('unavailable');
        console.error(error);
      }
    );

    // Subscribe to pedometer
    const sub = Pedometer.watchStepCount(result => {
      setSteps(prev => {
        const newCount = prev.count + result.steps;
        const updated = { ...prev, count: newCount };
        saveSteps(updated);
        return updated;
      });
    });
    setSubscription(sub);

    return () => {
      if (sub) {
        sub.remove();
      }
    };
  }, []);

  const addSteps = async (amount) => {
    const newCount = steps.count + amount;
    const updated = { ...steps, count: newCount };
    setSteps(updated);
    await saveSteps(updated);
    if (newCount >= STEP_GOAL) {
      Alert.alert("Congratulations!", "You've reached your daily step goal!");
    }
  };

  const reset = async () => {
    const updated = { ...steps, count: 0 };
    setSteps(updated);
    await saveSteps(updated);
  };

  const progress = Math.min(steps.count / STEP_GOAL, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step Counter</Text>
      <Text style={styles.availability}>
        Pedometer: {isPedometerAvailable === 'checking' ? 'Checking...' : isPedometerAvailable === 'available' ? 'Available' : 'Unavailable'}
      </Text>
      <Text style={styles.count}>{steps.count.toLocaleString()} / {STEP_GOAL.toLocaleString()} steps</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      {isPedometerAvailable === 'unavailable' && (
        <View style={styles.manual}>
          <Text style={styles.manualText}>Pedometer not available. Add steps manually:</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={() => addSteps(100)}>
              <Text style={styles.buttonText}>+100</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => addSteps(500)}>
              <Text style={styles.buttonText}>+500</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => addSteps(1000)}>
              <Text style={styles.buttonText}>+1000</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  availability: { fontSize: 14, color: "#6c757d", marginBottom: 20 },
  count: { fontSize: 48, fontWeight: "bold", marginBottom: 20, color: "#007bff" },
  progressBar: { width: '80%', height: 20, backgroundColor: "#e9ecef", borderRadius: 10, marginBottom: 30 },
  progressFill: { height: '100%', backgroundColor: "#28a745", borderRadius: 10 },
  manual: { alignItems: "center", marginBottom: 20 },
  manualText: { fontSize: 16, marginBottom: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-around", width: '100%', marginBottom: 20 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, width: 80, alignItems: "center" },
  resetButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});