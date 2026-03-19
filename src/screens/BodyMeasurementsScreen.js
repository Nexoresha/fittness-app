import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMeasurements, saveMeasurements } from "../storage";

export default function BodyMeasurementsScreen() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [waist, setWaist] = useState("");
  const [measurements, setMeasurements] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadMeasurements = async () => {
        const stored = await getMeasurements();
        setMeasurements(stored);
      };
      loadMeasurements();
    }, [])
  );

  const handleAdd = async () => {
    if (!weight || !height) {
      Alert.alert("Error", "Please enter weight and height");
      return;
    }
    const newMeasurement = {
      id: Date.now().toString(),
      weight: parseFloat(weight),
      height: parseFloat(height),
      waist: waist ? parseFloat(waist) : null,
      date: new Date().toISOString()
    };
    const updated = await saveMeasurements(newMeasurement);
    setMeasurements(updated);
    setWeight("");
    setHeight("");
    setWaist("");
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Weight: {item.weight} kg | Height: {item.height} cm {item.waist ? `| Waist: ${item.waist} cm` : ''}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Body Measurements</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Waist (cm, optional)"
        keyboardType="numeric"
        value={waist}
        onChangeText={setWaist}
      />
      <Button title="Add Measurement" onPress={handleAdd} />
      <FlatList
        data={measurements.slice(0, 10)}
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
  item: { padding: 10, backgroundColor: "#f8f9fa", marginBottom: 5, borderRadius: 5 },
  date: { fontSize: 12, color: "#6c757d" },
});