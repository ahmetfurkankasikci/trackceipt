// Bu dosyayı projenizin kök dizinine veya src/ klasörüne ekleyin.
// Adı `env.d.ts` veya `declarations.d.ts` olabilir.

declare module '@env' {
  export const GEMINI_API_KEY: string;

  // Gelecekte .env dosyanıza ekleyeceğiniz diğer değişkenleri
  // de buraya aynı şekilde ekleyebilirsiniz.
  // export const ANOTHER_API_KEY: string;
}