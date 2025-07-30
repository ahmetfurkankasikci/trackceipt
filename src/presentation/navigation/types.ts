import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native'; 
import Expense from '../../domain/models/Expense';

export type RootStackParamList = {

  Home: { newExpenseAdded?: boolean } | undefined;
  Scan: undefined;
  Login: undefined;
  SignUp: undefined;
  Profile: undefined;
  CategoryManagement: undefined;
  Budget: undefined;
  ExpenseDetail: { expense: Expense };
};


export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;


export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export type ExpenseDetailScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseDetail'>;
