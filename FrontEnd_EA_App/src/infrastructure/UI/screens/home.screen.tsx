import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import FeedScreen from './feed.screen';
import DiscoveryScreen from './discovery.screen';
import CalendarEventsScreen from './calendarevents.screen';
import ProfileScreen from './profile.screen';
import PublicationUpScreenA from './Publication/publicationUp.screen';
import { ImageBackground, StyleSheet } from 'react-native';
import MapScreen from './map.screen';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {

  return (
    
    <Tab.Navigator screenOptions={{ tabBarStyle: { backgroundColor: '#000000', borderTopWidth: 0 }, tabBarShowLabel: false,  }}>
      
      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="image" size={30} color='#66fcf1' />
          ), headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 },
        }} />
      <Tab.Screen name="Discovery" component={DiscoveryScreen} options={{ tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="magnify" size={25} color='#66fcf1' />
          ), headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 },
        }} />
      <Tab.Screen name="Post a Publication" component={PublicationUpScreenA} options={{ tabBarIcon: ({ color, size }) => (
          <Fontisto name="camera" size={18} color='#66fcf1' />
          ), headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 },
        }} />
      <Tab.Screen name="Locations" component={MapScreen} options={{ tabBarIcon: ({ color, size }) => (
        <Fontisto name="map" size={18} color='#66fcf1' />
        ), headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 },
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => (
          <Fontisto name="home" size={18} color='#66fcf1' />
          ), headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30},
        }} />

    </Tab.Navigator>
    
  );
}