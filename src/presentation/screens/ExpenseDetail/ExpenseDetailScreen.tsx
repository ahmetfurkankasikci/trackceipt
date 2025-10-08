import { FC, useMemo, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, FlatList } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useExpenseDetailViewModel } from './useExpenseDetailViewModel';

const ExpenseDetailScreen: FC = () => {
    const { isEditing, setIsEditing, description, setDescription, amount, setAmount, date, setDate, isLoading, handleUpdate, initialExpense, setCategoryModalVisible, isCategoryModalVisible, categories, setCategoryId, categoryId } = useExpenseDetailViewModel();
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const selectedCategory = useMemo(() => categories.find(c => c.id === categoryId), [categories, categoryId]);

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
            {renderField("Tutar (TL)", initialExpense.amount ? initialExpense.amount.toFixed(2):"0", amount, setAmount, 'numeric')}

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Kategori</Text>
                <TouchableOpacity
                    style={styles.input}
                    disabled={!isEditing}
                    onPress={() => setCategoryModalVisible(true)}
                >
                    <View style={styles.colorContainer}>
                        <View style={[styles.colorDot, { backgroundColor: selectedCategory?.color || '#ccc' }]} />
                        <Text style={styles.value}>{selectedCategory?.name || 'Kategori Seçin'}</Text>
                    </View>
                </TouchableOpacity>
            </View>

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
            <Modal visible={isCategoryModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Kategori Seç</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id ?? ""}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.categoryItem} onPress={() => {
                                    setCategoryId(item.id ?? "");
                                    setCategoryModalVisible(false);
                                }}>
                                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button title="Kapat" onPress={() => setCategoryModalVisible(false)} />
                    </View>
                </View>
            </Modal>
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
    buttonContainer: { marginTop: 30 },
    colorDot: { width: 15, height: 15, borderRadius: 7.5, marginRight: 10 },
    colorContainer: { flexDirection: 'row', alignItems: 'center' },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    modalButton: { marginTop: 20 },

});

export default ExpenseDetailScreen;