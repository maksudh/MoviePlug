import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

const WelcomeScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.buttons}>
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
        onPress={() => navigation.navigate('Sign In')} 
        />
        <Button 
        title="Sign up" 
        buttonStyle={{
          backgroundColor: '#7E7E7E',
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
        onPress={() => navigation.navigate('Sign Up')} 
        />
      </View>
    </View>
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
});

export default WelcomeScreen;