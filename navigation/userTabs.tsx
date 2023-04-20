import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Button } from 'react-native-elements';
import HomeScreen from '../screens/Home';
import SearchScreen from '../screens/SearchScreen';
import DiscoverScreen from '../screens/Discover';
import WatchListcreen from '../screens/WatchList';

const Tab = createBottomTabNavigator();

// all pages for the app, including menu bar

export default function UserTabs() {
  return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: '#0e1111',
          },
          tabBarStyle: {
            backgroundColor: '#0e1111',
          },
          headerTitleStyle: {
            color: 'white'
          },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'For you') {
            iconName = focused
              ? 'ios-home'
              : 'ios-home-outline';
            } else if (route.name === 'My Movies') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
              else if (route.name === 'Discover') {
              iconName = focused ? 'ios-trending-up' : 'ios-trending-up-outline'
            }
              else if (route.name === 'Search') {
              iconName = focused ? 'ios-search' : 'ios-search-outline'
            }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#147efb',
        tabBarInactiveTintColor: 'white',
      })}
      >
        <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        />
        <Tab.Screen 
        name="For you" 
        component={HomeScreen} 
        />
        <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        />
        <Tab.Screen 
        name="My Movies" 
        component={WatchListcreen}
        />
      </Tab.Navigator>
  );
}