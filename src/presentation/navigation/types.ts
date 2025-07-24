// src/presentation/navigation/types.ts

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native'; // RouteProp'u import et

// Hangi ekranların hangi parametreleri aldığını burada merkezi olarak tanımlıyoruz.
export type RootStackParamList = {
  // Home ekranı artık bir "yeni masraf eklendi" parametresi alabilir.
  Home: { newExpenseAdded?: boolean } | undefined;
  Scan: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
};

// Tüm ekranların kullanabileceği genel bir navigasyon tipi.
export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// HomeScreen'in route prop'u için özel bir tip oluşturuyoruz.
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
