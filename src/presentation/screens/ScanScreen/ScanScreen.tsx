import { FC, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
  ImagePickerResponse,
} from 'react-native-image-picker';
import { useScanViewModel } from './useScanViewModel';
import Icon from '../../components/Icon';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppNavigationProp } from '../../navigation/types';

const ScanScreen: FC = () => {
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const navigation = useNavigation<AppNavigationProp>();
  const insets = useSafeAreaInsets();

  const { isLoading, analyzeReceipt } = useScanViewModel();

  const handleImageSelection = async (response: ImagePickerResponse) => {
    if (response.didCancel) {
      // User cancelled
    } else if (response.errorCode) {
      // Handle error silently or show minimal feedback
    } else if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      setSelectedImage(asset);

      // Navigate to loading screen with image data
      if (asset.base64 && asset.uri) {
        navigation.navigate('ScanStack', {
          screen: 'ReceiptAnalysisLoading',
          params: {
            base64Image: asset.base64,
            imageUri: asset.uri,
          },
        });
      }
    }
  };

  const handleCameraLaunch = () => {
    launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5
    }, handleImageSelection);
  };

  const handleGalleryLaunch = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5
    }, handleImageSelection);
  };

  const handleBack = () => {
    navigation.navigate('Home');
  };



  return (
    <SafeAreaView style={styles.container}>
      {/* X Button Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable onPress={handleBack} style={styles.closeButton}>
          <Icon name="X" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Camera Icon Circle */}
        <Pressable onPress={handleCameraLaunch} style={styles.iconCircle}>
          <Icon name="Camera" size={80} color="#00FF94" />
        </Pressable>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={styles.mainHeading}>Makbuzunuzun fotoğrafını çekin</Text>
          <Text style={styles.subtitle}>
            Net bir fotoğraf çekerek en iyi sonuçları alın.
          </Text>
        </View>
      </View>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable
          onPress={handleGalleryLaunch}
          disabled={isLoading}
          style={[styles.galleryButton, isLoading && styles.galleryButtonDisabled]}
        >
          <Text style={styles.galleryButtonText}>Galeriden Seç</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A2F2F',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 255, 148, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  textContent: {
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  galleryButton: {
    backgroundColor: '#00FF94',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonDisabled: {
    opacity: 0.6,
  },
  galleryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2F2F',
  },
});

export default ScanScreen;
