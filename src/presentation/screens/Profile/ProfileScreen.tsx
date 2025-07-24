import {FC} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useProfileViewModel } from './useProfileViewModel';

const ProfileScreen: FC = () => {
  const { user, handleLogout } = useProfileViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      {user && <Text style={styles.email}>Giriş Yapan Kullanıcı: {user.email}</Text>}
      <Button title="Çıkış Yap" onPress={handleLogout} color="#dc3545" />
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
});

export default ProfileScreen;