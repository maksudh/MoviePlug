import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MoviePage from '../screens/MoviePage';
import UserTabs from './userTabs';
import UserAccount from '../screens/UserAccount';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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