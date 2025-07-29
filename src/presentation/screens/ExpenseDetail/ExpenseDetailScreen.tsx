import { FC, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useExpenseDetailViewModel } from './useExpenseDetailViewModel';

const ExpenseDetailScreen: FC = () => {
    const { isEditing, setIsEditing, description, setDescription, amount, setAmount, date, setDate, isLoading, handleUpdate, initialExpense } = useExpenseDetailViewModel();
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const renderField = (label: string, value: string, editableValue: string, onChangeText: (text: string) => void, keyboardType: 'default' | 'numeric' = 'default') => (
        <View style={styles.fieldContainer}>
            <Text style={styles.label}>{label}</Text>
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={editableValue}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                />
            ) : (
                <Text style={styles.value}>{value}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {renderField("Açıklama", initialExpense.description ?? "", description ?? "", setDescription)}
            {renderField("Tutar (TL)", initialExpense.amount.toFixed(2), amount, setAmount, 'numeric')}

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Tarih</Text>
                {isEditing ? (
                    <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
                        <Text style={styles.input}>{date.toLocaleString('tr-TR')}</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.value}>{initialExpense.date.toLocaleString('tr-TR')}</Text>
                )}
            </View>

            <DatePicker
                modal
                open={isDatePickerVisible}
                date={date}
                onConfirm={(selectedDate) => {
                    setDatePickerVisible(false);
                    setDate(selectedDate);
                }}
                onCancel={() => setDatePickerVisible(false)}
                title="Tarih Seç"
                confirmText="Onayla"
                cancelText="İptal"
            />

            <View style={styles.buttonContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <Button
                        title={isEditing ? "Kaydet" : "Düzenle"}
                        onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    fieldContainer: { marginBottom: 20 },
    label: { fontSize: 16, color: 'gray', marginBottom: 5 },
    value: { fontSize: 18, padding: 10 },
    input: { fontSize: 18, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
    buttonContainer: { marginTop: 30 }
});

export default ExpenseDetailScreen;