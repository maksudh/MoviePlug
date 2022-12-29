import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'


import HomeScreen from '../screens/Home';
import UserProfileScreen from '../screens/UserProfile';
import SearchScreen from '../screens/SearchScreen';
import DiscoverScreen from '../screens/Discover';

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-home'
              : 'ios-home-outline';
            } else if (route.name === 'User Profile') {
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
        // tabBarActiveTintColor: 'tomato',
        // tabBarInactiveTintColor: 'gray',
      })}
      >
        <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        />
        <Tab.Screen 
        name="Discover" 
        component={DiscoverScreen}
        />
        <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        />
        <Tab.Screen 
        name="User Profile" 
        component={UserProfileScreen}
        />
      </Tab.Navigator>
  );
}