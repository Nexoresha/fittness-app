import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from "./src/screens/HomeScreen";
import AddWorkoutScreen from "./src/screens/AddWorkoutScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import GoalsScreen from "./src/screens/GoalsScreen";
import ToolsScreen from "./src/screens/ToolsScreen";
import WorkoutPlansScreen from "./src/screens/WorkoutPlansScreen";
import ExerciseLibraryScreen from "./src/screens/ExerciseLibraryScreen";
import NutritionTrackerScreen from "./src/screens/NutritionTrackerScreen";
import WaterTrackerScreen from "./src/screens/WaterTrackerScreen";
import BMICalculatorScreen from "./src/screens/BMICalculatorScreen";
import StepCounterScreen from "./src/screens/StepCounterScreen";
import SleepTrackerScreen from "./src/screens/SleepTrackerScreen";
import MotivationScreen from "./src/screens/MotivationScreen";
import CalorieBurnScreen from "./src/screens/CalorieBurnScreen";
import BodyMeasurementsScreen from "./src/screens/BodyMeasurementsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ToolsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#f8f9fa" }, headerTitleStyle: { fontWeight: "bold" } }}>
      <Stack.Screen name="Tools" component={ToolsScreen} />
      <Stack.Screen name="WorkoutPlans" component={WorkoutPlansScreen} />
      <Stack.Screen name="ExerciseLibrary" component={ExerciseLibraryScreen} />
      <Stack.Screen name="NutritionTracker" component={NutritionTrackerScreen} />
      <Stack.Screen name="WaterTracker" component={WaterTrackerScreen} />
      <Stack.Screen name="BMICalculator" component={BMICalculatorScreen} />
      <Stack.Screen name="StepCounter" component={StepCounterScreen} />
      <Stack.Screen name="SleepTracker" component={SleepTrackerScreen} />
      <Stack.Screen name="Motivation" component={MotivationScreen} />
      <Stack.Screen name="CalorieBurn" component={CalorieBurnScreen} />
      <Stack.Screen name="BodyMeasurements" component={BodyMeasurementsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f9fa" },
          headerTitleStyle: { fontWeight: "bold" },
          tabBarActiveTintColor: "#007bff",
          tabBarInactiveTintColor: "#6c757d",
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Add Workout" 
          component={AddWorkoutScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Goals" 
          component={GoalsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trophy" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Tools" 
          component={ToolsStack} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
