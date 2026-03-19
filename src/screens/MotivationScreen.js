import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MOTIVATION_QUOTES } from "../storage";

export default function MotivationScreen() {
  const [quote, setQuote] = useState(MOTIVATION_QUOTES[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    setQuote(MOTIVATION_QUOTES[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Motivation</Text>
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>"{quote}"</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={getRandomQuote}>
        <Text style={styles.buttonText}>Get New Quote</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 40, textAlign: "center" },
  quoteContainer: { backgroundColor: "#f8f9fa", padding: 30, borderRadius: 15, marginBottom: 40, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  quote: { fontSize: 18, fontStyle: "italic", textAlign: "center", color: "#495057" },
  button: { backgroundColor: "#28a745", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});