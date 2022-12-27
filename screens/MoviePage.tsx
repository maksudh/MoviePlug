import React from 'react';
import { StyleSheet, Text, View , Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getDatabase, ref, child, push, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';

const MoviePage: React.FC<StackScreenProps<any>> = ({ route, navigation }) => {
  const { user } = useAuthentication();
  // const [data, setData] = useState([]);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  const [data, setData] = useState([]);
  const { genre_ids, id } = route.params; 

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
    const newEntryKey = push(child(ref(db, 'users/'+userId), 'watchlist')).key
    const updates ={}

    update(ref(db, 'users/'+userId),{
      email: email,
    });

    updates['/watchlist/'+newEntryKey] = movieEntry;
    return update(ref(db, 'users/'+userId),updates);
  }
  
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

  function fetchData(){
    fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&language=en-US")
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      console.log(data);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>This is your movie page</Text>
          <Card style={styles.moviecard} elevation={7}>
            <Text>
              <Text style={styles.movieTitle}>{data.title}</Text>
                {'\n'}{'\n'}
                  <Image
                    resizeMode='cover'
                    style={styles.movieposter}
                    source={{uri: posterBaseUrl+data.poster_path}}
                  />
              <View>
                <Text></Text>
                <Text>{data.tagline}</Text>
                <Text style={styles.overview}>{data.overview}</Text>
                <Text>Budget: {data.budget}</Text>
                <Text>Revenue: {data.revenue}</Text>
                <Text>Popularity: {data.popularity}</Text>
                <Text>Release date: {data.release_date}</Text>
                <Text>Runtime: {data.runtime} minutes</Text>
                <Text>Rating: {data.vote_average}/10</Text>
                <Text>Voters: {data.vote_count}</Text>
                <Text>Genres: {convertGenres(String(genre_ids))}</Text>
                <Text>Movie homepage: {data.homepage}</Text>
                <Button
                  title="Add to watchlist"
                  onPress={() => writeUserData(
                    String(user?.uid),
                    String(user?.email),
                    String(data.adult),
                    String(data.backdrop_path),
                    String(genre_ids),
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
                    )}
                />
              </View>
            </Text>
          </Card>
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

export default MoviePage;