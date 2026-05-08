import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { initDatabase } from "../lib/database";

export default function Homescreen() {
  const router = useRouter();

  useEffect(() => {
    try {
      initDatabase();
    } catch (error) {
      Alert.alert("Database Error", "Failed to initialize database.");
    }
  }, []);

  const handleOpenNotes = () => {
    router.push("/tasks");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🎀 Doll Notes 🎀</Text>
        <Text style={styles.subtitle}>Keep track of your important notes!</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleOpenNotes}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>View My Notes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFB3D9",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 30,
    width: "100%",
    maxWidth: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
