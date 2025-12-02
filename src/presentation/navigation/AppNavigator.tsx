import { FC, useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { RootStackParamList } from './types';


import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppRootState } from '../../core/redux/store';
import { container } from 'tsyringe';
import { setUser } from '../../core/redux/slices/authSlice';
import { OnAuthStateChangedUseCase } from '../../domain/usecases/OnAuthStateChangedUseCase';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomTabBar from '../components/CustomTabBar';
import { ScanStackNavigator } from './ScanStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BottomTab = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();


const getCustomTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;
const MainStack = () => (
  <BottomTab.Navigator tabBar={getCustomTabBar}>
    <BottomTab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <BottomTab.Screen
      name="ScanStack"
      component={ScanStackNavigator}
      options={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}
    />
    <BottomTab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Ayarlar' }} />
  </BottomTab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);


const AppNavigator: FC = () => {
  const { user, authReady } = useSelector((state: AppRootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  const onAuthStateChangedUseCase = useMemo(() => container.resolve(OnAuthStateChangedUseCase), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedUseCase.execute((userChange) => {
      dispatch(setUser(userChange));
    });

    return unsubscribe;
  }, [dispatch, onAuthStateChangedUseCase]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(seen === 'true');
    };
    checkOnboarding();
  }, []);

  if (!authReady || hasSeenOnboarding === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 15,
    padding: 5,
  },
  headerButtonText: {
    fontSize: 24,
    color: '#fff',
  },

});

export default AppNavigator;