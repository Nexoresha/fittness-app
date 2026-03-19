import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useRoute } from '@react-navigation/native';
import { saveWorkout } from "../storage";

const WORKOUT_TYPES = ["Pushups", "Squats", "Running", "Custom"];

export default function AddWorkoutScreen({ navigation }) {
  const route = useRoute();
  const [type, setType] = useState(WORKOUT_TYPES[0]);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  
  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Animation
  const bounceAnim = useRef(new Animated.Value(1)).current;

  // Check if coming from workout plan
  useEffect(() => {
    if (route.params?.workoutPlan) {
      const { level, exercises } = route.params.workoutPlan;
      if (exercises && exercises.length > 0) {
        const firstExercise = exercises[0];
        setType(firstExercise.name);
        setSets(firstExercise.sets.toString());
        setReps(typeof firstExercise.reps === 'string' ? firstExercise.reps : firstExercise.reps.toString());
        setNotes(`${level} Plan: ${exercises.map(e => `${e.name} (${e.sets}x${e.reps})`).join(', ')}`);
      }
    }
  }, [route.params]);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const bounceButton = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSave = async () => {
    if (!sets || !reps) {
      Alert.alert("Error", "Please enter sets and reps");
      return;
    }
    
    bounceButton();
    
    const newWorkout = {
      id: Date.now().toString(),
      type,
      sets: parseInt(sets),
      reps: parseInt(reps),
      weight: weight ? parseFloat(weight) : null,
      notes,
      duration: seconds,
      date: new Date().toISOString()
    };
    
    await saveWorkout(newWorkout);
    setSets("");
    setReps("");
    setWeight("");
    setNotes("");
    setSeconds(0);
    setTimerRunning(false);
    
    Alert.alert("Success", "Workout saved!");
    navigation.goBack();
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Add New Workout</Text>
      
      <Text style={styles.label}>Select Workout Type:</Text>
      <View style={styles.typeContainer}>
        {WORKOUT_TYPES.map(t => (
          <TouchableOpacity 
            key={t}
            style={[styles.typeButton, type === t && styles.typeButtonActive]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Sets:</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={sets} 
          onChangeText={setSets} 
          placeholder="e.g., 3"
        />
      </View>

      <Text style={styles.label}>Reps:</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={reps} 
          onChangeText={setReps} 
          placeholder="e.g., 10"
        />
      </View>

      <Text style={styles.label}>Weight (kg, optional):</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          value={weight}
          onChangeText={setWeight} 
          placeholder="e.g., 20"
        />
      </View>

      <Text style={styles.label}>Notes (Optional):</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          value={notes} 
          onChangeText={setNotes} 
          placeholder="How did it feel today?" 
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Timer: {formatTime(seconds)}</Text>
        <View style={styles.timerButtons}>
          <Button 
            title={timerRunning ? "Stop Timer" : "Start Timer"} 
            onPress={() => setTimerRunning(!timerRunning)} 
            color={timerRunning ? "#dc3545" : "#28a745"}
          />
          {seconds > 0 && !timerRunning && (
             <Button title="Reset" onPress={() => setSeconds(0)} color="#6c757d" />
          )}
        </View>
      </View>

      <View style={styles.saveContainer}>
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <Button title="Save Workout" onPress={handleSave} />
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  contentContainer: { padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: 20,
  },
  label: { 
    fontSize: 16, 
    fontWeight: "bold", 
    marginVertical: 10,
    color: "#2c3e50",
  },
  typeContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderWidth: 2, 
    borderColor: "#007bff", 
    borderRadius: 25, 
    marginRight: 10, 
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  typeButtonActive: { 
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  typeText: { 
    color: "#007bff",
    fontWeight: "600",
  },
  typeTextActive: { 
    color: "#fff",
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#e9ecef", 
    padding: 15, 
    borderRadius: 10, 
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  timerContainer: { 
    padding: 20, 
    backgroundColor: "#fff", 
    borderRadius: 15, 
    alignItems: "center", 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  timerText: { 
    fontSize: 28, 
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  timerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  saveContainer: { 
    marginTop: 20,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
