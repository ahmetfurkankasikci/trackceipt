import { FC, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { useScanViewModel } from './useScanViewModel';
import Icon from '../../components/Icon';

const ScanScreen: FC = () => {
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
    if (selectedImage?.base64 && selectedImage.uri) {
      await analyzeReceipt(selectedImage.base64, selectedImage.uri);
    } else {
      Alert.alert('Hata', 'Lütfen önce bir fiş fotoğrafı seçin.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name='ReceiptText' size={48} color='#1380EC' />
        </View>
        <Text style={styles.title}>Fişinizi Ekleyin</Text>
        <Text style={styles.placeholderText}>Fişinizin fotoğrafını çekin veya galerinizden bir fotoğraf seçin.</Text>
        <Pressable onPress={handleCameraLaunch} disabled={isLoading} style={[styles.baseButton, styles.buttonCamera]} >
          <Icon name="Camera" size={24} color="white" />
          <Text style={styles.textWhite}>Fotoğrafı Çek</Text>
        </Pressable>
        <Pressable onPress={handleGalleryLaunch} disabled={isLoading} style={[styles.baseButton, styles.buttonGallery]} >
          <Icon name="Images" size={24} color="black" />
          <Text style={styles.textBlack}>Galeriden Seç</Text>
        </Pressable>
        <View style={styles.imageContainer}>
          {selectedImage?.uri ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          ) : (
            <Text>a</Text>
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

        <View style={styles.analyzeButton}>
          <Button
            title="Fişi Analiz Et"
            onPress={handleAnalyzeReceipt}
            disabled={!selectedImage || isLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
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
  },
  textWhite: {
    color: 'white',
  },
  textBlack: {
    color: 'black',
  },
  buttonCamera: {
    backgroundColor: '#137FEC',
  },
  buttonGallery: {
    backgroundColor: '#E7EDF3',

  },
  baseButton: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: 10,
    borderRadius: 10,
    elevation: 4,
    marginBottom: 10,
  }
});

export default ScanScreen;
