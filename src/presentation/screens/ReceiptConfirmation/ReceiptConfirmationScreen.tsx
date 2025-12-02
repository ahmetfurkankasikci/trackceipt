import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useReceiptConfirmationViewModel } from './useReceiptConfirmationViewModel';
import { FC, useState, useEffect } from 'react';
import Icon from '../../components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';

const ReceiptConfirmationScreen: FC = () => {
    const {
        amount,
        setAmount,
        shopName,
        setShopName,
        date,
        setDate,
        isLoading,
        error,
        handleSave,
        handleCancel,
        imageUri,
    } = useReceiptConfirmationViewModel();

    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState('Kategori Seçin');
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);

    // Format date as DD.MM.YYYY
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const [dateText, setDateText] = useState(formatDate(date));

    // Sync dateText when date changes (e.g. from OCR or DatePicker)
    useEffect(() => {
        setDateText(formatDate(date));
    }, [date]);

    const handleDateTextChange = (text: string) => {
        setDateText(text);
        // Basic validation DD.MM.YYYY
        if (text.length === 10) {
            const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
            const match = text.match(regex);
            if (match) {
                const day = parseInt(match[1], 10);
                const month = parseInt(match[2], 10) - 1;
                const year = parseInt(match[3], 10);
                const newDate = new Date(year, month, day);
                if (newDate.getDate() === day && newDate.getMonth() === month && newDate.getFullYear() === year) {
                    setDate(newDate);
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <Pressable onPress={handleCancel} style={styles.backButton}>
                    <Icon name="ArrowLeft" size={24} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.headerTitle}>Makbuz Detayları</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Receipt Image */}
                {imageUri && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUri }} style={styles.receiptImage} resizeMode="contain" />
                    </View>
                )}

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Satıcı (Seller/Shop Name) */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Satıcı</Text>
                        <TextInput
                            style={styles.input}
                            value={shopName}
                            onChangeText={setShopName}
                            placeholder="Kahve Dünyası"
                            placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        />
                    </View>

                    {/* Tarih (Date) */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Tarih</Text>
                        <View style={styles.dateInput}>
                            <TextInput
                                style={styles.dateTextInput}
                                value={dateText}
                                onChangeText={handleDateTextChange}
                                placeholder="GG.AA.YYYY"
                                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                                keyboardType="numeric"
                                maxLength={10}
                            />
                            <Pressable onPress={() => setDatePickerOpen(true)} style={styles.calendarButton}>
                                <Icon name="Calendar" size={20} color="rgba(255, 255, 255, 0.6)" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Toplam Tutar (Total Amount) */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Toplam Tutar</Text>
                        <View style={styles.amountInputContainer}>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="decimal-pad"
                                placeholder="185,50"
                                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                            />
                            <Text style={styles.currencyLabel}>TL</Text>
                        </View>
                    </View>

                    {/* Kategori (Category) */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.label}>Kategori</Text>
                        <Pressable style={styles.categorySelector}>
                            <Text style={styles.categoryText}>{selectedCategory}</Text>
                            <Icon name="ChevronDown" size={20} color="rgba(255, 255, 255, 0.6)" />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={[styles.bottomButtons, { paddingBottom: insets.bottom + 16 }]}>
                <Pressable
                    style={styles.cancelButton}
                    onPress={handleCancel}
                    disabled={isLoading}
                >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                </Pressable>
                <Pressable
                    style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    <Text style={styles.saveButtonText}>
                        {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Text>
                </Pressable>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <DatePicker
                modal
                open={isDatePickerOpen}
                date={date}
                mode="date"
                onConfirm={(date) => {
                    setDatePickerOpen(false);
                    setDate(date);
                }}
                onCancel={() => {
                    setDatePickerOpen(false);
                }}
                locale="tr"
                title="Tarih Seçin"
                confirmText="Seç"
                cancelText="İptal"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A2F2F',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    imageContainer: {
        backgroundColor: '#D4A574',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    receiptImage: {
        width: '100%',
        height: '100%',
    },
    formContainer: {
        gap: 20,
    },
    fieldContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    dateInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    dateTextInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 12,
    },
    calendarButton: {
        padding: 8,
    },
    dateText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    amountInputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    amountInput: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        padding: 0,
    },
    currencyLabel: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        marginLeft: 8,
        fontWeight: '600',
    },
    categorySelector: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    categoryText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    bottomButtons: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#00FF94',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A2F2F',
    },
    errorContainer: {
        position: 'absolute',
        top: 100,
        left: 16,
        right: 16,
        backgroundColor: '#FF4444',
        padding: 12,
        borderRadius: 8,
    },
    errorText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 14,
    },
});

export default ReceiptConfirmationScreen;