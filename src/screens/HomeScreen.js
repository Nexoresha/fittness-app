import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Button, ProgressBarAndroid, Animated, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { getWorkouts, calculateStreak, getGoals, getNutrition, getWater, getSteps, getSleep } from "../storage";

export default function HomeScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [streak, setStreak] = useState(0);
  const [nutrition, setNutrition] = useState([]);
  const [water, setWater] = useState({ count: 0 });
  const [steps, setSteps] = useState({ count: 0 });
  const [sleep, setSleep] = useState([]);
  const fadeAnim = new Animated.Value(0);
  const workoutProgressAnim = new Animated.Value(0);
  const waterProgressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Load data each time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const storedWorkouts = await getWorkouts();
        setWorkouts(storedWorkouts);
        setStreak(calculateStreak(storedWorkouts));

        const storedNutrition = await getNutrition();
        setNutrition(storedNutrition);

        const storedWater = await getWater();
        setWater(storedWater);

        const storedSteps = await getSteps();
        setSteps(storedSteps);

        const storedSleep = await getSleep();
        setSleep(storedSleep);

        // Animate progress bars after data is loaded
        const today = new Date().toISOString().split('T')[0];
        const todaysWorkouts = storedWorkouts.filter(w => new Date(w.date).toISOString().split('T')[0] === today);
        Animated.timing(workoutProgressAnim, {
          toValue: todaysWorkouts.length / 5,
          duration: 800,
          useNativeDriver: false,
        }).start();

        Animated.timing(waterProgressAnim, {
          toValue: storedWater.count / 8,
          duration: 800,
          useNativeDriver: false,
        }).start();
      };
      loadData();
    }, [])
  );

  const today = new Date().toISOString().split('T')[0];
  const todaysWorkouts = workouts ? workouts.filter(w => new Date(w.date).toISOString().split('T')[0] === today) : [];
  const todaysNutrition = nutrition ? nutrition.filter(n => new Date(n.date).toISOString().split('T')[0] === today) : [];
  const totalCalories = todaysNutrition.reduce((sum, n) => sum + n.calories, 0);
  const todaysSleep = sleep ? sleep.filter(s => new Date(s.date).toISOString().split('T')[0] === today) : [];
  const totalSleep = todaysSleep.reduce((sum, s) => sum + s.hours, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.headerContainer}>
          <Ionicons name="fitness" size={32} color="#007bff" />
          <Text style={styles.header}>Fitness Dashboard</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="today" size={20} color="#007bff" />
            <Text style={styles.cardTitle}>Today's Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Ionicons name="barbell" size={24} color="#4CAF50" />
              <Text style={styles.summaryValue}>{todaysWorkouts.length}</Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="restaurant" size={24} color="#FF9800" />
              <Text style={styles.summaryValue}>{totalCalories}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="water" size={24} color="#2196F3" />
              <Text style={styles.summaryValue}>{water.count}/8</Text>
              <Text style={styles.summaryLabel}>Glasses</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="walk" size={24} color="#9C27B0" />
              <Text style={styles.summaryValue}>{steps.count.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Steps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="moon" size={24} color="#607D8B" />
              <Text style={styles.summaryValue}>{totalSleep}</Text>
              <Text style={styles.summaryLabel}>Sleep (hrs)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Ionicons name="trending-up" size={20} color="#007bff" />
            <Text style={styles.progressTitle}>Daily Progress</Text>
          </View>
          
          <View style={styles.progressItem}>
            <View style={styles.progressLabelContainer}>
              <Ionicons name="barbell" size={16} color="#4CAF50" />
              <Text style={styles.progressLabel}>Workout Goal</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: workoutProgressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) }]} />
            </View>
            <Text style={styles.progressText}>{todaysWorkouts.length}/5 completed</Text>
          </View>
          
          <View style={styles.progressItem}>
            <View style={styles.progressLabelContainer}>
              <Ionicons name="water" size={16} color="#2196F3" />
              <Text style={styles.progressLabel}>Water Goal</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: waterProgressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }) }]} />
            </View>
            <Text style={styles.progressText}>{water.count}/8 glasses</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="trophy" size={28} color="#FFD700" />
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="flame" size={28} color="#FF5722" />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button 
            title="Add New Workout" 
            onPress={() => navigation.navigate("Add Workout")}
          />
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  contentContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  header: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginLeft: 10,
    color: "#2c3e50",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: { 
    padding: 20, 
    backgroundColor: "#fff", 
    borderRadius: 20, 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginLeft: 10,
    color: "#2c3e50",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    width: "30%",
    marginBottom: 15,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    textAlign: "center",
  },
  progressContainer: { 
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 10,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginLeft: 8,
  },
  progressBar: { 
    height: 12, 
    backgroundColor: '#e9ecef', 
    borderRadius: 6, 
    marginBottom: 5, 
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: '#007bff', 
    borderRadius: 6,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  statsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: { 
    flex: 1, 
    alignItems: "center", 
    padding: 20, 
    backgroundColor: "#fff", 
    borderRadius: 15, 
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  statValue: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#007bff",
    marginTop: 10,
  },
  statLabel: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 5,
    textAlign: "center",
  },
  buttonContainer: { 
    marginTop: 20,
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
