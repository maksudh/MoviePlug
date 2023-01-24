import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Button, Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { getAuth, signOut} from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getDatabase, ref, child, push, get, update, onValue, remove } from "firebase/database";

const HomeScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  
  const [data, setData] = useState([]);
  const [g , setG] = useState([]);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  const { user } = useAuthentication();
  const db = getDatabase();
  const [moviekeys, setMoviekeys] = useState([]);
  const dbRef = ref(db);
  
  function getUserData(){
    
    get(child(dbRef, 'users/'+String(user?.uid)+'/rec_movies'))
    .then((snapshot) => {
      var movies = [];

      snapshot.forEach(snapshot => {
        movies.push(snapshot.val());
      });
      setData(movies)
      console.log(data)
    });
  }


  useEffect(() => {
    setTimeout(getUserData,1000);
  },);

  return (
    <View style={styles.container}>
      <ScrollView>
          {data.map((data, key) => {
                return (
                  <View style={styles.container}>
                    <Card containerStyle={{
                      display: 'flex',
                      flex:1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      }}>
                      <Text key={key}>
                        <Text style={styles.movieTitle}>{data.title}</Text>
                          {'\n'}{'\n'}
                            <Image
                              resizeMode='cover'
                              style={styles.movieposter}
                              source={{uri: posterBaseUrl+data.poster_path}}
                            />
                      </Text>
                      <Text></Text>
                      <Button 
                      title="Details" 
                      icon={{
                        name: 'expand',
                        type: 'font-awesome',
                        size: 15,
                        color: 'white',
                      }}
                      iconRight
                      iconContainerStyle={{ marginLeft: 10 }}
                      titleStyle={{ fontWeight: '700' }}
                      buttonStyle={{
                        backgroundColor: '#147efb',
                        borderColor: 'transparent',
                        borderWidth: 0,
                      }}
                      containerStyle={{
                        width: 300,
                        padding: 5,
                        marginLeft: 3,
                      }}
                      onPress={() => navigation.navigate('Details', 
                      { genre_ids : data.genre_ids, id : data.id })}/>
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
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 20,
  },
  movieposter: {
    width: 305,
    height: 405,
  }
});

export default HomeScreen;