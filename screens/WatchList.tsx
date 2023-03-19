import React from 'react';
import { StyleSheet, Text, View ,Alert, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Card } from 'react-native-elements';
import { getAuth, signOut} from 'firebase/auth';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import { getDatabase, ref, child, push, get, update, onValue, remove } from "firebase/database";
import { color } from '@rneui/base';

const auth = getAuth();

const WatchListcreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const { user } = useAuthentication();
  const db = getDatabase();
  const [data, setData] = useState([]);
  const [moviekeys, setMoviekeys] = useState([]);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w500"
  const dbRef = ref(db);

  function getUserData(){
    get(child(dbRef, 'users/'+String(user?.uid)+'/watchlist'))
    .then((snapshot) => {
      var movies = [];
      snapshot.forEach(snapshot => {
        movies.push(snapshot.val());
      });
      setData(movies)
      // console.log(data)
      console.log("Updating...")
    });
  }

  function removeEntryFixed(userId, key){
    const dfRef = ref(db);
    remove(ref(db, 'users/'+userId+'/watchlist/'+key));
  }

  const addedalert = (title) =>
  Alert.alert('Removed '+title+' from watchlist!', '', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

  useEffect(() => {  
    setTimeout(() => {
      getUserData();
    }, 1000);
  },);

  return (
    <View style={styles.container}>
      <View style={styles.userBar}>
        <Button 
        title="Settings"
        icon={{
          name: 'cog',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        iconRight
        iconContainerStyle={{ marginLeft: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: '#7E7E7E',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 30,
        }}
        containerStyle={{
          width: 200,
        }}
        onPress={() => navigation.navigate('User Account')}
        />
        {/* <Button title="L" onPress={() => getUserData()}/> */}
      </View>
      <ScrollView
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
                      <Text key={key} numberOfLines={14} style={{ width: 100, flex: 1, flexWrap: 'wrap', color: 'white'}}>{data.overview}</Text>
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
    display: 'flex',
    flex: 1,
    backgroundColor: '#0e1111',
    alignItems: 'stretch',
    justifyContent: 'center',
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
    width: 150,
    height: 200,
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

export default WatchListcreen;