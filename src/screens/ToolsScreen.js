import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function ToolsScreen({ navigation }) {
  const tools = [
    { name: "Workout Plans", screen: "WorkoutPlans" },
    { name: "Exercise Library", screen: "ExerciseLibrary" },
    { name: "Nutrition Tracker", screen: "NutritionTracker" },
    { name: "Water Tracker", screen: "WaterTracker" },
    { name: "BMI Calculator", screen: "BMICalculator" },
    { name: "Step Counter", screen: "StepCounter" },
    { name: "Sleep Tracker", screen: "SleepTracker" },
    { name: "Motivation", screen: "Motivation" },
    { name: "Calorie Burn Calculator", screen: "CalorieBurn" },
    { name: "Body Measurements", screen: "BodyMeasurements" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Tools</Text>
      {tools.map((tool, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate(tool.screen)}
        >
          <Text style={styles.buttonText}>{tool.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginBottom: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});