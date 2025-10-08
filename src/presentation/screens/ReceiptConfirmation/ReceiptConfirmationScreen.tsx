import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useReceiptConfirmationViewModel } from './useReceiptConfirmationViewModel';
import { FC, useState } from 'react';
import DatePickerInput from '../../components/DatePickerInput';
import Icon from '../../components/Icon';
import CategorySelectorModal from '../../components/CategorySelectorModal';

const ReceiptConfirmationScreen: FC = () => {
    const {

        amount,
        setAmount,
        description,
        setDescription,
        isLoading,
        error,
        handleSave,
    } = useReceiptConfirmationViewModel();
    const [date, setDate] = useState(new Date());
    const [isSheetVisible, setSheetVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Market');
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/*<Image source={{ uri: imageUri }} style={styles.image} />*/}
            <Text style={styles.title}>Fiş Bilgileri</Text>
            <View style={styles.infosContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Tutar</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="Örn: 150.75"
                    />
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Tarih</Text>
                    <DatePickerInput value={date} onDateChange={setDate} />
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Kategori</Text>
                    <TouchableOpacity style={styles.categoryButton}>
                        <Icon name="Utensils" size={16} color="#475569" />
                        <Text style={styles.categoryLabel}>Yemek</Text>
                    </TouchableOpacity>

                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Mağaza</Text>
                    <TextInput
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>
            </View>
            <Text style={styles.title}>Notlar</Text>
            <TextInput multiline numberOfLines={6} style={styles.textArea} maxLength={40} />

            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <View style={styles.buttonContainer}>
                <Button title={isLoading ? 'Kaydediliyor...' : 'Kaydet'} onPress={handleSave} disabled={isLoading} />
            </View>
            <CategorySelectorModal isVisible={isSheetVisible}
                onClose={() => setSheetVisible(false)}
                categories={[]}
                selectedCategory={selectedCategory}
                onSave={(category: string) => {
                    setSelectedCategory(category);
                    setSheetVisible(false);
                }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,

    },
    container: {
        backgroundColor: '#F8FAFC',
        padding: 20,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
        borderRadius: 8,
    },
    infosContainer: {
        width: '100%',
        gap: 15,
        padding: 20,
        backgroundColor: 'white',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 8,
        elevation: 4,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        marginBottom: 30,
    },
    infoRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 32,
        paddingHorizontal: 12,
        paddingVertical: 5,
        gap: 7,
        backgroundColor: '#F1F5F9'

    },
    label: {
        flex: 1,
        fontSize: 16,
        color: '#66768D',
        marginTop: 15,
        marginBottom: 5,

    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: 30,
    },
    categoryLabel: {
        color: '#475569'
    },
    textArea: {
        // ✨ Stil sihrinin gerçekleştiği yer burası ✨
        height: 150, // Sabit bir yükseklik veriyoruz
        justifyContent: 'flex-start', // Metnin yukarıdan başlamasını sağlar
        textAlignVertical: 'top', // Android için metni yukarıya hizalar

        // Görsel Stiller
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12, // Resimdeki gibi yuvarlak köşeler
        padding: 15, // İç boşluk
        fontSize: 16, // Yazı tipi boyutu
        color: '#333', // Yazılan metnin rengi

        // Hafif bir gölge efekti (isteğe bağlı)
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
});

export default ReceiptConfirmationScreen;