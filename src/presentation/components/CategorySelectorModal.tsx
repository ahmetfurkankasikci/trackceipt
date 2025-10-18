import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet'; // BottomSheetModal tipini import ediyoruz
import Icon from './Icon';


// TypeScript Değişikliği: Component'in alacağı proplar için bir arayüz (interface) tanımlıyoruz.
interface CategorySelectorModalProps {
  isVisible: boolean;
  onClose: () => void;
  categories: string[];
  selectedCategory: string;
  onSave: (category: string) => void;
}

const CategorySelectorModal: React.FC<CategorySelectorModalProps> = ({
  isVisible,
  onClose,
  categories,
  selectedCategory,
  onSave,
}) => {
  // TypeScript Değişikliği: useRef'in tipini belirtiyoruz.
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [400], []);

  useEffect(() => {
    if (isVisible) {
      console.log('Modal açıldı')
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [isVisible]);

  // TypeScript Değişikliği: useState'in tipini belirtiyoruz.
  const [tempSelected, setTempSelected] = useState<string>(selectedCategory);

  useEffect(() => {
    setTempSelected(selectedCategory);
  }, [selectedCategory]);


  const handleSave = () => {
    onSave(tempSelected);
    onClose();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onDismiss={onClose}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Kategori Değiştir</Text>

        {categories.map((category: string) => { // 'category' parametresinin string olduğunu belirtiyoruz.
          const isSelected = tempSelected === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.item, isSelected && styles.selectedItem]}
              onPress={() => setTempSelected(category)}
            >
              <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                {category}
              </Text>
              {isSelected && (
                <Icon name="CircleCheckBig" size={24} color="#0052CC" />
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Vazgeç</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};

// Stillerde değişiklik yok, aynı kalabilir.
const styles = StyleSheet.create({
  sheetBackground: { backgroundColor: 'red', borderRadius: 24 },
  handleIndicator: { backgroundColor: '#E0E0E0' },
  contentContainer: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedItem: { backgroundColor: '#E6F0FF' },
  itemText: { fontSize: 16, color: '#333' },
  selectedItemText: { color: '#0052CC', fontWeight: '600' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: { backgroundColor: '#F0F2F5', marginRight: 10 },
  saveButton: { backgroundColor: '#007AFF', marginLeft: 10 },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#333' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default CategorySelectorModal;