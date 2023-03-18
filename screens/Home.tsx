import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Button, Icon } from 'react-native-elements';
import { useState, useEffect, Suspense } from 'react';
import { getAuth, signOut} from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getDatabase, ref, child, push, get, update, onValue, remove } from "firebase/database";
import { StatusBar } from 'expo-status-bar';

const HomeScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  
  const [data, setData] = useState([]);
  const [full, setFull] = useState([]);
  const [liked, setLiked] = useState([]);
  const [rec1, setRec1] = useState([]);
  const [rec2, setRec2] = useState([]);
  const [rec3, setRec3] = useState([]);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  const { user } = useAuthentication();
  const db = getDatabase();
  const dbRef = ref(db);
  
  async function getUserData(){
    await get(child(dbRef, 'users/'+String(user?.uid)+'/rec_movies'))
    .then((snapshot) => {
      // console.log("snapshot: "+snapshot.val())
      var movies = [];
      snapshot.forEach(snapshot => {
        movies.push(snapshot.val());
      });
      movies = movies.slice(0,10);
      setData(movies)
      // console.log("rec movies: "+data)
    });
  }

  async function getLikedData(){
    await get(child(dbRef, 'users/'+String(user?.uid)+'/liked_full'))
    .then((snapshot) => {
      // console.log("snapshot: "+snapshot.val())
      var movies2 = [];
      snapshot.forEach(snapshot => {
        movies2.push(snapshot.val());
      });
      movies2 = movies2.slice(0,10);
      setFull(movies2)
      // console.log("full movies: "+full)
    });
  }

  async function getLikedMovies(){
    await get(child(dbRef, 'users/'+String(user?.uid)+'/liked_movies'))
    .then((snapshot) => {
      // console.log("snapshot: "+snapshot.val())
      var likedmovies = snapshot.val()
      setLiked(likedmovies)
      // console.log("movies: " +liked)
    });
  }

  async function fetchData(){
    await fetch("https://api.themoviedb.org/3/movie/"+String(liked[0])+"/recommendations?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&page=1")
    .then((response) => response.json())
    .then((data) => {
      data = data.results.slice(0,3);
      setRec1(data);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  async function fetchData2(){
    await fetch("https://api.themoviedb.org/3/movie/"+String(liked[1])+"/recommendations?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&page=1")
    .then((response) => response.json())
    .then((data) => {
      data = data.results.slice(0,3);
      setRec2(data);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  async function fetchData3(){
    await fetch("https://api.themoviedb.org/3/movie/"+String(liked[2])+"/recommendations?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&page=1")
    .then((response) => response.json())
    .then((data) => {
      data = data.results.slice(0,3);
      setRec3(data);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

// Change back to realtime when ready USE "LIKED" as a param to make it run all the time
  useEffect(() => {
    setTimeout(() => {
      getUserData();
      getLikedData();
      getLikedMovies();
      fetchData();
      fetchData2();
      fetchData3();
      console.log("use effect runs")
    }, 1000);
  },[liked]);

  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
      {/* <Button
        title = 'Load Data'
        icon={{
          name: 'refresh',
          type: 'font-awesome',
          size: 20,
          color: 'white',
        }}
        buttonStyle={{
          backgroundColor: '#99aab5',
          borderColor: 'transparent',
          borderWidth: 0,
          height: 40
        }}
        containerStyle={{
          width: 390,
          padding: 20,
        }}
        onPress={() => {    
          getUserData();
          getLikedData();
          getLikedMovies();
          fetchData();
          fetchData2();
          fetchData3();
          console.log("use effect runs")}
        }
        /> */}
        <Text style={styles.scrollTitle}>Movies in genres you like:</Text>
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
                        width: 200,
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
            <Text style={styles.scrollTitle}>People like you have watched:</Text>
            <ScrollView 
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {full.map((data, key) => {
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
                            width: 200,
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
            <Suspense fallback={Loading()}>
              <Text style={styles.scrollTitle}>Similar to movies you've liked:</Text>
            </Suspense>
            <ScrollView 
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              >
              {rec1.map((data, key) => {
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
                            width: 200,
                            padding: 5,
                            marginLeft: 3,
                          }}
                          onPress={() => navigation.navigate('Details', 
                          { genre_ids : data.genre_ids, id : data.id })}/>
                        </Card>
                      </View>
                    );
                })}
              {rec2.map((data, key) => {
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
                            width: 200,
                            padding: 5,
                            marginLeft: 3,
                          }}
                          onPress={() => navigation.navigate('Details', 
                          { genre_ids : data.genre_ids, id : data.id })}/>
                        </Card>
                      </View>
                    );
                })}
              {rec3.map((data, key) => {
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
                            width: 200,
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
        <Text></Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e1111',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white'
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
  movieposter: {
    width: 200,
    height: 250,
  }
});

export default HomeScreen;