import { FC, useEffect, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TextInput, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigationProp, HomeScreenRouteProp } from '../../navigation/types';
import { useHomeViewModel } from './useHomeViewModel';
import Expense from '../../../domain/models/Expense';
import { SwipeListView } from 'react-native-swipe-list-view';
import ExpenseListItem from '../../components/ExpenseListItem';
import Icon from '../../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen: FC = () => {
    const { expenses, isLoading, categoriesMap } = useHomeViewModel();
    const navigation = useNavigation<AppNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const [isSyncing, setIsSyncing] = useState(false);
    const [sortByDate, setSortByDate] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const insets = useSafeAreaInsets();

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

    // Sort expenses based on sortByDate state
    const sortedExpenses = useMemo(() => {
        const expensesCopy = [...expenses];
        if (sortByDate) {
            // Sort by date (newest first)
            return expensesCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else {
            // Sort by amount (highest first)
            return expensesCopy.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        }
    }, [expenses, sortByDate]);

    // Filter expenses based on search query
    const filteredExpenses = useMemo(() => {
        if (!searchQuery.trim()) {
            return sortedExpenses;
        }

        const query = searchQuery.toLowerCase();
        return sortedExpenses.filter(expense => {
            // Search by category/merchant name
            const categoryName = (expense.categoryId && categoriesMap[expense.categoryId]?.name)
                ? categoriesMap[expense.categoryId].name.toLowerCase()
                : '';
            const category = expense.category ? expense.category.toLowerCase() : '';

            // Search by amount
            const amount = expense.amount ? expense.amount.toString() : '';

            // Search by date (format: DD/MM/YYYY or partial)
            const date = new Date(expense.date);
            const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;

            // Search by shopName
            const shopName = expense.shopName ? expense.shopName.toLowerCase() : '';

            return categoryName.includes(query) ||
                category.includes(query) ||
                amount.includes(query) ||
                dateStr.includes(query) ||
                shopName.includes(query);
        });
    }, [sortedExpenses, searchQuery, categoriesMap]);

    const renderExpenseItem = ({ item }: { item: Expense }) => {
        const category = item.categoryId ? categoriesMap[item.categoryId] : null;
        const navigateExpense = () => navigation.navigate('ExpenseDetail', { expense: item });
        return (
            <ExpenseListItem expense={item} category={category} onNavigate={navigateExpense} />
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.centerContainer, styles.container]}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity style={styles.headerButton}>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Makbuzlarım</Text>
                <TouchableOpacity style={styles.headerButton}>
                    <Icon name="SlidersHorizontal" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="Search" size={20} color="#9CA3AF" />
                <TextInput
                    placeholderTextColor={'#9CA3AF'}
                    style={styles.searchInput}
                    placeholder='Satıcı, tutar veya tarih ara...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Sort Buttons */}
            <View style={styles.sortContainer}>
                <Pressable
                    onPress={() => setSortByDate(true)}
                    style={[styles.sortButton, sortByDate && styles.sortButtonActive]}
                >
                    <Icon name="ListFilter" size={16} color={sortByDate ? "#10B981" : "#FFFFFF"} />
                    <Text style={[styles.sortButtonText, sortByDate && styles.sortButtonTextActive]}>
                        Tarihe göre sırala
                    </Text>
                    <Icon name="ChevronDown" size={16} color={sortByDate ? "#10B981" : "#FFFFFF"} />
                </Pressable>

                <Pressable
                    onPress={() => setSortByDate(false)}
                    style={[styles.sortButton, !sortByDate && styles.sortButtonActive]}
                >
                    <Icon name="ArrowUpDown" size={16} color={!sortByDate ? "#10B981" : "#FFFFFF"} />
                    <Text style={[styles.sortButtonText, !sortByDate && styles.sortButtonTextActive]}>
                        Tutara göre sırala
                    </Text>
                </Pressable>
            </View>

            {/* View Reports Button */}
            <TouchableOpacity style={styles.reportsButton}>
                <Icon name="ChartBar" size={20} color="#FFFFFF" />
                <Text style={styles.reportsButtonText}>Raporları Görüntüle</Text>
            </TouchableOpacity>

            {/* Expense List */}
            <SwipeListView
                data={filteredExpenses}
                renderItem={renderExpenseItem}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                keyExtractor={(item) => item.id ?? ""}
                contentContainerStyle={filteredExpenses.length === 0 ? styles.flex : styles.contentContainer}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz makbuz eklenmemiş.'}
                        </Text>
                    </View>
                }
            />

            {/* Floating Camera Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('ScanStack', { screen: 'Scan' })}
            >
                <Icon name="Camera" size={28} color="#0F172A" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A' // Dark background
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#9CA3AF'
    },
    emptyText: {
        fontSize: 18,
        color: '#9CA3AF'
    },
    flex: {
        flex: 1,
    },
    contentContainer: {
        gap: 0,
        paddingBottom: 100,
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#0F172A',
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Search Bar Styles
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 50,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#FFFFFF',
    },

    // Sort Buttons Styles
    sortContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    sortButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E293B',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 24,
        gap: 6,
    },
    sortButtonActive: {
        backgroundColor: '#FFFFFF',
    },
    sortButtonText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    sortButtonTextActive: {
        color: '#10B981',
    },

    // Reports Button Styles
    reportsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        paddingVertical: 14,
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 8,
        gap: 8,
    },
    reportsButtonText: {
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '600',
    },

    // Floating Button Styles
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});

export default HomeScreen;
