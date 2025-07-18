// src/presentation/navigation/types.ts

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Hangi ekranların hangi parametreleri aldığını burada merkezi olarak tanımlıyoruz.
export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
};

// Artık tüm ekranların kullanabileceği genel bir navigasyon tipi.
export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
