import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteTask } from "../../lib/database";

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  High:   { bg: '#FFE6E6', text: '#ff918fff' },
  Medium: { bg: '#FFF3E0', text: '#f3c184ff' },
  Low:    { bg: '#E8F5E9', text: '#98f89dff' },
  None:   { bg: '#F3F3F3', text: '#999' },
};

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id, title, description, priority } = useLocalSearchParams<{
    id: string;
    title: string;
    description: string;
    priority: string;
  }>();

  const priorityKey = priority ?? 'None';
  const colors = PRIORITY_COLORS[priorityKey] ?? PRIORITY_COLORS['None'];

  const handleDelete = () => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          if (id) {
            try {
              deleteTask(Number(id));
              router.back();
            } catch {
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
      pathname: '/(tabs)/add-note',
      params: {
        id,
        title,
        description,
        priority,
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
        <Text style={styles.pageTitle}>Note Detail</Text>

        {/* Title */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>TITLE</Text>
          <Text style={styles.detailValue}>{title}</Text>
        </View>

        {/* Description */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>DESCRIPTION</Text>
          <Text style={styles.detailValue}>{description || "No description provided."}</Text>
        </View>

        {/* Priority */}
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>PRIORITY</Text>
          <View style={[styles.priorityBadge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.priorityBadgeText, { color: colors.text }]}>
              {priorityKey}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
          <Text style={styles.editButtonText}>✏️  Edit Note</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
          <Text style={styles.deleteButtonText}>🗑️  Delete Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f0f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF6B9D",
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#FFB3D9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ccc",
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    lineHeight: 22,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  priorityBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  editButton: {
    backgroundColor: "#FFB3D9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FFB3D9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
