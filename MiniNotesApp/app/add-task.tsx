  import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addTask, updateTask } from '../lib/database';

const STATIC_PRIORITIES = ['None', 'Low', 'Medium', 'High'];

export default function AddNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    description?: string;
    priority?: string;
    isEditing?: string;
  }>();

  const isEditing = params.isEditing === 'true';
  const editId = params.id ? Number(params.id) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('None');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      if (params.title) setTitle(params.title);
      if (params.description) setDescription(params.description);
      if (params.priority) setPriority(params.priority);
    }
  }, [isEditing, params.title, params.description, params.priority]);

  const validateAndSave = () => {
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      if (title.trim().length < 3) {
        throw new Error('Title must be at least 3 characters long');
      }

      if (isEditing && editId) {
        updateTask(editId, title.trim(), description.trim(), priority, 'Pending');
        Alert.alert('Success', 'Note updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        addTask(title.trim(), description.trim(), priority, 'Pending');
        Alert.alert('Success', 'Note added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]);
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert('Validation Error', errorMessage, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.label}>Note Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note title"
            placeholderTextColor="#ccc"
            value={title}
            onChangeText={setTitle}
            editable={!loading}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Note Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter note description"
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
            multiline
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.categoryContainer}>
            {STATIC_PRIORITIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  priority === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setPriority(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    priority === cat && styles.categoryButtonTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={validateAndSave}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : isEditing ? 'Update Note' : 'Save Note'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFB3D9',
    backgroundColor: 'white',
  },
  categoryButtonActive: {
    backgroundColor: '#FFB3D9',
    borderColor: '#FF9CC1',
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFB3D9',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#FFB3D9',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});
