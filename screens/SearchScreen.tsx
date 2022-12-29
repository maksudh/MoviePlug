import React from 'react';
import { StyleSheet, Text, View ,TextInput, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect, useRef } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getAuth } from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { FeedLabel } from 'semantic-ui-react';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { CardDivider } from '@rneui/base/dist/Card/Card.Divider';

const auth = getAuth();
const url = "https://api.themoviedb.org/3/search/movie?api_key=a74bbbe22b9c0d64a7450f6cb18ee75e&query=";

const SearchScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => { 
  const { user } = useAuthentication();
  const [data, setData] = useState([]);
  const [searchterm, setSearchterm] = useState("Batman");
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  const scrollRef = useRef();

  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      y:0,
      animated: true,
    });
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
      <View style={styles.searchBar}>
        <TextInput
          style={styles.inputBar}
          placeholder={'Search Movies'}
          onChangeText={userInput => saveUserInput(userInput)}>
        </TextInput>
              {/* NEED TO FIX THE SPACES IN SEARCH TOO Fix the no value search bit */}
        <Button  
        icon={{
          name: 'search',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        buttonStyle={{
          backgroundColor: '#5fc9f8',
          borderColor: 'transparent',
          borderWidth: 0,
          height: 35
        }}
        containerStyle={{
          width: 70,
          padding: 10,
        }}
        onPress={() => {
          setSearchterm(input);
          onPressTouch();
          }}/>
      </View>
      <ScrollView ref={scrollRef}>
          {data.map((data, key) => {
              return (
                <Card>
                  <Text key={key} style={styles.movieTitle}>{data.title}</Text>
                  <View style={styles.movieCard}>
                    <Image
                        key={key}
                        resizeMode='cover'
                        style={styles.movieposter}
                        source={{uri: posterBaseUrl+data.poster_path}}
                      />
                      <Text style={{color: 'white'}}>sp</Text>
                      <Text key={key} style={{flex: 1, flexWrap: 'wrap'}}>{data.overview}</Text>
                  </View>
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
                    marginLeft: 14,
                  }}
                  onPress={() => navigation.navigate('Details', 
                  { genre_ids : data.genre_ids, id : data.id })}/>
                </Card>
              );
          })}
        </ScrollView>
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
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    paddingBottom: 10
  },
  inputBar: {
    backgroundColor: '#FAF7F6',
    flex: 1,
    borderRadius: 30,
    height: 45,
    marginTop: 5,
    padding: 15,
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
});

export default SearchScreen;