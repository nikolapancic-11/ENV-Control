import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_KEY = '@env-control/push-token';

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    // expo-notifications would be used here in a full implementation:
    // const { status } = await Notifications.requestPermissionsAsync();
    // if (status !== 'granted') return null;
    // const token = (await Notifications.getExpoPushTokenAsync()).data;
    // await savePushToken(token);
    // return token;

    // Stub – return null until expo-notifications is configured
    return null;
  } catch {
    return null;
  }
}

export async function savePushToken(token: string): Promise<void> {
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
}

export async function getPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}
