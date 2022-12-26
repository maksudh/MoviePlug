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

const UserProfileScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const { user } = useAuthentication();
  const db = getDatabase();
  const [data, setData] = useState([]);
  const [moviekeys, setMoviekeys] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"

  // NEED TO MAKE THIS USE EFFECT CANNOT STAY AS A BUTTON 

  function getUserData(){
    const dbRef = ref(db);
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
  //   getUserData();
  // }, [data]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>Welcome {user?.email}!</Text>
        <Button title="Sign Out" onPress={() => signOut(auth)} />
        <Text></Text>
        <Button title="LOAD DATA PLACEHOLDER" onPress={() => getUserData()}/>
          {data.map((data, key) => {
                return (
                  <View>
                    <Card style={styles.moviecard} elevation={7}>
                      <Text key={key}>
                        <Text style={styles.movieTitle}>{data.title}                  </Text>
                          {'\n'}{'\n'}
                            <Image
                              resizeMode='cover'
                              style={styles.movieposter}
                              source={{uri: posterBaseUrl+data.poster_path}}
                            />
                      </Text>
                        {shouldShow ? (
                          <View>
                            <Text></Text>
                            <Text style={styles.overview}>{data.overview}</Text>
                            <Text>Popularity: {data.popularity}</Text>
                            <Text>Release date: {data.release_date}</Text>
                            <Text>Rating: {data.vote_average}</Text>
                            <Text>Voters: {data.vote_count}</Text>
                          </View>
                        ) : null}
                        <Text></Text>
                        <Button
                          title="Remove"
                          onPress={() => removeEntry(String(user?.uid),key)
                            }
                        />
                        <Text></Text>
                        <Button
                          title="Details"
                          onPress={() => setShouldShow(!shouldShow)}
                        />
                    </Card>
                  </View>
                );
            })}
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
  movieposter: {
    width: 200,
    height: 270,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  moviecard: {
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 20,
  },
  searchButton: {
  },
  overview: {
    flexDirection: 'row',
  },
});

export default UserProfileScreen;