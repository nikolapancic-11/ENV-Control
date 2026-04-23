import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from './src/constants/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ENV-Control</Text>
      <Text style={styles.subtitle}>Sustainability Emissions Tracker</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.textLight,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.secondaryLight,
  },
});
