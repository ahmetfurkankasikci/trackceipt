import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { HomeViewModel } from './HomeViewModel';
import { GetExpensesUseCase } from '../../../domain/usecases/GetExpensesUseCase';
import { MockExpenseRepositoryImpl } from '../../../data/repositories/MockExpenseRepositoryImpl';

const HomeScreen: FC = () => {
    const expenseRepository = new MockExpenseRepositoryImpl();
    const viewModel = new HomeViewModel(new GetExpensesUseCase(expenseRepository));
    const [expenses, setExpenses] = useState(viewModel.expenses);
    useEffect(() => {
        const load = async () => {
            await viewModel.loadExpenses();
            setExpenses(viewModel.expenses);
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <View style={styles.container}>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id.toString()}

                renderItem={({ item }) => (
                    <View>
                        <Text>{item.description}</Text>
                        <Text>${item.amount.toFixed(2)}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
         flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

export default HomeScreen