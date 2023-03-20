import React from 'react';
import { StyleSheet, Text, View ,TextInput, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getAuth, signOut} from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getDatabase, ref, child, push, get, update, onValue, remove } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth = getAuth();

const UserAccount: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const { user } = useAuthentication();
  const db = getDatabase();
  const [data, setData] = useState([]);
  const [moviekeys, setMoviekeys] = useState([]);
  const dbRef = ref(db);

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@viewOnboarding')
    } catch {
        console.log("Error @clearOnboarding")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.userBar}>
        <Text style={{
          fontSize: 18,
          marginTop: 7,
          color: 'white'
          }}>{user?.email}</Text>
      </View>
      <View style={styles.buttons}>
      <Button 
        title="Sign Out"
        icon={{
          name: 'user',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        iconRight
        iconContainerStyle={{ marginLeft: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: '#fd9426',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 30,
        }}
        containerStyle={{
          width: 130,
        }}
        onPress={() => signOut(auth)} 
        />
      <Button
      title="Reset onboarding"
      titleStyle={{ fontWeight: '700' }}
      buttonStyle={{
        backgroundColor: '#fd9426',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
      }}
      containerStyle={{
        width: 130,
      }}
      onPress={() => clearOnboarding()}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#232b2b',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  userBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#232b2b',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 10,
  },
  inputBar: {
    backgroundColor: '#FAF7F6',
    flex: 1,
  },
  movieCard: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  movieposter: {
    width: 120,
    height: 170,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonCluster: {
    flex: 1, 
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around'
  },
  buttons: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});

export default UserAccount;