// src/presentation/navigation/AppNavigator.tsx

import { FC, useEffect, useMemo } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Tipleri artık yeni, bağımsız dosyamızdan alıyoruz.
import type { AppNavigationProp, RootStackParamList } from './types';

// Ekranlarınızı import edin.
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
const Stack = createNativeStackNavigator<RootStackParamList>();
// --- Navigasyon Yığınları (Stacks) ---

const ProfileHeaderButton = () => {
  const navigation = useNavigation<AppNavigationProp>();
  return (
    // Dokunulabilir bir alan oluşturuyoruz
    <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.headerButton}>
      {/* Profil ikonu (basit bir metinle temsil ediliyor, SVG veya Icon kütüphanesi kullanılabilir) */}
      <Text style={styles.headerButtonText}>👤</Text>
    </TouchableOpacity>
  );
};

// Kullanıcı giriş yapmışsa gösterilecek ekranlar
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#007bff' }, headerTintColor: '#fff' }}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Masraflarım', headerRight: ProfileHeaderButton, }} />
    <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Fiş Tara', presentation: 'modal' }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} options={{ title: 'Masraf Detayı' }} />
  </Stack.Navigator>
);

// Kullanıcı giriş yapmamışsa gösterilecek ekranlar
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// --- Ana Navigasyon Bileşeni ---

const AppNavigator: FC = () => {
  // Redux store'dan gerekli durumları seçiyoruz.
  const { user, authReady } = useSelector((state: AppRootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // DI container'dan UseCase'i alıyoruz.
  const onAuthStateChangedUseCase = useMemo(() => container.resolve(OnAuthStateChangedUseCase), []);

  // Bu effect, uygulama ilk açıldığında bir kere çalışır.
  useEffect(() => {
    // Firebase'in auth durumunu dinlemeye başlıyoruz.
    const unsubscribe = onAuthStateChangedUseCase.execute((userChange) => {
      // Durum her değiştiğinde (giriş, çıkış, ilk yükleme) Redux store'u güncelliyoruz.
      dispatch(setUser(userChange));
    });

    // Component kapandığında dinleyiciyi sonlandırıyoruz.
    return unsubscribe;
  }, [dispatch, onAuthStateChangedUseCase]);

  // Firebase ilk kontrolü yapana kadar bir yüklenme ekranı gösteriyoruz.
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
