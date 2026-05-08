import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFB3D9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Doll Notes',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="tasks"
          options={{
            title: 'My Notes',
          }}
        />
        <Stack.Screen
          name="note-detail/[id]"
          options={{
            title: 'Note Details',
          }}
        />
        <Stack.Screen
          name="add-task"
          options={{
            title: 'Add New Note',
          }}
        />
      </Stack>
  );
}
