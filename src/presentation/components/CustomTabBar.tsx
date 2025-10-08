import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "../components/Icon";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const CustomTabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    console.log(descriptors);
    const insets = useSafeAreaInsets();
    const textColor = (num: number) => ({ color: state.index === num ? '#137FEC' : '#6B7280' });
    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <TouchableOpacity style={[styles.button, styles.marginRight]} onPress={() => navigation.navigate(state.routeNames[0])}>
                <Icon name="Receipt" size={24} color={state.index === 0 ? '#137FEC' : '#6B7280'} />
                <Text style={[textColor(0), styles.tabLabel]}>Fişler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.centerButton} onPress={() => navigation.navigate(state.routeNames[1])} >
                <Icon name="Plus" size={24} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.marginLeft]} onPress={() => navigation.navigate(state.routeNames[2])}>
                <Icon name="Cog" size={24} color={state.index === 2 ? '#137FEC' : '#6B7280'} />
                <Text style={[textColor(2), styles.tabLabel]}>Ayarlar</Text>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: 'white',
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 5,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 5,
    },
    centerButton: {
        position: 'absolute',
        top: -25,
        left: '50%',
        marginLeft: -35.5,
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        backgroundColor: '#1380EC',
    },
    marginRight: {
        marginRight: 30,
    },
    marginLeft: {
        marginLeft: 30,
    },
});
export default CustomTabBar;