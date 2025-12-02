import { FC, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    FlatList,
    ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppNavigationProp } from '../../navigation/types';
import Icon from '../../components/Icon';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    icon: 'Receipt' | 'Sparkles' | 'TrendingUp' | 'Smartphone';
    features?: { icon: 'Camera' | 'Sparkles' | 'ChartPie'; title: string; description: string }[];
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Makbuzlarınızı Dijitalleştirin',
        description: 'Fiş ve faturalarınızın fotoğrafını çekin, gerisini yapay zekaya bırakın. Tarih ve tutar gibi bilgiler otomatik olarak listelensin.',
        icon: 'Receipt',
    },
    {
        id: '2',
        title: 'Makbuz Yönetimi Artık Çok Kolay',
        description: 'Harcamalarınızı akıllıca takip edin',
        icon: 'Sparkles',
        features: [
            {
                icon: 'Camera',
                title: 'Hızlı Makbuz Tarama',
                description: 'Kameranızla makbuzlarınızın fotoğrafını çekin, gerisini bize bırakın.',
            },
            {
                icon: 'Sparkles',
                title: 'Akıllı Veri Çıkarımı',
                description: 'Yapay zeka teknolojisi, tarih ve tutar gibi bilgileri otomatik olarak ayıklar.',
            },
            {
                icon: 'ChartPie',
                title: 'Harcamaları Yönet',
                description: 'Tüm harcamalarınızı tek bir yerden görüntüleyin ve analiz edin.',
            },
        ],
    },
    {
        id: '3',
        title: 'Harcamalarını Kolayca Takip Et',
        description: 'Yapay zeka, makbuzlarındaki harcaları otomatik olarak analiz eder ve senin için anlamlı kategorilere ayırır.',
        icon: 'TrendingUp',
    },
    {
        id: '4',
        title: 'Harcamalarını Kontrol Altına Almaya Hazır Mısın?',
        description: 'Makbuzlarını saniyeler içinde tara, yapay zeka ile analiz edelim ve harcamalarını senin için düzenleyelim.',
        icon: 'Smartphone',
    },
];

const OnboardingScreen: FC = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        navigation.navigate('Login');
    };

    const handleGetStarted = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        navigation.navigate('SignUp');
    };

    const handleLogin = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        navigation.navigate('Login');
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
        if (index === 1) {
            // Second slide with features
            return (
                <View style={styles.slide}>
                    <View style={styles.slideContent}>
                        <View style={styles.featuresContentContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.description}</Text>

                            <View style={styles.featuresContainer}>
                                {item.features?.map((feature, idx) => (
                                    <View key={idx} style={styles.featureCard}>
                                        <View style={styles.featureIconContainer}>
                                            <Icon name={feature.icon} color="#FFFFFF" size={24} />
                                        </View>
                                        <View style={styles.featureTextContainer}>
                                            <Text style={styles.featureTitle}>{feature.title}</Text>
                                            <Text style={styles.featureDescription}>{feature.description}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        // Other slides with image placeholder
        return (
            <View style={styles.slide}>
                <View style={styles.slideContent}>
                    <View style={styles.imageContainer}>
                        <View style={styles.imagePlaceholder}>
                            <Icon name={item.icon} color="#00FF9D" size={120} />
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                </View>
            </View>
        );
    };

    const isLastSlide = currentIndex === slides.length - 1;
    const isFirstSlide = currentIndex === 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0F1F1A" />
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    renderItem={renderSlide}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                />

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {isLastSlide ? (
                        <>
                            <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
                                <Text style={styles.primaryButtonText}>Hesap Oluştur</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handleLogin}>
                                <Text style={styles.secondaryButtonText}>Giriş Yap</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSkip}>
                                <Text style={styles.skipText}>Misafir Olarak Devam Et</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {isFirstSlide && (
                                <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                                    <Text style={styles.primaryButtonText}>Başla</Text>
                                </TouchableOpacity>
                            )}
                            {!isFirstSlide && (
                                <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                                    <Text style={styles.primaryButtonText}>Devam Et</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
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
        backgroundColor: '#0F1F1A',
    },
    slide: {
        width: width,
        flex: 1,
        paddingHorizontal: 20,
    },
    slideContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    imagePlaceholder: {
        width: 180,
        height: 180,
        backgroundColor: '#1A3A2E',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
    },
    featuresContentContainer: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 14,
        color: '#7A8F85',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    description: {
        fontSize: 14,
        color: '#7A8F85',
        textAlign: 'center',
        lineHeight: 20,
    },
    featuresContainer: {
        gap: 12,
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: '#1A3A2E',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1.5,
        borderColor: '#2A3F37',
    },
    featureIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#0F1F1A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    featureDescription: {
        fontSize: 12,
        color: '#7A8F85',
        lineHeight: 16,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#00FF9D',
        width: 24,
    },
    inactiveDot: {
        backgroundColor: '#2A3F37',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    primaryButton: {
        height: 48,
        backgroundColor: '#00FF9D',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#0F1F1A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        height: 48,
        backgroundColor: 'transparent',
        borderColor: '#2A3F37',
        borderWidth: 1.5,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    secondaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    skipText: {
        color: '#7A8F85',
        fontSize: 14,
        textAlign: 'center',
    },
    skipButton: {
        marginBottom: 16,
    },
    skipButtonText: {
        color: '#7A8F85',
        fontSize: 14,
        textAlign: 'center',
    },
    continueButton: {
        height: 48,
        backgroundColor: '#00FF9D',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#0F1F1A',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
