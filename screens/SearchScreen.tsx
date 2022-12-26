import React from 'react';
import { StyleSheet, Text, View ,TextInput, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getDatabase, ref, child, push, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';

const auth = getAuth();
const url = "https://api.themoviedb.org/3/search/movie?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&query=";

const SearchScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => { 
  const { user } = useAuthentication();
  const [data, setData] = useState([]);
  const [searchterm, setSearchterm] = useState("Batman");
  const [shouldShow, setShouldShow] = useState(false);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"

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

  let input = '';
  const saveUserInput = userInput => {
    input = userInput;
  };

  async function fetchData(){
    await fetch(url + searchterm)
    .then((response) => response.json())
    .then((data) => {
      setData(data.results);
      console.log(data.results);
    })
    .catch((error) => {
        console.log(error)
      });
  };

  useEffect(() => {
    fetchData();
  }, [searchterm]);

    return (
    <View style={styles.container}>
        <ScrollView stickyHeaderIndices={[0]}>
          <View style={styles.searchBar}>
            <TextInput
                  placeholder={'Search Movies'}
                  onChangeText={userInput => saveUserInput(userInput)}>
              </TextInput>
              <Text></Text>
              {/* NEED TO FIX THE SPACES IN SEARCH TOO Fix the no value search bit */}
              <Button style={styles.searchButton} title="Submit" onPress={() => setSearchterm(input)}/>
          </View>
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
                        title="Add to watchlist"
                        onPress={() => writeUserData(
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
                          )}
                      />
                      <Text></Text>
                      <Button
                      // NEED TO MAKE ONLY ONE EXPAND AT ONCE, NOT A BIG DEAL
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

export default SearchScreen;