import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../constants/theme';
import { RootStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';

// Placeholder login screen
function LoginScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenText}>Login</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [isAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '600',
  },
});
