import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

import MoviePage from '../screens/MoviePage';
import UserTabs from './userTabs';
import UserAccount from '../screens/UserAccount';
import Survey from '../screens/Survey';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

// sees if user has been through on boarding or not and chooses to go to the user stack with it or not

export default function UserStack() {
  const [viewOnboarding, setViewOnboarding] = useState(false);

  const checkOnboarding = async () => {
    try{
      const value = await AsyncStorage.getItem('@viewOnboarding');

      if (value !== null) {
        setViewOnboarding(true)
      }
    } catch {
        console.log('Error @checkOnboarding:');
    }
  }

  useEffect(() => {
    checkOnboarding();
  }, [])

  return (
      viewOnboarding ? 
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#232b2b',
                },
                headerTitleStyle: {
                  color: 'white'
                },
              }}>
          <Stack.Screen 
          options={{headerShown: false}} 
          name="main" 
          component={UserTabs} 
          />
          <Stack.Screen 
          options={{ 
            presentation: 'modal',
            headerBackTitle: 'Back'
          }}
          name="Details" 
          component={MoviePage}
          />
          <Stack.Screen 
          options={{ presentation: 'modal' }}
          name="User Account" 
          component={UserAccount} 
          />
        </Stack.Navigator>
      </NavigationContainer> : 
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0e1111',
          },
          headerTitleStyle: {
            color: 'white'
          },
        }}>
          <Stack.Screen
          name="Finish setting up"
          component={Survey}
          />
          <Stack.Screen 
          options={{headerShown: false}} 
          name="main" 
          component={UserTabs} 
          />
          <Stack.Screen 
          options={{ 
            presentation: 'modal',
            headerBackTitle: 'Back'
          }}
          name="Details" 
          component={MoviePage}
          />
          <Stack.Screen 
          options={{ presentation: 'modal' }}
          name="User Account" 
          component={UserAccount} 
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}