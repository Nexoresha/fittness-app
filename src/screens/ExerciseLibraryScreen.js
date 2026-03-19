import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from "react-native";

const EXERCISES = [
  { id: 1, name: "Pushups", category: "chest", description: "Great for chest and arms.", image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=150&fit=crop" },
  { id: 2, name: "Squats", category: "legs", description: "Strengthens legs and glutes.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop" },
  { id: 3, name: "Plank", category: "full body", description: "Core stability exercise.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop" },
  { id: 4, name: "Bicep Curls", category: "arms", description: "Targets biceps.", image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&h=150&fit=crop" },
  { id: 5, name: "Lunges", category: "legs", description: "Leg exercise for balance.", image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=200&h=150&fit=crop" },
  { id: 6, name: "Bench Press", category: "chest", description: "Chest and triceps.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop" },
  { id: 7, name: "Deadlifts", category: "full body", description: "Full body strength.", image: "https://images.unsplash.com/photo-1544216967-7350f80e4862?w=200&h=150&fit=crop" },
  { id: 8, name: "Shoulder Press", category: "arms", description: "Builds shoulder strength.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop" },
];

const FILTERS = ["all", "chest", "legs", "arms", "full body"];

export default function ExerciseLibraryScreen() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredExercises = EXERCISES.filter(e => 
    (filter === "all" || e.category === filter) &&
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderExercise = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => alert(`${item.name}: ${item.description}`)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.categoryTag}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exercise Library</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercises..."
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredExercises}
        keyExtractor={item => item.id.toString()}
        renderItem={renderExercise}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  searchInput: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 10, marginBottom: 10 },
  filters: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  filterButton: { padding: 10, borderRadius: 20, backgroundColor: "#e9ecef" },
  filterActive: { backgroundColor: "#007bff" },
  filterText: { fontSize: 14 },
  filterTextActive: { color: "#fff" },
  grid: { alignItems: "center" },
  card: { backgroundColor: "#f8f9fa", padding: 15, margin: 10, borderRadius: 15, width: 150, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  image: { width: 100, height: 80, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  description: { fontSize: 12, textAlign: "center", color: "#6c757d", marginBottom: 5 },
  categoryTag: { fontSize: 10, color: "#007bff", fontWeight: "bold" },
});