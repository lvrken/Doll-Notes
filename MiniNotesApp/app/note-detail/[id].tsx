import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteTask } from "../../lib/database";

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id, title, description, category } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    category: string;
  }>();

  const handleDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          if (id) {
            try {
              deleteTask(Number(id));
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete note");
            }
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEdit = () => {
    router.push({
      pathname: '/add-task',
      params: {
        id: id,
        title: title,
        description: description,
        category: category,
        isEditing: 'true',
      },
    });
  };

  if (!id || !title) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Note not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Note Detail</Text>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.value}>{title}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{description || "N/A"}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Category:</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category || "Personal"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
          activeOpacity={0.8}
        >
          <Text style={styles.editButtonText}>Edit Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText}>Delete Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  detailItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  categoryBadge: {
    backgroundColor: "#FFE6F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  categoryText: {
    fontWeight: "600",
    fontSize: 12,
    color: "#FFB3D9",
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: "#FFB3D9",
    paddingVertical: 14,
    borderRadius: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
