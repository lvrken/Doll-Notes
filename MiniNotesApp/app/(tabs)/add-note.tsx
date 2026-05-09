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
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { addTask, updateTask } from '../../lib/database';
import { useCallback } from 'react';

const PRIORITIES = ['None', 'Low', 'Medium', 'High'];

const PRIORITY_STYLES: Record<string, { border: string; active: string; text: string }> = {
  None:   { border: '#ccc',    active: '#ccc',    text: '#888' },
  Low:    { border: '#43A047', active: '#43A047', text: '#43A047' },
  Medium: { border: '#FB8C00', active: '#FB8C00', text: '#FB8C00' },
  High:   { border: '#E53935', active: '#E53935', text: '#E53935' },
};

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

  // Reset form when the tab is focused without edit params
  useFocusEffect(
    useCallback(() => {
      if (isEditing) {
        if (params.title) setTitle(params.title);
        if (params.description) setDescription(params.description);
        if (params.priority) setPriority(params.priority);
      } else {
        setTitle('');
        setDescription('');
        setPriority('None');
      }
    }, [isEditing, params.title, params.description, params.priority])
  );

  const validateAndSave = () => {
    setLoading(true);
    try {
      if (!title.trim()) throw new Error('Title is required');
      if (title.trim().length < 3) throw new Error('Title must be at least 3 characters');

      if (isEditing && editId) {
        updateTask(editId, title.trim(), description.trim(), priority, 'Pending');
        Alert.alert('Success', 'Note updated successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        addTask(title.trim(), description.trim(), priority, 'Pending');
        Alert.alert('Success', 'Note added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setTitle('');
              setDescription('');
              setPriority('None');
              router.push('/(tabs)/notes');
            },
          },
        ]);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
      Alert.alert('Validation Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenHeading}>
          {isEditing ? '✏️ Edit Note' : '📝 New Note'}
        </Text>

        {/* Title */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Note Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note title..."
            placeholderTextColor="#ccc"
            value={title}
            onChangeText={setTitle}
            editable={!loading}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* Description */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter note description..."
            placeholderTextColor="#ccc"
            value={description}
            onChangeText={setDescription}
            editable={!loading}
            multiline
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Priority */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const ps = PRIORITY_STYLES[p];
              const isActive = priority === p;
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    { borderColor: ps.border },
                    isActive && { backgroundColor: ps.active },
                  ]}
                  onPress={() => setPriority(p)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      { color: ps.text },
                      isActive && styles.priorityButtonTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save button */}
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
    backgroundColor: '#f9f0f5',
  },
  scroll: {
    padding: 20,
  },
  screenHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B9D',
    marginBottom: 24,
    marginTop: 4,
  },
  formSection: {
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#FFD6EC',
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    color: '#333',
    shadowColor: '#FFB3D9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  textArea: {
    minHeight: 130,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 5,
    textAlign: 'right',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  priorityButton: {
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1.5,
    backgroundColor: 'white',
  },
  priorityButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  priorityButtonTextActive: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 40,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
