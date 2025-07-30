import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useCategoryManagementViewModel } from './useCategoryManagementViewModel';
import Category from '../../../domain/models/Category';

const CategoryManagementScreen: React.FC = () => {
    const { categories, isModalVisible, setModalVisible, editingCategory, name, setName, color, setColor, openToAdd, openToEdit, handleSave, handleDelete } = useCategoryManagementViewModel();

    const confirmDelete = (item: Category) => {
        Alert.alert("Kategoriyi Sil", `"${item.name}" kategorisini silmek istediğinizden emin misiniz? Bu kategoriye ait masraflar kategorisiz kalacaktır.`,
            [{ text: "İptal", style: "cancel" }, { text: "Sil", onPress: () => handleDelete(item.id ?? ""), style: "destructive" }]
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id ?? ""}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => openToEdit(item)}>
                        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                        <Text style={styles.itemName}>{item.name}</Text>
                        <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Sil</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
            <Button title="Yeni Kategori Ekle" onPress={openToAdd} />

            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}</Text>
                        <TextInput style={styles.input} placeholder="Kategori Adı" value={name} onChangeText={setName} />
                        <View style={styles.colorPicker}>
                            <ColorPicker
                                color={color}
                                onColorChangeComplete={setColor}
                                thumbSize={30}
                                sliderSize={30}
                                noSnap={true}
                                row={false}
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <Button title="İptal" onPress={() => setModalVisible(false)} color="gray" />
                            <Button title="Kaydet" onPress={handleSave} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
// ... CategoryManagementScreen için stiller ...
export default CategoryManagementScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    colorDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        marginLeft: 'auto',
    },
    deleteText: {
        color: 'red',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    colorPicker: { height: 300, width: '100%' }




})