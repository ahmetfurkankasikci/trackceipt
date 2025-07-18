// src/presentation/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tipleri artık yeni, bağımsız dosyamızdan alıyoruz.
import type { RootStackParamList } from './types';

// Ekranlarınızı import edin.
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ScanScreen from '../screens/ScanScreen/ScanScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Masraflarım' }}
        />
        <Stack.Screen 
          name="Scan" 
          component={ScanScreen} 
          options={{ title: 'Fiş Tara', presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
