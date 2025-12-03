# Trackceipt - Akıllı Fiş ve Masraf Takip Uygulaması

**Trackceipt**, günlük harcamalarınızı kolayca yönetmenizi sağlayan modern bir mobil uygulamadır. Geleneksel fiş okuyucuların ötesine geçerek, Google'ın güçlü Gemini yapay zeka API'si ile fişlerinizi analiz eder, masraflarınızı otomatik olarak anlar ve sizin için kaydeder. Clean Architecture ve en güncel mobil geliştirme prensipleriyle inşa edilmiştir.

---

## ✨ Özellikler

- **Yapay Zeka Destekli Fiş Tarama:** Kameranızla veya galerinizden seçtiğiniz bir fiş fotoğrafını analiz ederek toplam tutar, mağaza adı ve tarihi otomatik olarak ayıklar.
- **Kullanıcı Kimlik Doğrulama:** Firebase Authentication ile güvenli bir şekilde kayıt olun ve giriş yapın. Her kullanıcı sadece kendi verilerine erişebilir.
- **Gerçek Zamanlı Veritabanı:** Tüm masraf, kategori ve bütçe verileri Firestore üzerinde gerçek zamanlı olarak saklanır ve anında senkronize olur.
- **Masraf Yönetimi:**
    - Masrafları listeleme, detaylarını görme.
    - Masrafları düzenleme ve kaydetme.
    - Sola kaydırarak masrafları kolayca silme.
- **Kişiselleştirilebilir Kategoriler:**
    - Kendi harcama kategorilerinizi (Giyim, Fatura, Eğlence vb.) oluşturun.
    - Her kategoriye şık bir renk paletinden dilediğiniz rengi atayın.
    - Kategorileri düzenleyin ve silin.
- **Profil Yönetimi:** Kullanıcı bilgilerinizi görüntüleyin ve güvenli bir şekilde çıkış yapın.

---

## 🛠️ Kullanılan Teknolojiler

Bu proje, ölçeklenebilir ve bakımı kolay bir uygulama oluşturmak için modern teknolojiler ve en iyi pratikler kullanılarak geliştirilmiştir.

- **Platform:** React Native
- **Mimari:** Clean Architecture
- **Durum Yönetimi (State Management):** Redux Toolkit
- **Bağımlılık Enjeksiyonu (Dependency Injection):** Tsyringe
- **Backend Servisleri (BaaS):**
    - **Firebase Authentication:** Kullanıcı girişi ve güvenliği.
    - **Firestore:** Gerçek zamanlı NoSQL veritabanı.
- **Yapay Zeka:** Google Gemini 1.5 Flash API (Fiş analizi için)
- **Navigasyon:** React Navigation
- **UI Kütüphaneleri:**
    - `react-native-swipe-list-view` (Kaydırarak silme)
    - `react-native-wheel-color-picker` (Kategori rengi seçimi)
    - `react-native-date-picker` (Tarih düzenleme)

---

## 🚀 Başlarken

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Ön Gereksinimler

- Node.js (LTS versiyonu önerilir)
- JDK (Java Development Kit)
- Android Studio ve Android SDK
- React Native CLI
- Bir fiziksel cihaz veya emulator

### Kurulum

1.  **Projeyi Klonlayın:**
    ```bash
    git clone [https://github.com/kullanici-adiniz/proje-adiniz.git](https://github.com/kullanici-adiniz/proje-adiniz.git)
    cd proje-adiniz
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

### Firebase Kurulumu

Bu projenin çalışabilmesi için bir Firebase projesine bağlanması gerekmektedir.

1.  [Firebase Konsolu](https://console.firebase.google.com/)'na gidin ve yeni bir proje oluşturun.
2.  Projenize bir **Android** uygulaması ekleyin. `com.trackceipt` paket adını kullanabilirsiniz.
3.  Kurulum adımlarını takip ederek `google-services.json` dosyasını indirin ve projenizin `android/app/` dizinine yerleştirin.
4.  Firebase projenizin **Authentication** bölümüne gidin ve "E-posta/Parola" ile girişi etkinleştirin.
5.  Firebase projenizin **Firestore Database** bölümüne gidin ve test modunda bir veritabanı oluşturun.
6.  Firestore **Kurallar (Rules)** sekmesini aşağıdaki gibi güncelleyin:
    ```
    rules_version = '2';

    service cloud.firestore {
      match /databases/{database}/documents {

        match /expenses/{expenseId} {
      
          allow read, update, delete: if request.auth.uid == resource.data.userId;
      
          allow create: if request.auth.uid == request.resource.data.userId;
        }
        match /categories/{categoryId} {
    
          allow read, update, delete: if request.auth.uid == resource.data.userId;
      
          allow create: if request.auth.uid == request.resource.data.userId;
      
      }
    
      }
    }
    ```

### Gemini API Kurulumu

1.  [Google AI Studio](https://aistudio.google.com/)'ya gidin ve bir API anahtarı oluşturun.
2.  Projenizin kök dizininde `.env` adında bir dosya oluşturun.
3.  Oluşturduğunuz API anahtarını bu dosyanın içine aşağıdaki gibi ekleyin:
    ```
    GEMINI_API_KEY=BURAYA_API_ANAHTARINIZI_YAPISTIRIN
    ```

### Uygulamayı Çalıştırma

1.  **Metro Sunucusunu Başlatın:**
    ```bash
    npm start -- --reset-cache
    ```

2.  **Uygulamayı Android Cihazında Çalıştırın:** (Yeni bir terminalde)
    ```bash
    npx react-native run-android
    ```
