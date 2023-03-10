import React from 'react';
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

const SignInScreen = () => {
  const [value, setValue] = React.useState({
    email: '',
    password: '',
    error: ''
  })

  async function signIn() {
    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'Email and password are mandatory.'
      })
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      })
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>

      {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}

      <View style={styles.controls}>
        <TextInput
          placeholder='Email'
          placeholderTextColor="#c9c9c9"
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          style={styles.inputBar}
        />

        <TextInput
          placeholder='Password'
          placeholderTextColor="#c9c9c9"
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          style={styles.inputBar}
        />

        <Button 
        title="Sign in" 
        buttonStyle={{
          backgroundColor: '#03BEFF',
          borderWidth: 2,
          borderColor: '#232b2b',
          borderRadius: 30,
        }}
        containerStyle={{
          width: 250,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        titleStyle={{ fontWeight: 'bold' }} 
        onPress={signIn}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#232b2b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flex: 1
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  control: {
    marginTop: 10
  },
  error: {
    marginTop: 10,
    padding: 10,
    color: '#fff',
    backgroundColor: '#D54826FF',
  },
  inputBar: {
    backgroundColor: '#414a4c',
    color: 'white',
    borderRadius: 30,
    height: 45,
    margin: 10,
    padding: 15,
  },
});

export default SignInScreen;