import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAuthViewModel } from './useAuthViewModel';
import { AppRootState } from '../../../core/redux/store';
import { AppNavigationProp } from '../../navigation/types';
import { FC } from 'react';



const SignUpScreen: FC = () => {
  const { email, setEmail, password, setPassword, handleSignUp } = useAuthViewModel();
  const { isLoading, error } = useSelector((state: AppRootState) => state.auth);
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Kayıt Ol" onPress={handleSignUp} />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.switchButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Zaten hesabın var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#343a40' },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: { color: '#dc3545', textAlign: 'center', marginVertical: 10 },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
  },
});

// SignUpScreen'i de dışa aktarmayı unutmayın.
export default SignUpScreen ;
