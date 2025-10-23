import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function DetailsScreen({ route, navigation }) {
  const { user = 'Guest' } = route.params ?? {};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details</Text>
      <Text style={styles.sub}>User: {user}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8 },
  sub: { fontSize: 16, marginBottom: 12 },
});
 