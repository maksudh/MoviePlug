import React from 'react';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Button, Icon } from 'react-native-elements';
import { useState, useEffect, useRef } from 'react';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getDatabase, ref, child, push, update } from "firebase/database";

const DiscoverScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [data, setData] = useState([]);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  const [url, setUrl] = useState("https://api.themoviedb.org/3/trending/movie/week?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e");
  const { user } = useAuthentication();
  const scrollRef = useRef();

  // scrolling back to top when button pressed

  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y:0,
      animated: true,
    });
  }
  
  // function to fetch data for movies
  async function fetchData(){
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setData(data.results);
      console.log(data.results);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  // fetches data before app is rendered

  useEffect(() => {
    fetchData();
  }, [url]);

  // changes url based on button pressed
  function changeURL(url){
    setUrl(url);
  }

  // alerts for shortcuts 

  const addedalert = (title) =>
  Alert.alert('Added '+title+' to watchlist!', '', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

  const likedalert = (title) =>
  Alert.alert('You liked '+title+'!', '', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

  const dislikedalert = (title) =>
  Alert.alert('You disliked '+title+'!', '', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

  // writes user data to firebase for movie selected

  function writeUserData(
    userId, 
    email, 
    adult, 
    backdrop_path, 
    genre_ids, 
    id, 
    original_language, 
    overview, 
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
      poster_path : poster_path,
      release_date : release_date,
      title : title,
      video : video,
      vote_average : vote_average,
      vote_count :vote_count
    }
    // const newEntryKey = push(child(ref(db, 'users/'+userId), 'watchlist')).key
    const updates ={}

    update(ref(db, 'users/'+userId),{
      email: email,
    });

    // updates['/watchlist/'+newEntryKey] = movieEntry;
    updates['/watchlist/'+id] = movieEntry;
    return update(ref(db, 'users/'+userId),updates);
  }

  function likeMovie(id){
    const db = getDatabase();
    const liked = { liked : "true"}
    update(ref(db, 'users/'+user?.uid+'/watchlist/'+id),liked)
  }

  function dislikeMovie(id){
    const db = getDatabase();
    const liked = { liked : "false"}
    update(ref(db, 'users/'+user?.uid+'/watchlist/'+id),liked)
  }

  // converts genres based on genre id
  function convertGenres(genre_ids){
    const g = genre_ids;
    const garr = g.split(',');
    var cgen = [];
    for (let i = 0; i < garr.length; i++) {
      switch(garr[i]){
        case '28':
          cgen.push("Action ");
          break;
        case '12':
          cgen.push("Adventure ");
          break;
        case '16':
          cgen.push("Animation ");
          break;
        case '35':
          cgen.push("Comedy ");
          break;
        case '80':
          cgen.push("Crime ");
          break;
        case '99':
          cgen.push("Documentary ");
          break;
        case '18':
          cgen.push("Drama ");
          break;
        case '10751':
          cgen.push("Family ");
          break;
        case '14':
          cgen.push("Fantasy ");
          break;
        case '36':
          cgen.push("History ");
          break;
        case '27':
          cgen.push("Horror ");
          break;
        case '10402':
          cgen.push("Music ");
          break;
        case '9648':
          cgen.push("Mystery ");
          break;
        case '10749':
          cgen.push("Romance ");
          break;
        case '878':
          cgen.push("Science Fiction ");
          break;
        case '10770':
          cgen.push("TV Movie ");
          break;
        case '53':
          cgen.push("Thriller ");
          break;
        case '10752':
          cgen.push("War ");
          break;
        case '37':
          cgen.push("Western ");
          break;
      }
    };
    console.log(cgen);
    return cgen;
  }
// displays cards with movies and shortcut buttons 
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          margin: 20
        }}
      >
        <Button 
          title="Upcoming"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: '#147efb',
            borderColor: 'transparent',
            borderWidth: 0,
          }}
          containerStyle={{
            width: 150,
            height: 50,
            marginRight: 20,
          }}
          onPress={() => {
          changeURL("https://api.themoviedb.org/3/movie/upcoming?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&page=1");
          onPressTouch();
          }
          }/>
        <Button 
          title="Trending"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: '#147efb',
            borderColor: 'transparent',
            borderWidth: 0,
          }}
          containerStyle={{
            width: 150,
            height: 50,
            marginRight: 20,
          }}
          onPress={() => {
            changeURL("https://api.themoviedb.org/3/trending/movie/week?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e");
            onPressTouch();
          }
          }/>
        <Button 
          title="Popular"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: '#147efb',
            borderColor: 'transparent',
            borderWidth: 0,
          }}
          containerStyle={{
            width: 150,
            height: 50,
            marginRight: 20,
          }}
          onPress={() => {
            changeURL("https://api.themoviedb.org/3/movie/popular?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e");
            onPressTouch();
          }
          }/>
        <Button 
          title="Top last year"
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: '#147efb',
            borderColor: 'transparent',
            borderWidth: 0,
          }}
          containerStyle={{
            width: 150,
            height: 50,
            marginRight: 20,
          }}
          onPress={() => {
            changeURL("https://api.themoviedb.org/3/discover/movie?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=2021&with_watch_monetization_types=flatrate");
            onPressTouch();
          }
          }/>
      </ScrollView>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {data.map((data, key) => {
              return (
                <Card
                  containerStyle={{
                  backgroundColor: '#232b2b',
                  borderColor: 'black'
                  }}>
                  <Text key={key} style={styles.movieTitle}>{data.title}</Text>
                  <View style={styles.movieCard}>
                    <Image
                        key={key}
                        resizeMode='cover'
                        style={styles.movieposter}
                        source={{uri: posterBaseUrl+data.poster_path}}
                      />
                      <Text style={{color: '#232b2b'}}>sp</Text>
                      {/* <Text key={key} style={{flex: 1, flexWrap: 'wrap', color: 'white'}}>{convertGenres(String(data.genre_ids))}{'\n'}{data.vote_average}</Text> */}
                  </View>
                  <View style={styles.buttonCluster}>
                    <Button 
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
                      width: 50,
                    }}
                    onPress={() => navigation.navigate('Details', 
                    { genre_ids : data.genre_ids, id : data.id })}/>
                    <Button
                      icon={{
                        name: 'thumbs-down',
                        type: 'font-awesome',
                        size: 15,
                        color: 'white',
                      }}
                      iconRight
                      iconContainerStyle={{ marginLeft: 10 }}
                      titleStyle={{ fontWeight: '700' }}
                      buttonStyle={{
                        backgroundColor: '#cc3300',
                        borderColor: 'transparent',
                        borderWidth: 0,
                      }}
                      containerStyle={{
                        width: 50,
                      }}
                      onPress={() => {
                        writeUserData(
                          String(user?.uid),
                          String(user?.email),
                          String(data.adult),
                          String(data.backdrop_path),
                          String(data.genre_ids),
                          String(data.id),
                          String(data.original_language),
                          String(data.overview),
                          String(data.popularity),
                          String(data.poster_path),
                          String(data.release_date),
                          String(data.title),
                          String(data.video),
                          String(data.vote_average),
                          String(data.vote_count)
                          );
                        dislikeMovie(String(data.id));
                        dislikedalert(String(data.title));
                      }}
                      />
                    <Button
                      icon={{
                        name: 'thumbs-up',
                        type: 'font-awesome',
                        size: 15,
                        color: 'white',
                      }}
                      iconRight
                      iconContainerStyle={{ marginLeft: 10 }}
                      titleStyle={{ fontWeight: '700' }}
                      buttonStyle={{
                        backgroundColor: '#ffcc00',
                        borderColor: 'transparent',
                        borderWidth: 0,
                      }}
                      containerStyle={{
                        width: 50,
                      }}
                      onPress={() => {
                        writeUserData(
                          String(user?.uid),
                          String(user?.email),
                          String(data.adult),
                          String(data.backdrop_path),
                          String(data.genre_ids),
                          String(data.id),
                          String(data.original_language),
                          String(data.overview),
                          String(data.popularity),
                          String(data.poster_path),
                          String(data.release_date),
                          String(data.title),
                          String(data.video),
                          String(data.vote_average),
                          String(data.vote_count)
                          );
                        likeMovie(String(data.id));
                        likedalert(String(data.title));
                      }}
                      />
                    <Button
                      icon={{
                        name: 'add-to-list',
                        type: 'entypo',
                        size: 15,
                        color: 'white',
                      }}
                      iconRight
                      iconContainerStyle={{ marginLeft: 10 }}
                      titleStyle={{ fontWeight: '700' }}
                      buttonStyle={{
                        backgroundColor: '#99cc33',
                        borderColor: 'transparent',
                        borderWidth: 0,
                      }}
                      containerStyle={{
                        width: 50,
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
                        String(data.popularity),
                        String(data.poster_path),
                        String(data.release_date),
                        String(data.title),
                        String(data.video),
                        String(data.vote_average),
                        String(data.vote_count)
                        );
                        addedalert(String(data.title));
                      }
                      }
                      />
                  </View>
                </Card>
              );
          })}
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
  searchBar: {
    backgroundColor: 'white',
    padding: 20,
  },
  userBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#0e1111',
    color: '#0e1111',
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
    width: 250,
    height: 350,
    marginLeft: 10
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
    justifyContent: 'space-around',
  }
});

export default DiscoverScreen;