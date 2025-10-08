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
        <TouchableHighlight style={styles.rowFront} underlayColor={'#eee'} onPress={() => onNavigate()}>
            <View style={styles.itemContainer}>
                <View style={styles.containerView}>
                    <View style={styles.categoryColorDot} >
                        <Icon name="Utensils" size={24} color="#22C55E" />
                    </View>
                    <View>
                        <Text style={styles.itemDescription}>{expense.description || 'Açıklama Yok'}</Text>
                        <Text style={styles.itemCategory}>{expense?.category || 'Kategorisiz'}</Text>
                    </View>
                </View>
                <View style={styles.amountContainer}><Text style={styles.itemAmount}>{expense.amount.toFixed(2)} TL</Text></View>

            </View>
        </TouchableHighlight>
    );
}
const styles = StyleSheet.create({
    rowFront: {
        backgroundColor: '#fff',
        borderBottomColor: '#e9ecef',
        borderBottomWidth: 1,
        justifyContent: 'center',
        minHeight: 50,
        borderRadius: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#fff',
    },
    containerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryColorDot: {
        width: 36,
        height: 36,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DCFCE7",
        padding: 30,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    itemDescription: {
        fontSize: 16,
        fontWeight: '500',
        color: '#212529'
    },
    itemCategory: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 4,
    },
    amountContainer: {
        paddingHorizontal: 10,
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },

});
export default ExpenseListItem;