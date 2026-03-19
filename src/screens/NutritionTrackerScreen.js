import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getNutrition, saveNutrition } from "../storage";

export default function NutritionTrackerScreen() {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [nutrition, setNutrition] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadNutrition = async () => {
        const stored = await getNutrition();
        setNutrition(stored);
      };
      loadNutrition();
    }, [])
  );

  const handleAdd = async () => {
    if (!foodName || !calories) {
      Alert.alert("Error", "Please enter food name and calories");
      return;
    }
    const newFood = {
      id: Date.now().toString(),
      name: foodName,
      calories: parseInt(calories),
      date: new Date().toISOString()
    };
    const updated = await saveNutrition(newFood);
    setNutrition(updated);
    setFoodName("");
    setCalories("");
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysNutrition = nutrition.filter(n => new Date(n.date).toISOString().split('T')[0] === today);
  const totalCalories = todaysNutrition.reduce((sum, n) => sum + n.calories, 0);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.name} - {item.calories} cal</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nutrition Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Food name"
        value={foodName}
        onChangeText={setFoodName}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />
      <Button title="Add Food" onPress={handleAdd} />
      <Text style={styles.total}>Total Calories Today: {totalCalories}</Text>
      <FlatList
        data={todaysNutrition}
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
  item: { padding: 10, backgroundColor: "#f8f9fa", marginBottom: 5, borderRadius: 5 },
});