import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getGoals, saveGoals, getWorkouts } from "../storage";

export default function GoalsScreen() {
  const [pushups, setPushups] = useState("");
  const [squats, setSquats] = useState("");
  const [cardio, setCardio] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const fadeAnim = new Animated.Value(0);
  const pushupProgressAnim = new Animated.Value(0);
  const squatProgressAnim = new Animated.Value(0);
  const cardioProgressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const storedGoals = await getGoals();
        if (storedGoals) {
          setPushups(storedGoals.pushups || "");
          setSquats(storedGoals.squats || "");
          setCardio(storedGoals.cardio || "");
        }
        const storedWorkouts = await getWorkouts();
        setWorkouts(storedWorkouts);

        // Calculate progress and animate after data is loaded
        const today = new Date().toISOString().split('T')[0];
        const todaysWorkouts = storedWorkouts.filter(w => new Date(w.date).toISOString().split('T')[0] === today);
        const pushupProgress = todaysWorkouts.filter(w => w.type.toLowerCase().includes('pushup')).reduce((sum, w) => sum + (w.sets * w.reps), 0) / (parseInt(storedGoals?.pushups) || 1);
        const squatProgress = todaysWorkouts.filter(w => w.type.toLowerCase().includes('squat')).reduce((sum, w) => sum + (w.sets * w.reps), 0) / (parseInt(storedGoals?.squats) || 1);
        const cardioProgress = todaysWorkouts.filter(w => w.type.toLowerCase().includes('running') || w.type.toLowerCase().includes('cardio')).reduce((sum, w) => sum + w.duration, 0) / 60 / (parseInt(storedGoals?.cardio) || 1);

        Animated.timing(pushupProgressAnim, {
          toValue: Math.min(pushupProgress, 1),
          duration: 800,
          useNativeDriver: false,
        }).start();

        Animated.timing(squatProgressAnim, {
          toValue: Math.min(squatProgress, 1),
          duration: 800,
          useNativeDriver: false,
        }).start();

        Animated.timing(cardioProgressAnim, {
          toValue: Math.min(cardioProgress, 1),
          duration: 800,
          useNativeDriver: false,
        }).start();
      };
      loadData();
    }, [])
  );

  const today = new Date().toISOString().split('T')[0];
  const todaysWorkouts = workouts ? workouts.filter(w => new Date(w.date).toISOString().split('T')[0] === today) : [];
  const pushupProgress = todaysWorkouts.filter(w => w.type.toLowerCase().includes('pushup')).reduce((sum, w) => sum + (w.sets * w.reps), 0) / (parseInt(pushups) || 1);
  const squatProgress = todaysWorkouts.filter(w => w.type.toLowerCase().includes('squat')).reduce((sum, w) => sum + (w.sets * w.reps), 0) / (parseInt(squats) || 1);
  const cardioProgress = todaysWorkouts.filter(w => w.type.toLowerCase().includes('running') || w.type.toLowerCase().includes('cardio')).reduce((sum, w) => sum + w.duration, 0) / 60 / (parseInt(cardio) || 1);

  const handleSave = async () => {
    await saveGoals({ pushups, squats, cardio });
    Alert.alert("Success", "Daily goals updated!");
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.header}>Goals & Progress</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pushups Target</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={pushups} 
          onChangeText={setPushups} 
          placeholder="e.g., 50"
        />
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: pushupProgressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
          }) }]} />
        </View>
        <Text>Progress: {Math.round(pushupProgress * 100)}%</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Squats Target</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={squats} 
          onChangeText={setSquats} 
          placeholder="e.g., 50"
        />
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: squatProgressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
          }) }]} />
        </View>
        <Text>Progress: {Math.round(squatProgress * 100)}%</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Cardio (mins)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={cardio} 
          onChangeText={setCardio} 
          placeholder="e.g., 30"
        />
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: cardioProgressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%']
          }) }]} />
        </View>
        <Text>Progress: {Math.round(cardioProgress * 100)}%</Text>
      </View>

      <Button title="Save Goals" onPress={handleSave} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 5, fontSize: 16 },
  progressBar: { height: 10, backgroundColor: '#e9ecef', borderRadius: 5, marginVertical: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#28a745', borderRadius: 5 },
});
