import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';

//New Change to show some git stuff
export default function DetailsScreen({ route, navigation }) {
  const { user = 'Guest' } = route.params ?? {};
  const [loading, setLoading] = React.useState(false);

  const simulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200); // fake wait
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.mb8}>Details</Text>
      <Text variant="bodyLarge" style={styles.mb16}>User: {user}</Text>

      {loading ? (
        <ActivityIndicator animating />
      ) : (
        <Button mode="contained" onPress={simulateLoad}>Simulate Loading</Button>
      )}

      <Button style={styles.mt16} onPress={() => navigation.goBack()}>
        Go Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mt16: { marginTop: 16 },
});