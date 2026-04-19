import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { useQuestStore } from '../store/questStore';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    surface: Colors.surface,
  },
};

export default function RootLayout() {
  const router = useRouter();
  const hasOnboarded = useQuestStore((s) => s.hasOnboarded);

  useEffect(() => {
    if (!hasOnboarded) {
      router.replace('/onboarding');
    }
  }, [hasOnboarded]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="rewards" />
          <Stack.Screen name="parent" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
