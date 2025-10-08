import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from './Icon';
// İkon kütüphanesi

// Tarihi gg/aa/yyyy formatına çeviren yardımcı fonksiyon
const formatDate = (date: Date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const DatePickerInput = ({ value, onDateChange }: { value: Date, onDateChange: (date: Date) => void }) => {
    const [modalOpen, setModalOpen] = useState(false);

    // Modal açıldığında, kullanıcının yaptığı değişiklikleri geçici olarak tutar.
    // Sadece "Onayla" butonuna basılınca asıl 'value' güncellenir.
    const [tempDate, setTempDate] = useState(value || new Date());

    const handleOpenModal = () => {
        // Modal'ı açarken geçici tarihi, mevcut değerle eşitliyoruz.
        setTempDate(value || new Date());
        setModalOpen(true);
    };

    const handleConfirm = () => {
        onDateChange(tempDate); // Ana bileşendeki state'i güncelle
        setModalOpen(false);   // Modal'ı kapat
    };

    const handleCancel = () => {
        setModalOpen(false); // Değişiklik yapmadan modal'ı kapat
    };

    return (
        <>
            {/* Input gibi görünen dokunulabilir alan */}
            <TouchableOpacity style={styles.inputContainer} onPress={handleOpenModal}>
                <Text style={styles.inputText}>{formatDate(value)}</Text>
                <Icon name="Calendar" size={24} color="#333" />
            </TouchableOpacity>

            {/* Tarih seçiciyi içeren Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalOpen}
                onRequestClose={handleCancel}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <DatePicker
                            date={tempDate}
                            theme='light'
                            onDateChange={setTempDate}
                            mode="date"
                            locale="tr-TR" // Android'de iOS benzeri bir görünüm sunar
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>Vazgeç</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={handleConfirm}
                            >
                                <Text style={styles.buttonText}>Onayla</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    // Input Alanı Stilleri
    inputContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: 'white',
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    // Modal Stilleri
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    cancelButton: {
        backgroundColor: '#E2E8F0',
    },
    confirmButton: {
        backgroundColor: '#2196F3',
    },
    cancelButtonText: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DatePickerInput;