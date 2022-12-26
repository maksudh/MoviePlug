import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

const HomeScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>This is your homepage</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 10
  }
});

export default HomeScreen;