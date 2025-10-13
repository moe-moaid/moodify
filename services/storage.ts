import AsyncStorage from '@react-native-async-storage/async-storage';

const GENERATION_KEY = '@moodify_generation_count';
export async function incrementGenerationCount() {
  const current = parseInt((await AsyncStorage.getItem(GENERATION_KEY)) || '0');
  const updated = current + 1;
  await AsyncStorage.setItem(GENERATION_KEY, String(updated));
  return updated;
}

export async function getGenerationCount() {
  const current = parseInt((await AsyncStorage.getItem(GENERATION_KEY)) || '0');
  return current;
}

export async function resetGenerationCount() {
  await AsyncStorage.removeItem(GENERATION_KEY);
}

