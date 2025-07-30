import { FC } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAuthViewModel } from './useAuthViewModel';
import { AppRootState } from '../../../core/redux/store';
import { AppNavigationProp } from '../../navigation/types';

const LoginScreen: FC = () => {
    const { email, setEmail, password, setPassword, handleLogin } = useAuthViewModel();
    const { isLoading, error } = useSelector((state: AppRootState) => state.auth);
    const navigation = useNavigation<AppNavigationProp>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giriş Yap</Text>
            <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor={'black'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor={'black'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {isLoading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Giriş Yap" onPress={handleLogin} />
            )}
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.button}>
                <Button title="Hesabın yok mu? Kayıt Ol" onPress={() => navigation.navigate('SignUp')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, color: 'black' },
    error: { color: 'red', textAlign: 'center', marginVertical: 10 },
    button: { marginTop: 20 }
});

export default LoginScreen;