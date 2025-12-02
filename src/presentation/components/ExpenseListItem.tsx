import { FC } from "react";
import Expense from "../../domain/models/Expense";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Category from "../../domain/models/Category";
import Icon from "./Icon";

interface ExpenseListItemProps {
    expense: Expense;
    category: Category | null;
    onNavigate: () => void;
}

const ExpenseListItem: FC<ExpenseListItemProps> = ({ expense, onNavigate }) => {
    return (
        <TouchableHighlight style={styles.rowFront} underlayColor={'#1E293B'} onPress={() => onNavigate()}>
            <View style={styles.itemContainer}>
                <View style={styles.containerView}>
                    <View style={styles.categoryColorDot}>
                        <Icon name="ShoppingCart" size={24} color="#10B981" />
                    </View>
                    <View>
                        <Text style={styles.itemDescription}>{expense.shopName || 'Açıklama Yok'}</Text>
                        <Text style={styles.itemCategory}>{expense?.category || 'Kategorisiz'}</Text>
                    </View>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.itemAmount}>₺{expense.amount?.toFixed(2) ?? "0"}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    rowFront: {
        backgroundColor: '#1E293B',
        borderBottomColor: '#334155',
        borderBottomWidth: 1,
        justifyContent: 'center',
        minHeight: 50,
        borderRadius: 0,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 0,
        backgroundColor: '#1E293B',
    },
    containerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryColorDot: {
        width: 48,
        height: 48,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#064E3B",
        marginRight: 12,
        borderRadius: 12,
    },
    itemDescription: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF'
    },
    itemCategory: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 4,
    },
    amountContainer: {
        paddingHorizontal: 10,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#10B981',
    },
});

export default ExpenseListItem;