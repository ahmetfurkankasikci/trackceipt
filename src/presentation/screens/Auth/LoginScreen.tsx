import { FC, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAuthViewModel } from './useAuthViewModel';
import { AppRootState } from '../../../core/redux/store';
import { AppNavigationProp } from '../../navigation/types';
import Icon from '../../components/Icon';

const LoginScreen: FC = () => {
    const { email, setEmail, password, setPassword, handleLogin } = useAuthViewModel();
    const { isLoading, error } = useSelector((state: AppRootState) => state.auth);
    const navigation = useNavigation<AppNavigationProp>();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0F1F1A" />
            <View style={styles.container}>
                {/* Title */}
                <Text style={styles.title}>Giriş Yap</Text>

                {/* Email Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>E-posta veya Kullanıcı Adı</Text>
                    <TextInput
                        style={[styles.input, error && styles.inputError]}
                        placeholder="E-postanızı veya kullanıcı adınızı girin"
                        placeholderTextColor="#4A5F56"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                </View>

                {/* Password Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Şifre</Text>
                    <View style={[styles.passwordContainer, error && styles.inputError]}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Şifrenizi girin"
                            placeholderTextColor="#4A5F56"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.eyeIcon}
                            disabled={isLoading}
                        >
                            <Icon
                                name={showPassword ? "Eye" : "EyeOff"}
                                color="#4A5F56"
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                    style={styles.forgotPassword}
                    disabled={isLoading}
                >
                    <Text style={[styles.forgotPasswordText, isLoading && styles.disabledText]}>Şifremi Unuttum?</Text>
                </TouchableOpacity>

                {/* Error Message */}
                {error && <Text style={styles.error}>{error}</Text>}

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#0F1F1A" />
                    ) : (
                        <Text style={styles.loginButtonText}>Giriş Yap</Text>
                    )}
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>veya</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Google Sign In */}
                <TouchableOpacity
                    style={[styles.socialButton, isLoading && styles.disabledButton]}
                    disabled={isLoading}
                >
                    <View style={styles.socialButtonContent}>
                        <View style={styles.googleIcon}>
                            <Text style={styles.googleIconText}>G</Text>
                        </View>
                        <Text style={[styles.socialButtonText, isLoading && styles.disabledText]}>Google ile Giriş Yap</Text>
                    </View>
                </TouchableOpacity>

                {/* Apple Sign In */}
                <TouchableOpacity
                    style={[styles.socialButton, isLoading && styles.disabledButton]}
                    disabled={isLoading}
                >
                    <View style={styles.socialButtonContent}>
                        <Icon name="Apple" color={isLoading ? "#4A5F56" : "#FFFFFF"} size={20} />
                        <Text style={[styles.socialButtonText, isLoading && styles.disabledText]}>Apple ile Giriş Yap</Text>
                    </View>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Hesabın yok mu? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUp')}
                        disabled={isLoading}
                    >
                        <Text style={[styles.signUpLink, isLoading && styles.disabledText]}>Kayıt Ol</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F1F1A',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        backgroundColor: '#0F1F1A',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 56,
        backgroundColor: 'transparent',
        borderColor: '#2A3F37',
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderColor: '#2A3F37',
        borderWidth: 1.5,
        borderRadius: 12,
        height: 56,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 15,
    },
    eyeIcon: {
        paddingHorizontal: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#FFFFFF',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    error: {
        color: '#FF6B6B',
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 14,
    },
    loginButton: {
        height: 56,
        backgroundColor: '#00FF9D',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonText: {
        color: '#0F1F1A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2A3F37',
    },
    dividerText: {
        color: '#7A8F85',
        paddingHorizontal: 16,
        fontSize: 14,
    },
    socialButton: {
        height: 56,
        backgroundColor: 'transparent',
        borderColor: '#2A3F37',
        borderWidth: 1.5,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    socialButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    googleIcon: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleIconText: {
        color: '#0F1F1A',
        fontSize: 14,
        fontWeight: 'bold',
    },
    socialButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    signUpText: {
        color: '#7A8F85',
        fontSize: 14,
    },
    signUpLink: {
        color: '#00FF9D',
        fontSize: 14,
        fontWeight: 'bold',
    },
    inputError: {
        borderColor: '#FF6B6B',
        borderWidth: 2,
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledText: {
        opacity: 0.5,
    },
});

export default LoginScreen;