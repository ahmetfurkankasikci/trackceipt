import { PermissionsAndroid, Platform } from 'react-native';
import { useEffect } from 'react';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import 'reflect-metadata'; // <-- BU İLK IMPORT OLMALI
import './src/core/di/container'; 
function App() {
  useEffect(() => {
    async function requestPermissions() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]);

          console.log('İzin sonuçları:', granted);

          const cameraGranted = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;
          if (cameraGranted) {
            console.log('Kamera izni verildi');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }
    requestPermissions();
  }, [])
  return (
    <AppNavigator />
  );
}

export default App;
