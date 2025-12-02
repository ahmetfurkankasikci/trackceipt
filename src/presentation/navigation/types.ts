import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import Expense from '../../domain/models/Expense';

export type ScanStackParamList = {
  Scan: undefined;
  ReceiptAnalysisLoading: {
    base64Image: string;
    imageUri: string;
  };
  ReceiptConfirmation: {
    extractedData: Omit<Expense, 'id' | 'userId'>;
    imageUri: string;
    base64Image: string;
  };
};

export type RootStackParamList = {
  Home: { newExpenseAdded?: boolean } | undefined;
  ScanStack: NavigatorScreenParams<ScanStackParamList>;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  CategoryManagement: undefined;
  Budget: undefined;
  ExpenseDetail: { expense: Expense };
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type ReceiptConfirmationScreenRouteProp = RouteProp<ScanStackParamList, 'ReceiptConfirmation'>;
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;
