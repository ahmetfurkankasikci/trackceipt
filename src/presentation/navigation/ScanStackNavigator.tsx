import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScanScreen from '../screens/ScanScreen/ScanScreen';
import ReceiptAnalysisLoadingScreen from '../screens/ReceiptAnalysisLoading/ReceiptAnalysisLoadingScreen';
import ReceiptConfirmationScreen from '../screens/ReceiptConfirmation/ReceiptConfirmationScreen';
import type { ScanStackParamList } from './types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '../components/Icon';


const Stack = createNativeStackNavigator<ScanStackParamList>();
const leftBackButton = (navigation: any) => (
    <View style={styles.leftBackButton}>
        <TouchableOpacity onPress={() => {
            navigation.goBack();
        }}>
            <Icon name='X' size={24} color='black' />
        </TouchableOpacity>
    </View>
)
export const ScanStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Scan' component={ScanScreen} options={{
                headerShown: false,
            }} />
            <Stack.Screen name='ReceiptAnalysisLoading' component={ReceiptAnalysisLoadingScreen} options={{
                headerShown: false,
            }} />
            <Stack.Screen name='ReceiptConfirmation' component={ReceiptConfirmationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};
const styles = StyleSheet.create({
    headerTitle: {
        marginRight: 20,
    },
    headerLeftButton: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 20,
        alignItems: 'center',
    },
    leftBackButton: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});