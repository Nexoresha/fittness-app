import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBMI, saveBMI } from "../storage";

export default function BMICalculatorScreen() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmiData, setBmiData] = useState({ height: '', weight: '', bmi: null, category: '' });

  useFocusEffect(
    useCallback(() => {
      const loadBMI = async () => {
        const stored = await getBMI();
        setBmiData(stored);
        setHeight(stored.height);
        setWeight(stored.weight);
      };
      loadBMI();
    }, [])
  );

  const calculateBMI = () => {
    const h = parseFloat(height) / 100; // cm to m
    const w = parseFloat(weight);
    if (!h || !w) {
      Alert.alert("Error", "Please enter height and weight");
      return;
    }
    const bmi = (w / (h * h)).toFixed(2);
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    const newData = { height, weight, bmi: parseFloat(bmi), category };
    setBmiData(newData);
    saveBMI(newData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>BMI Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <Button title="Calculate BMI" onPress={calculateBMI} />
      {bmiData.bmi && (
        <View style={styles.result}>
          <Text style={styles.bmi}>BMI: {bmiData.bmi}</Text>
          <Text style={styles.category}>Category: {bmiData.category}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 10, borderRadius: 5 },
  result: { marginTop: 20, alignItems: "center" },
  bmi: { fontSize: 24, fontWeight: "bold", color: "#007bff" },
  category: { fontSize: 18, marginTop: 10 },
});