import { FC, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAuthViewModel } from './useAuthViewModel';
import { AppRootState } from '../../../core/redux/store';
import { AppNavigationProp } from '../../navigation/types';
import Icon from '../../components/Icon';

const SignUpScreen: FC = () => {
  const { handleSignUp } = useAuthViewModel();
  const { isLoading, error } = useSelector((state: AppRootState) => state.auth);
  const navigation = useNavigation<AppNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validation states
  const [emailError, setEmailError] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasNumber: /\d/.test(pwd),
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasPunctuation: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };
  };

  const passwordValidation = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidation).every(v => v);
  const passwordsMatch = confirmPassword === password && confirmPassword.length > 0;

  // Email validation effect
  useEffect(() => {
    if (email.length > 0) {
      setEmailError(!isValidEmail(email));
    } else {
      setEmailError(false);
    }
  }, [email]);

  const handleSignUpPress = () => {
    if (isPasswordValid && passwordsMatch && isValidEmail(email) && agreedToTerms) {
      handleSignUp();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1F1A" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Icon name="ArrowLeft" color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>E-posta Adresi</Text>
            <TextInput
              style={[styles.input, emailError && styles.inputError]}
              placeholder="E-posta adresinizi girin"
              placeholderTextColor="#4A5F56"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {emailError && (
              <Text style={styles.emailError}>E-posta formatı geçerli değil</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Şifre</Text>
            <View style={[
              styles.passwordContainer,
              passwordTouched && !isPasswordValid && styles.inputError
            ]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="En az 8 karakter"
                placeholderTextColor="#4A5F56"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (!passwordTouched && text.length > 0) {
                    setPasswordTouched(true);
                  }
                }}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <View style={styles.iconContainer}>
                {passwordTouched && password.length > 0 && (
                  <View style={styles.validationIcon}>
                    {isPasswordValid ? (
                      <Icon name="Check" color="#00FF9D" size={20} />
                    ) : (
                      <Icon name="X" color="#FF6B6B" size={20} />
                    )}
                  </View>
                )}
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

            {/* Password Requirements */}
            {passwordTouched && !isPasswordValid && (
              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementError}>Bu format uyumlu değil</Text>
                <Text style={[styles.requirement, passwordValidation.minLength && styles.requirementMet]}>
                  • En az 8 karakter
                </Text>
                <Text style={[styles.requirement, passwordValidation.hasNumber && styles.requirementMet]}>
                  • En az bir rakam
                </Text>
                <Text style={[styles.requirement, passwordValidation.hasUpperCase && styles.requirementMet]}>
                  • En az bir büyük harf
                </Text>
                <Text style={[styles.requirement, passwordValidation.hasLowerCase && styles.requirementMet]}>
                  • En az bir küçük harf
                </Text>
                <Text style={[styles.requirement, passwordValidation.hasPunctuation && styles.requirementMet]}>
                  • En az bir noktalama işareti
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Şifreyi Onayla</Text>
            <View style={[
              styles.passwordContainer,
              confirmPasswordTouched && !passwordsMatch && styles.inputError
            ]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor="#4A5F56"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (!confirmPasswordTouched && text.length > 0) {
                    setConfirmPasswordTouched(true);
                  }
                }}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <Icon
                  name={showConfirmPassword ? "Eye" : "EyeOff"}
                  color="#4A5F56"
                  size={20}
                />
              </TouchableOpacity>
            </View>

            {/* Password Mismatch Error */}
            {confirmPasswordTouched && !passwordsMatch && confirmPassword.length > 0 && (
              <Text style={styles.passwordMismatchError}>
                Bu şifreler aynı değil
              </Text>
            )}
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            disabled={isLoading}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Icon name="Check" color="#0F1F1A" size={16} />}
            </View>
            <Text style={styles.termsText}>
              <Text style={styles.termsLink}>Hizmet Şartları</Text>
              {' ve '}
              <Text style={styles.termsLink}>Gizlilik Politikası</Text>
              'nı okudum, kabul ediyorum.
            </Text>
          </TouchableOpacity>

          {/* Error Message */}
          {error && <Text style={styles.error}>{error}</Text>}

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              (isLoading || !agreedToTerms || !isPasswordValid || !passwordsMatch || emailError) && styles.disabledButton
            ]}
            onPress={handleSignUpPress}
            disabled={isLoading || !agreedToTerms || !isPasswordValid || !passwordsMatch || emailError}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#0F1F1A" />
            ) : (
              <Text style={styles.signUpButtonText}>Hesap Oluştur</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Zaten bir hesabın var mı? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={[styles.loginLink, isLoading && styles.disabledText]}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F1F1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#0F1F1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validationIcon: {
    paddingHorizontal: 8,
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  emailError: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 8,
    paddingLeft: 4,
  },
  passwordRequirements: {
    marginTop: 8,
    paddingLeft: 4,
  },
  requirementError: {
    color: '#FF6B6B',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  requirement: {
    color: '#7A8F85',
    fontSize: 12,
    marginBottom: 2,
  },
  requirementMet: {
    color: '#00FF9D',
  },
  passwordMismatchError: {
    color: '#FF6B6B',
    fontSize: 13,
    marginTop: 8,
    paddingLeft: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#2A3F37',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#00FF9D',
    borderColor: '#00FF9D',
  },
  termsText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 20,
  },
  termsLink: {
    color: '#00FF9D',
    fontWeight: '500',
  },
  error: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  signUpButton: {
    height: 56,
    backgroundColor: '#00FF9D',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpButtonText: {
    color: '#0F1F1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#7A8F85',
    fontSize: 14,
  },
  loginLink: {
    color: '#00FF9D',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledText: {
    opacity: 0.5,
  },
});

export default SignUpScreen;
