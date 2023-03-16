import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View ,Alert, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getAuth, signOut} from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getDatabase, ref, child, push, get, update, onValue, remove } from "firebase/database";

import SearchScreen from './SearchScreen';

const auth = getAuth();

const Survey: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const { user } = useAuthentication();
  const db = getDatabase();
  const dbRef = ref(db);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  
  async function fetchTrending(){
    await fetch("https://api.themoviedb.org/3/movie/popular?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e")
    .then((response) => response.json())
    .then((data) => {
      setData(data.results);
      console.log(data.results);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  async function fetchTopRated(){
    await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e")
    .then((response) => response.json())
    .then((data) => {
      setData2(data.results);
      console.log(data.results);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  async function fetchNowPlaying(){
    await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e")
    .then((response) => response.json())
    .then((data) => {
      setData3(data.results);
      console.log(data.results);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  function writeUserData(
    userId, 
    email, 
    adult, 
    backdrop_path, 
    genre_ids, 
    id, 
    original_language, 
    overview,
    liked, 
    popularity,
    poster_path,
    release_date,
    title,
    video,
    vote_average,
    vote_count
    ){
    const db = getDatabase();
    const movieEntry = {
      adult : adult,
      backdrop_path : backdrop_path,
      genre_ids : genre_ids,
      id : id,
      original_language : original_language,
      overview : overview,
      popularity : popularity,
      liked : liked,
      poster_path : poster_path,
      release_date : release_date,
      title : title,
      video : video,
      vote_average : vote_average,
      vote_count :vote_count
    }
    const updates ={}

    update(ref(db, 'users/'+userId),{
      email: email,
    });

    updates['/watchlist/'+id] = movieEntry;
    return update(ref(db, 'users/'+userId),updates);
  }

  const selectedMovie = (title) =>
  Alert.alert('You chose '+title+'!', '', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

  useEffect(() => {
    fetchTrending();
    fetchNowPlaying();
    fetchTopRated();
  }, []);

  const completeSurvery = async () => {
    try {
        await AsyncStorage.setItem('@viewOnboarding', 'true')
    } catch {
        console.log('Error @setItem')
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.userBar}>
        <Text style={{
          fontSize: 18,
          marginTop: 7,
          color: 'white'
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
      <Text style={styles.scrollTitle}>To finish setting up, please select a movie from each row!</Text>
      <Text style={styles.scrollTitle}>Current movies:</Text>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {data.map((data, key) => {
                return (
                  <View style={styles.container}>
                    <Card containerStyle={{
                      display: 'flex',
                      flex:1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#232b2b',
                      borderColor: 'black',
                      width: 260,
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
                      title="Select" 
                      icon={{
                        name: 'plus-square',
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
                        width: 200,
                        padding: 5,
                        marginLeft: 3,
                      }}
                      onPress={() => {writeUserData(
                        String(user?.uid),
                        String(user?.email),
                        String(data.adult),
                        String(data.backdrop_path),
                        String(data.genre_ids),
                        String(data.id),
                        String(data.original_language),
                        String(data.overview),
                        String(true),
                        String(data.popularity),
                        String(data.poster_path),
                        String(data.release_date),
                        String(data.title),
                        String(data.video),
                        String(data.vote_average),
                        String(data.vote_count)
                        );
                        selectedMovie(String(data.title));
                      }
                      }
                      />
                    </Card>
                  </View>
                );
            })}
            </ScrollView>
            <Text style={styles.scrollTitle}>Top Rated Movies:</Text>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {data2.map((data, key) => {
                return (
                  <View style={styles.container}>
                    <Card containerStyle={{
                      display: 'flex',
                      flex:1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#232b2b',
                      borderColor: 'black',
                      width: 260,
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
                      title="Select" 
                      icon={{
                        name: 'plus-square',
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
                        width: 200,
                        padding: 5,
                        marginLeft: 3,
                      }}
                      onPress={() => {writeUserData(
                        String(user?.uid),
                        String(user?.email),
                        String(data.adult),
                        String(data.backdrop_path),
                        String(data.genre_ids),
                        String(data.id),
                        String(data.original_language),
                        String(data.overview),
                        String(true),
                        String(data.popularity),
                        String(data.poster_path),
                        String(data.release_date),
                        String(data.title),
                        String(data.video),
                        String(data.vote_average),
                        String(data.vote_count)
                        );
                        selectedMovie(String(data.title));
                      }
                      }
                      />
                    </Card>
                  </View>
                );
            })}
            </ScrollView>
            <Text style={styles.scrollTitle}>Popular movies:</Text>
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {data3.map((data, key) => {
                return (
                  <View style={styles.container}>
                    <Card containerStyle={{
                      display: 'flex',
                      flex:1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#232b2b',
                      borderColor: 'black',
                      width: 260,
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
                      title="Select" 
                      icon={{
                        name: 'plus-square',
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
                        width: 200,
                        padding: 5,
                        marginLeft: 3,
                      }}
                      onPress={() => {writeUserData(
                        String(user?.uid),
                        String(user?.email),
                        String(data.adult),
                        String(data.backdrop_path),
                        String(data.genre_ids),
                        String(data.id),
                        String(data.original_language),
                        String(data.overview),
                        String(true),
                        String(data.popularity),
                        String(data.poster_path),
                        String(data.release_date),
                        String(data.title),
                        String(data.video),
                        String(data.vote_average),
                        String(data.vote_count)
                        );
                        selectedMovie(String(data.title));
                      }
                      }
                      />
                    </Card>
                  </View>
                );
            })}
            </ScrollView>
            <View>
              <Button 
                title="CompleteSurvey"
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
                  width: 200,
                }}
                onPress={() => {
                  completeSurvery();
                  navigation.navigate('main');
                }
                } 
                />
            </View>
            </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#0e1111',
    alignItems: 'center',
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
    width: 200,
    height: 250,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  buttonCluster: {
    flex: 1, 
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around'
  },
  scrollTitle: {
    margin: 15,
    marginBottom: 5,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 20,
  },
});

export default Survey;