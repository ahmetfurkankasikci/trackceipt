import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "../components/Icon";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomTabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    console.log(descriptors);
    const insets = useSafeAreaInsets();
    const textColor = (num: number) => ({ color: state.index === num ? '#10B981' : '#9CA3AF' });

    // Hide tab bar when ScanStack is active
    const currentRoute = state.routes[state.index];
    if (currentRoute.name === 'ScanStack') {
        return null;
    }

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(state.routeNames[0])}>
                <Icon name="Receipt" size={24} color={state.index === 0 ? '#10B981' : '#9CA3AF'} />
                <Text style={[textColor(0), styles.tabLabel]}>Makbuz Listesi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(state.routeNames[2])}>
                <Icon name="Settings" size={24} color={state.index === 2 ? '#10B981' : '#9CA3AF'} />
                <Text style={[textColor(2), styles.tabLabel]}>Ayarlar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#0F172A',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 12,
        paddingHorizontal: 16,
    },
    tabLabel: {
        fontSize: 11,
        marginTop: 6,
        fontWeight: '500',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
});

export default CustomTabBar;