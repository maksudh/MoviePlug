import React from 'react';
import { StyleSheet, Text, View ,TextInput, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';

const auth = getAuth();
const url = "https://api.themoviedb.org/3/search/movie?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&query=";

const SearchScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => { 
  const { user } = useAuthentication();
  const [data, setData] = useState([]);
  const [searchterm, setSearchterm] = useState("Batman");
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"

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
                      <Text style={styles.movieTitle}>{data.title}</Text>
                        {'\n'}{'\n'}
                          <Image
                            resizeMode='cover'
                            style={styles.movieposter}
                            source={{uri: posterBaseUrl+data.poster_path}}
                          />
                    </Text>
                    <Text></Text>
                    <Button title="Open in new page" onPress={() => navigation.navigate('View Recent', 
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