import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const WORKOUT_PLANS = {
  Beginner: [
    { name: "Pushups", sets: 3, reps: 10, difficulty: "Easy", icon: "fitness", color: "#4CAF50" },
    { name: "Squats", sets: 3, reps: 15, difficulty: "Easy", icon: "body", color: "#2196F3" },
    { name: "Plank", sets: 3, reps: "30s", difficulty: "Medium", icon: "timer", color: "#FF9800" },
  ],
  Intermediate: [
    { name: "Pushups", sets: 4, reps: 20, difficulty: "Medium", icon: "fitness", color: "#4CAF50" },
    { name: "Squats", sets: 4, reps: 25, difficulty: "Medium", icon: "body", color: "#2196F3" },
    { name: "Burpees", sets: 3, reps: 10, difficulty: "Hard", icon: "flame", color: "#F44336" },
  ],
  Advanced: [
    { name: "Pushups", sets: 5, reps: 30, difficulty: "Hard", icon: "fitness", color: "#4CAF50" },
    { name: "Squats", sets: 5, reps: 40, difficulty: "Hard", icon: "body", color: "#2196F3" },
    { name: "Mountain Climbers", sets: 4, reps: "1 min", difficulty: "Hard", icon: "walk", color: "#9C27B0" },
  ],
};

export default function WorkoutPlansScreen({ navigation }) {
  const startWorkout = (level, exercises) => {
    // Navigate to Add Workout screen with the plan data
    navigation.navigate('Add Workout', { 
      workoutPlan: { level, exercises },
      fromPlan: true 
    });
  };

  const getDifficultyStyle = (level) => {
    switch (level) {
      case 'Beginner': return { backgroundColor: '#4CAF50' };
      case 'Intermediate': return { backgroundColor: '#FF9800' };
      case 'Advanced': return { backgroundColor: '#F44336' };
      default: return { backgroundColor: '#666' };
    }
  };

  const getDifficultyChipStyle = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return { backgroundColor: '#4CAF5020', borderColor: '#4CAF50' };
      case 'Medium': return { backgroundColor: '#FF980020', borderColor: '#FF9800' };
      case 'Hard': return { backgroundColor: '#F4433620', borderColor: '#F44336' };
      default: return { backgroundColor: '#66666620', borderColor: '#666' };
    }
  };
  const renderPlan = (level, exercises) => (
    <View key={level} style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="trophy" size={24} color="#FFD700" />
        <Text style={styles.sectionTitle}>{level} Plan</Text>
        <View style={[styles.difficultyBadge, getDifficultyStyle(level)]}>
          <Text style={styles.difficultyText}>{level.toUpperCase()}</Text>
        </View>
      </View>
      
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={[styles.iconContainer, { backgroundColor: exercise.color + '20' }]}>
              <Ionicons name={exercise.icon} size={20} color={exercise.color} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="repeat" size={14} color="#666" />
                  <Text style={styles.detailText}>{exercise.sets} sets</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="stats-chart" size={14} color="#666" />
                  <Text style={styles.detailText}>{exercise.reps} reps</Text>
                </View>
                <View style={[styles.difficultyChip, getDifficultyChipStyle(exercise.difficulty)]}>
                  <Text style={styles.chipText}>{exercise.difficulty}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.startButton} onPress={() => startWorkout(level, exercises)}>
        <Ionicons name="play" size={20} color="#fff" />
        <Text style={styles.startButtonText}>Start Workout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Workout Plans</Text>
      {Object.entries(WORKOUT_PLANS).map(([level, exercises]) => renderPlan(level, exercises))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f8f9fa" 
  },
  header: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 25, 
    textAlign: "center",
    color: "#2c3e50",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: { 
    marginBottom: 30,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginLeft: 10,
    color: "#2c3e50",
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  exerciseCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 8,
    color: "#2c3e50",
  },
  exerciseDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  difficultyChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 5,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  startButton: { 
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  startButtonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold",
    marginLeft: 8,
  },
});