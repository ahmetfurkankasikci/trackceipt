import { FC, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigationProp, HomeScreenRouteProp } from '../../navigation/types';
import { useHomeViewModel } from './useHomeViewModel';
import Expense from '../../../domain/models/Expense';
import { SwipeListView } from 'react-native-swipe-list-view';
import ExpenseListItem from '../../components/ExpenseListItem';

const HomeScreen: FC = () => {
    const { expenses, isLoading, categoriesMap } = useHomeViewModel();
    const navigation = useNavigation<AppNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {

        if (route.params?.newExpenseAdded) {
            setIsSyncing(true);
            navigation.setParams({ newExpenseAdded: false });
        }
    }, [route.params?.newExpenseAdded, navigation])

    useEffect(() => {
        if (isSyncing && !isLoading) {
            setIsSyncing(false);
        }
    }, [expenses, isSyncing, isLoading]);
    const handlePress = (index: number) => {
        setSelectedIndex(index);
    }
    /*const confirmDelete = (item: Expense) => {
        Alert.alert(
            "Masrafı Sil",
            `"${item.description}" adlı masrafı silmek istediğinizden emin misiniz?`,
            [
                { text: "İptal", style: "cancel" },
                { text: "Sil", onPress: () => handleDeleteExpense(item.id ?? ""), style: "destructive" },
            ]
        );
    };*/
    const renderExpenseItem = ({ item }: { item: Expense }) => {

        const category = item.categoryId ? categoriesMap[item.categoryId] : null;
        const navigateExpense = () => navigation.navigate('ExpenseDetail', { expense: item });
        return (
            <ExpenseListItem expense={item} category={category} onNavigate={navigateExpense} />
        );
    };

    

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Masraflar Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput placeholderTextColor={'#6B7280'} style={styles.searchInput} placeholder='Fişlerinizde ara' />
            </View>
            <ScrollView contentContainerStyle={styles.scrollViewContent} horizontal={true} showsHorizontalScrollIndicator={false}>

                <Pressable onPress={() => handlePress(0)} style={[selectedIndex === 0 ? styles.pressedScrollButton : styles.scrollButton, styles.baseButton]}>

                    <Text style={[selectedIndex === 0 ? styles.textWhite : styles.textBlack]}>Tümü</Text>

                </Pressable>

                <Pressable onPress={() => handlePress(1)} style={[selectedIndex === 1 ? styles.pressedScrollButton : styles.scrollButton, styles.baseButton]}>

                    <Text style={[selectedIndex === 1 ? styles.textWhite : styles.textBlack]}>Yiyecek</Text>

                </Pressable>

                <Pressable onPress={() => handlePress(2)} style={[selectedIndex === 2 ? styles.pressedScrollButton : styles.scrollButton, styles.baseButton]}>

                    <Text style={[selectedIndex === 2 ? styles.textWhite : styles.textBlack]}>Ulaşım</Text>

                </Pressable>

                <Pressable onPress={() => handlePress(3)} style={[selectedIndex === 3 ? styles.pressedScrollButton : styles.scrollButton, styles.baseButton]}>

                    <Text style={[selectedIndex === 3 ? styles.textWhite : styles.textBlack]}>Eğlence</Text>

                </Pressable>

            </ScrollView>
            <SwipeListView
                data={expenses}
                renderItem={renderExpenseItem}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                keyExtractor={(item) => item.id ?? ""}
                contentContainerStyle={expenses.length === 0 ? styles.flex : styles.contentContainer}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>Henüz masraf eklenmemiş.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#6c757d' },

    emptyText: { fontSize: 18, color: '#6c757d' },
    syncingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#eef2ff',
    },
    flex: {
        flex: 1,
    },
    contentContainer: {
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    scrollViewContent: {
        marginBottom:15,
        height: 60,
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 15,

    },
    baseButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 24,
        elevation: 4,
    },
    scrollButton: {
        backgroundColor: 'white',
    },
    pressedScrollButton: {
        backgroundColor: '#137FEC',
    },
    textWhite: {
        color: 'white',
    },
    textBlack: {
        color: 'black',
    },
    searchInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#6B7280',
        borderRadius: 24,
        marginVertical: 10,
        paddingHorizontal: 18,
        height: 50,
        elevation: 4,

    },
    inputContainer: {
        paddingRight: 16,
    }
});
export default HomeScreen;
