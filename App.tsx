/* eslint-disable react-native/no-inline-styles */
import { PermissionsAndroid, Platform } from 'react-native';
import { useEffect } from 'react';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import 'reflect-metadata';
import './src/core/di/container';
import { Provider } from 'react-redux';
import { store } from './src/core/redux/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const cameraGranted = granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED;

        } catch (err) {
          console.warn(err);
        }
      }
    }
    requestPermissions();
  }, [])
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default App;
