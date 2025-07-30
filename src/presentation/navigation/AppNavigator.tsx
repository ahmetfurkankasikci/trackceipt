import { FC, useEffect, useMemo } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { AppNavigationProp, RootStackParamList } from './types';


import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ScanScreen from '../screens/ScanScreen/ScanScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppRootState } from '../../core/redux/store';
import { container } from 'tsyringe';
import { setUser } from '../../core/redux/slices/authSlice';
import { OnAuthStateChangedUseCase } from '../../domain/usecases/OnAuthStateChangedUseCase';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ExpenseDetailScreen from '../screens/ExpenseDetail/ExpenseDetailScreen';
import CategoryManagementScreen from '../screens/CategoryManagement/CategoryManagementScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();


const ProfileHeaderButton = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.headerButton}>
      <Text style={styles.headerButtonText}>👤</Text>
    </TouchableOpacity>
  );
};

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#007bff' }, headerTintColor: '#fff' }}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Masraflarım', headerRight: ProfileHeaderButton, }} />
    <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Fiş Tara', presentation: 'modal' }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} options={{ title: 'Masraf Detayı' }} />
    <Stack.Screen name="CategoryManagement" component={CategoryManagementScreen} options={{ title: 'Kategorileri Yönet' }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);


const AppNavigator: FC = () => {
  const { user, authReady } = useSelector((state: AppRootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const onAuthStateChangedUseCase = useMemo(() => container.resolve(OnAuthStateChangedUseCase), []);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedUseCase.execute((userChange) => {
      dispatch(setUser(userChange));
    });

    return unsubscribe;
  }, [dispatch, onAuthStateChangedUseCase]);

  if (!authReady) {
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
