import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, Button, Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { stringLength } from '@firebase/util';

const DiscoverScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  
  async function fetchData(){
    await fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e")
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
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>Current Trending Movies</Text>
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
                          <Text style={styles.overview}>{data.overview}</Text>
                          <Text>Popularity: {data.popularity}</Text>
                          <Text>Release date: {data.release_date}</Text>
                          <Text>Rating: {data.vote_average}</Text>
                          <Text>Voters: {data.vote_count}</Text>
                        </View>
                      ) : null}
                      <Button
                        title="Add to watchlist"
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
    width: 150,
    height: 210,
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

export default DiscoverScreen;