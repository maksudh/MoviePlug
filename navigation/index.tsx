import React from 'react';
import { useAuthentication } from '../utils/hooks/useAuthentication';
import UserStack from './userStack';
import AuthStack from './authStack';

// Decides on user or auth stack depending on if the user is logged in or not

export default function RootNavigation() {
  const { user } = useAuthentication();

  return (
    user ? <UserStack /> : <AuthStack />
    );
}