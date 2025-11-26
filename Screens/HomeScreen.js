// NOTE Imported Libs from react
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, Divider, TextInput} from 'react-native-paper';

// NOTE MAIN body Component for the Home Screen
export default function HomeScreen({ navigation }) {
    //STATE INPUT
    const [user, setUser] = React.useState('');

    return (
        <View style={styles.container}>
            <Text variant='headlineMedium' style={styles.homeMarg}>Home</Text>
            
            <Divider style={styles.divider} />

            <View style={styles.inputContainer}>
                <TextInput
                    label='Enter Your Name'
                    value={user}
                    onChangeText={setUser}
                    mode='outlined'
                    left={<TextInput.Icon icon="account"/>}
                    placeholder='Enter name here'
                    maxLength={20}
                />
            </View>

            <Button mode='contained' onPress={ () => 
                navigation.navigate('Details', {user: user})}>
                Go To Detials
            </Button>

            <Divider style={styles.divider} />

            <Button mode='outlined' icon='camera' onPress={() =>{}}>
                Go to Gallery
            </Button>

        </View>
    );
}


// NOTE MAIN Styles ref 
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  divider: {marginVertical: 18},
  homeMarg: {marginBottom: 16},
  homeInput: {marginBottom: 24},
  inputContainer: {
    width:'80%',
    alignContent: 'center',
    marginBottom: 24,
  }
});

/*CODE Graveyard
    * OLD title CSS for text on react native core
    * title: { fontSize: 24, fontWeight: '600', marginBottom: 12 },
*/