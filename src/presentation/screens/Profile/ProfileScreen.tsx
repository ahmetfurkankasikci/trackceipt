import { FC } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfileViewModel } from './useProfileViewModel';
import type { AppNavigationProp } from '../../navigation/types';


const ProfileScreen: FC = () => {
  const { user, handleLogout } = useProfileViewModel();
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      {user && <Text style={styles.email}>Giriş Yapan Kullanıcı: {user.email}</Text>}
      
      <View style={styles.buttonWrapper}>
        <Button title="Kategorileri Yönet" onPress={() => navigation.navigate('CategoryManagement')} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Aylık Bütçeyi Ayarla" onPress={() => navigation.navigate('Budget')} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Çıkış Yap" onPress={handleLogout} color="#dc3545" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    email: {
        fontSize: 16,
        color: '#6c757d',
        marginBottom: 40,
    },
    buttonWrapper: {
        width: '80%',
        marginVertical: 10,
    }
});

export default ProfileScreen;