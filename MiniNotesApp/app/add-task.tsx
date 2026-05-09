import { Redirect } from 'expo-router';

// This route is superseded by (tabs)/add-note.tsx
export default function AddTaskRedirect() {
  return <Redirect href="/(tabs)/add-note" />;
}
