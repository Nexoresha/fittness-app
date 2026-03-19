import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';

const ACTIVITIES = [
  { name: "Walking", met: 3.8 },
  { name: "Running", met: 8.3 },
  { name: "Cycling", met: 6.8 },
  { name: "Swimming", met: 7.0 },
  { name: "Jumping Rope", met: 10.0 },
];

export default function CalorieBurnScreen() {
  const [weight, setWeight] = useState("");
  const [time, setTime] = useState("");
  const [activity, setActivity] = useState(ACTIVITIES[0].name);
  const [calories, setCalories] = useState(null);

  const calculateCalories = () => {
    if (!weight || !time) {
      Alert.alert("Error", "Please enter weight and time");
      return;
    }
    const met = ACTIVITIES.find(a => a.name === activity).met;
    const burned = met * parseFloat(weight) * (parseFloat(time) / 60);
    setCalories(burned.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calorie Burn Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (minutes)"
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />
      <Picker
        selectedValue={activity}
        style={styles.picker}
        onValueChange={setActivity}
      >
        {ACTIVITIES.map(a => (
          <Picker.Item key={a.name} label={a.name} value={a.name} />
        ))}
      </Picker>
      <Button title="Calculate" onPress={calculateCalories} />
      {calories && (
        <Text style={styles.result}>Calories Burned: {calories}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 10, borderRadius: 5 },
  picker: { height: 50, width: '100%', marginBottom: 20 },
  result: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 20 },
});