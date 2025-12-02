import { FC, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../components/Icon';
import { useReceiptAnalysisLoadingViewModel } from './useReceiptAnalysisLoadingViewModel';

const ReceiptAnalysisLoadingScreen: FC = () => {
    const insets = useSafeAreaInsets();
    const { handleCancel, error, handleRetry } = useReceiptAnalysisLoadingViewModel();

    // Rotation animation
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Create infinite rotation animation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();
    }, [rotateAnim]);

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (error) {
        return (
            <View style={styles.container}>
                {/* Header with Back Button - HIDDEN as per request */}
                <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                    {/* <Pressable onPress={handleRetry} style={styles.backButton}>
                        <Icon name="ArrowLeft" size={24} color="#FFFFFF" />
                    </Pressable> */}
                    <View style={{ flex: 1 }} />
                    <Text style={styles.headerTitle}>İşlem Sonucu</Text>
                    <View style={{ flex: 1 }} />
                </View>

                <View style={styles.content}>
                    <View style={styles.errorIconCircle}>
                        <Icon name="CircleAlert" size={60} color="#FFFFFF" />
                    </View>
                    <Text style={styles.errorHeading}>Analiz Başarısız Oldu</Text>
                    <Text style={styles.errorSubtitle}>
                        Görüntü kalitesi düşük. Lütfen daha net bir fotoğraf çekip tekrar deneyin.
                    </Text>
                </View>

                <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 24 }]}>
                    <Pressable onPress={handleRetry} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Main Content */}
            <View style={styles.content}>
                {/* Rotating Circle with Icon */}
                <Animated.View
                    style={[
                        styles.iconCircle,
                        {
                            transform: [{ rotate }],
                        },
                    ]}
                >
                    <Icon name="Receipt" size={80} color="#00FF94" />
                </Animated.View>

                {/* Text Content */}
                <View style={styles.textContent}>
                    <Text style={styles.mainHeading}>Makbuzunuz Analiz Ediliyor...</Text>
                    <Text style={styles.subtitle}>
                        Bu işlem genellikle birkaç saniye sürer.
                    </Text>
                </View>
            </View>

            {/* Cancel Button */}
            <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 24 }]}>
                <Pressable onPress={handleCancel} style={styles.cancelButton}>
                    <Icon name="X" size={20} color="#FFFFFF" />
                    <Text style={styles.cancelButtonText}>İptal Et</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A2F2F',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
        borderWidth: 3,
        borderColor: '#00FF94',
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
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    // Error Styles
    errorIconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#EF4444', // Red color
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 4,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    errorHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    errorSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default ReceiptAnalysisLoadingScreen;
