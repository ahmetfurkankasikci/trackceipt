import { FC, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImagePickerResponse, 
} from 'react-native-image-picker';
import { useScanViewModel } from './useScanViewModel'; 
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../../navigation/types';

const ScanScreen: FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);

  const { isLoading, error, analyzeReceipt } = useScanViewModel();

  const handleImageSelection = (response: ImagePickerResponse) => {
    if (response.didCancel) {

    } else if (response.errorCode) {

      Alert.alert('Hata', 'Resim seçilirken bir sorun oluştu.');
    } else if (response.assets && response.assets.length > 0) {
      setSelectedImage(response.assets[0]);
    }
  };

  const handleCameraLaunch = () => {
    launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, handleImageSelection);
  };

  const handleGalleryLaunch = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.5 }, handleImageSelection);
  };

  const handleAnalyzeReceipt = async () => {
    if (selectedImage?.base64) {
      const success = await analyzeReceipt(selectedImage.base64);
      if (success) {
        setSelectedImage(null); 
        navigation.navigate('Home', { newExpenseAdded: true });
        navigation.goBack()
      } else {
        Alert.alert('İşlem Başarısız', 'Fiş analiz edilemedi. Lütfen hata mesajını kontrol edin veya tekrar deneyin.');
      }
    } else {
      Alert.alert('Hata', 'Lütfen önce bir fiş fotoğrafı seçin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fişi Analiz Et</Text>

      <View style={styles.imageContainer}>
        {selectedImage?.uri ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>Lütfen bir fotoğraf çekin veya galeriden seçin.</Text>
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Fiş analiz ediliyor, lütfen bekleyin...</Text>
        </View>
      )}

      {error && !isLoading && (
        <Text style={styles.errorText}>Hata: {error}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Kamerayı Kullan" onPress={handleCameraLaunch} disabled={isLoading} />
        <Button title="Galeriden Seç" onPress={handleGalleryLaunch} disabled={isLoading} />
      </View>

      <View style={styles.analyzeButton}>
        <Button
          title="Fişi Analiz Et"
          onPress={handleAnalyzeReceipt}
          disabled={!selectedImage || isLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  analyzeButton: {
    width: '100%',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  }
});

export default ScanScreen;
