import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getTasks, deleteTask, type Task } from '../../lib/database';

const PRIORITY_ORDER: Record<string, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
  None: 3,
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  High: { bg: '#FFE6E6', text: '#E53935', dot: '#E53935' },
  Medium: { bg: '#FFF3E0', text: '#FB8C00', dot: '#FB8C00' },
  Low: { bg: '#E8F5E9', text: '#43A047', dot: '#43A047' },
  None: { bg: '#F3F3F3', text: '#999', dot: '#ccc' },
};

function sortNotesByPriority(notes: Task[]): Task[] {
  return [...notes].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 3;
    const pb = PRIORITY_ORDER[b.priority] ?? 3;
    return pa - pb;
  });
}

export default function NotesScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Task[]>([]);

  const loadNotes = useCallback(() => {
    try {
      const data = getTasks();
      setNotes(sortNotesByPriority(data));
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  const handleNotePress = (note: Task) => {
    router.push({
      pathname: '/note-detail/[id]',
      params: {
        id: String(note.id),
        title: note.title,
        description: note.description,
        priority: note.priority,
      },
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          try {
            deleteTask(id);
            loadNotes();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete note');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  // Build list items with divider before first "None" note
  const buildListData = (): (Task | { type: 'divider'; key: string })[] => {
    const result: (Task | { type: 'divider'; key: string })[] = [];
    let dividerInserted = false;

    for (const note of notes) {
      if (!dividerInserted && (note.priority === 'None' || note.priority == null)) {
        // Only insert divider if there were higher-priority notes before
        if (result.length > 0) {
          result.push({ type: 'divider', key: 'priority-divider' });
        }
        dividerInserted = true;
      }
      result.push(note);
    }
    return result;
  };

  const listData = buildListData();

  const renderItem = ({ item }: { item: Task | { type: 'divider'; key: string } }) => {
    if ('type' in item && item.type === 'divider') {
      return (
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>— No Priority —</Text>
          <View style={styles.dividerLine} />
        </View>
      );
    }

    const note = item as Task;
    const colors = PRIORITY_COLORS[note.priority] ?? PRIORITY_COLORS['None'];

    return (
      <View style={styles.noteCard}>
        <TouchableOpacity
          style={styles.noteContent}
          onPress={() => handleNotePress(note)}
          activeOpacity={0.7}
        >
          {/* Priority dot indicator on left */}
          <View style={[styles.priorityDot, { backgroundColor: colors.dot }]} />

          <View style={styles.noteInfo}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteDescription} numberOfLines={2}>
              {note.description || 'No description'}
            </Text>
            <View style={styles.noteFooter}>
              <View style={[styles.priorityBadge, { backgroundColor: colors.bg }]}>
                <Text style={[styles.priorityText, { color: colors.text }]}>
                  {note.priority || 'None'}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(note.id)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) =>
          'type' in item ? item.key : String((item as Task).id)
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubtext}>
              Tap "Add Note" below to create your first note!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f0f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  // Priority divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0c8d8',
  },
  dividerLabel: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#c0a0b0',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Note card
  noteCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#FFB3D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
  },
  noteContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
    flexShrink: 0,
  },
  noteInfo: {
    flex: 1,
    marginRight: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2d2d',
    marginBottom: 4,
  },
  noteDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
    lineHeight: 18,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  arrow: {
    fontSize: 24,
    color: '#FFB3D9',
    fontWeight: '300',
    marginLeft: 4,
  },
  deleteButton: {
    width: 48,
    backgroundColor: '#FFE6F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: '700',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#bbb',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
