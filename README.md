# MotoRoute Platform Web App v0.1

Bu paket, Supabase üzerinde kurulan MotoRoute DB ile çalışan ilk Next.js frontend demosudur.

## İçerik

- Next.js App Router
- Supabase client bağlantısı
- Login / Register
- Ana sayfa
- Araç katalog arama
- Marka listesi ve marka detay sayfası
- Araç detay sayfası
- Genel arama
- Parça arama
- Tamirci / parçacı arama
- Profil giriş kontrolü

## Gerekli Supabase ayarları

Supabase Dashboard → Project Settings → API bölümünden:

- Project URL
- anon public key

alınır.

`.env.local.example` dosyasını `.env.local` olarak kopyalayıp doldurun:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

Service role key frontend tarafına asla koyulmaz.

## Local çalıştırma

```bash
npm install
npm run dev
```

Tarayıcı:

```text
http://localhost:3000
```

## Vercel deployment

Şirket bilgisayarında local kurulum yapılamıyorsa:

1. Bu klasörü GitHub reposuna yükleyin.
2. Vercel → New Project → GitHub reposunu seçin.
3. Environment Variables bölümüne şunları ekleyin:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy edin.

## Not

Bu paket `service_role` kullanmaz. Tüm veri erişimi Supabase RLS ve public view/function izinleri üzerinden yapılır.
