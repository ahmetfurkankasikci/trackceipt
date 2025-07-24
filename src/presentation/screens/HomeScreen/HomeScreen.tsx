// src/presentation/screens/HomeScreen/HomeScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppNavigationProp, HomeScreenRouteProp } from '../../navigation/types';
import { useHomeViewModel } from './useHomeViewModel'; // Sadece ViewModel hook'unu import ediyoruz.
import Expense from '../../../domain/models/Expense';

const HomeScreen: React.FC = () => {
    // Artık 'new' ile manuel oluşturma yok!
    // Tüm mantık ve state, ViewModel hook'unun içinde saklı.
    const { expenses, isLoading } = useHomeViewModel();
    const navigation = useNavigation<AppNavigationProp>();
    const route = useRoute<HomeScreenRouteProp>();
    const [isSyncing, setIsSyncing] = useState(false);
    useEffect(() => {
        // ScanScreen'den yeni bir masraf eklendi parametresiyle dönüldüyse,
        // senkronizasyon indicator'ını başlat.
        if (route.params?.newExpenseAdded) {
            setIsSyncing(true);
            // Parametreyi "kullandıktan" sonra temizle.
            navigation.setParams({ newExpenseAdded: false });
        }
    }, [route.params?.newExpenseAdded, navigation])

    useEffect(() => {
        // Eğer senkronizasyon bekleniyorsa ve masraf listesi güncellendiyse
        // (yani yeni veri Firestore'dan geldiyse), indicator'ı kapat.
        if (isSyncing && !isLoading) {
            setIsSyncing(false);
        }
    }, [expenses, isSyncing, isLoading]);


    const renderExpenseItem = ({ item }: { item: Expense }) => (
        <View style={styles.itemContainer}>
            <View>
                <Text style={styles.itemDescription}>{item.description || 'Açıklama Yok'}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <Text style={styles.itemAmount}>{item.amount.toFixed(2)} TL</Text>
        </View>
    );

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
            {/* Senkronizasyon Indicator'ı */}
            {isSyncing && (
                <View style={styles.syncingContainer}>
                    <ActivityIndicator color="#4338ca" />
                    <Text style={styles.syncingText}>Masraflar güncelleniyor...</Text>
                </View>
            )}
            <FlatList
                data={expenses}
                renderItem={renderExpenseItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={expenses.length === 0 && styles.listEmpty}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>Henüz masraf eklenmemiş.</Text>
                        <Text style={styles.emptySubText}>Başlamak için bir fiş tarayın!</Text>
                    </View>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Scan')}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listEmpty: { flex: 1 },
    loadingText: { marginTop: 10, fontSize: 16, color: '#6c757d' },
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e9ecef', backgroundColor: '#fff' },
    itemDescription: { fontSize: 16, fontWeight: '500', color: '#212529' },
    itemCategory: { fontSize: 14, color: '#6c757d', marginTop: 4 },
    itemAmount: { fontSize: 16, fontWeight: 'bold', color: '#28a745' },
    emptyText: { fontSize: 18, color: '#6c757d' },
    emptySubText: { fontSize: 14, color: '#adb5bd', marginTop: 8 },
    syncingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#eef2ff',
    },
    syncingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#4338ca',
        fontWeight: '500',
    },
    fab: { position: 'absolute', width: 60, height: 60, borderRadius: 30, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', right: 20, bottom: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
    fabIcon: { fontSize: 30, color: '#fff' }
});
export default HomeScreen;
