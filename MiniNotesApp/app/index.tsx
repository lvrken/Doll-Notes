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
    router.push("/(tabs)/notes");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎀</Text>
        <Text style={styles.title}>Doll Notes</Text>
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
    backgroundColor: "#f9f0f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
    color: "#FF6B9D",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#ffb1cbff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 40,
    width: "100%",
    maxWidth: 300,
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
