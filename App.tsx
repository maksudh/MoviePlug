import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ThemeProvider } from '@rneui/themed';
import './config/firebase';
import RootNavigation from './navigation';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <ThemeProvider>
        <RootNavigation />
        <StatusBar style="auto" />
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
});
