import { Redirect } from 'expo-router';

// This route is superseded by (tabs)/notes.tsx
export default function TasksRedirect() {
  return <Redirect href="/(tabs)/notes" />;
}
