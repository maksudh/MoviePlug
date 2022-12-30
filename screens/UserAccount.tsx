import React from 'react';
import { StyleSheet, Text, View ,TextInput, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getAuth, signOut} from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getDatabase, ref, child, push, get, update, onValue, remove } from "firebase/database";

const auth = getAuth();

const UserAccount: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const { user } = useAuthentication();
  const db = getDatabase();
  const [data, setData] = useState([]);
  const [moviekeys, setMoviekeys] = useState([]);
  const dbRef = ref(db);

  function getUserData(){
    
    get(child(dbRef, 'users/'+String(user?.uid)+'/watchlist'))
    .then((snapshot) => {
      var movies = [];

      snapshot.forEach(snapshot => {
        movies.push(snapshot.val());
      });
      setData(movies)
      console.log(data)
    });
  }

  function removeEntry(userId, key){

    const dbRef = ref(db);
    get(child(dbRef, 'users/'+String(user?.uid)+'/watchlist'))
    .then((snapshot) => {
      const keys = snapshot.val();
      setMoviekeys(keys)
      // console.log(moviekeys)
      // console.log(Object.keys(moviekeys))
      remove(ref(db, 'users/'+userId+'/watchlist/'+Object.keys(moviekeys)[key]));
    });
  };

  // UNCOMMENT THIS WHEN READY TO USE

  // useEffect(() => {
  //   setTimeout(getUserData,1000);
  // },);

  return (
    <View style={styles.container}>
      <View style={styles.userBar}>
        <Text style={{
          fontSize: 18,
          marginTop: 7
          }}>{user?.email}</Text>
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
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  userBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
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
  }
});

export default UserAccount;