import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Home';
import UserProfileScreen from '../screens/UserProfile';
import SearchScreen from '../screens/SearchScreen';
import DiscoverScreen from '../screens/Discover';
import MoviePage from '../screens/MoviePage';

const Tab = createBottomTabNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Discover" component={DiscoverScreen}/>
        <Tab.Screen name="Search" component={SearchScreen}/>
        <Tab.Screen name="User Profile" component={UserProfileScreen}/>
        <Tab.Screen name="View Recent" component={MoviePage}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}