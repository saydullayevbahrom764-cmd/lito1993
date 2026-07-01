# OSONTOP – Dynamic Category Form Specification

## Maqsad
Mahsulot yoki xizmat qo'shish oynasi oddiy forma bo'lmaydi.
Foydalanuvchi qaysi kategoriyani tanlasa, forma avtomatik ravishda o'sha kategoriya uchun mos maydonlarni ko'rsatadi.

---

## Kategoriyalar va maydonlari

### 1. 🍕 Oziq-ovqat
- Mahsulot nomi *
- Kategoriya (Meva, Sabzavot, Go'sht, Sut, Ichimlik, Non...) *
- Narx *
- O'lchov birligi (kg, dona, litr) *
- Yaroqlilik muddati *
- Ishlab chiqarilgan sana (ixtiyoriy)
- Tavsif
- Rasmlar
- Xarita, Telefon, Telegram

### 2. 👕 Kiyim-kechak
- Mahsulot nomi *, Brend, Jins (Erkak/Ayol/Bolalar) *
- Kategoriya (Ko'ylak, Shim, Oyoq kiyim...) *
- Rang, O'lcham (XS-XXL) *, Material
- Narx *, Rasmlar, Tavsif, Xarita

### 3. 📱 Elektronika
- Mahsulot nomi *, Brend *, Model *
- Holati (Yangi/Ishlatilgan) *
- Xotira, Kafolat (ha/yo'q)
- Narx *, Rasmlar, Tavsif, Xarita

### 4. 💄 Go'zallik
- Xizmat nomi *, Salon turi
- Xizmat turi (Soch, Tirnoq, Kosmetologiya, Massaj...) *
- Narx *, Davomiyligi, Ish vaqti
- Rasmlar, Xarita

### 5. ☕ Restoran/Kafe
- Restoran nomi *, Oshxona turi *
- Taomlar ro'yxati, Menyu rasmlari
- O'rtacha narx *, Ish vaqti *
- Yetkazib berish (ha/yo'q), Stol bron
- Xarita

### 6. 🏠 Uy-ro'zg'or
- Mahsulot nomi *, Kategoriya (Mebel, Idish, Texnika...) *
- Material, Holati (Yangi/Ishlatilgan)
- Narx *, Rasmlar, Tavsif, Xarita

### 7. ⚽ Sport
- Mahsulot nomi *, Sport turi *, Brend
- O'lcham, Narx *, Rasmlar, Tavsif, Xarita

### 8. 🛠️ Xizmatlar
- Xizmat nomi *, Xizmat turi *
- Tajriba (yil), Xizmat hududi
- Uyga boradimi (ha/yo'q)
- Narx *, Ish vaqti, Rasmlar, Xarita

### 9. 🚗 Avto servis (Ko'p bosqichli)
**Qadam 1:** Avtomobil markasi (Chevrolet, Kia, Hyundai, Toyota, BMW, Mercedes, Audi, VW, Nissan, Honda, BYD, Chery, Haval, Tesla, Boshqa)
**Qadam 2:** Model (brendga bog'liq)
- Chevrolet: Cobalt, Nexia, Gentra, Spark, Malibu, Tracker, Equinox, Onix, Damas, Labo
- Toyota: Camry, Corolla, Land Cruiser, RAV4, Prius, Yaris, Hilux
- Hyundai: Accent, Elantra, Sonata, Tucson, Santa Fe, Creta, i30
- Kia: Rio, Cerato, Sportage, Sorento, Optima, Picanto, Stinger
- BMW: 3-Series, 5-Series, 7-Series, X3, X5, X6, M3, M5
- Mercedes: C-Class, E-Class, S-Class, GLC, GLE, G-Class, A-Class
- Boshqa brendlar uchun: text input
**Qadam 3:** Xizmat turi (Dvigatel, Xodovoy, Elektrik, Diagnostika, Kompyuter diagnostika, Moy almashtirish, Tormoz, Transmissiya, Avtomat karobka, Mexanik karobka, Sovutish, Konditsioner, Gaz(LPG/CNG), Kuzov, Bo'yash, Payvandlash, Shina, Balansirovka, Disk ta'miri, Akkumulyator, Starter, Generator, Signalizatsiya, Multimedia, Faralar, Egzoz, Yoqilg'i tizimi, Osma tizim, Rul boshqaruvi, Boshqa)
**Qadam 4:** Narx
**Qadam 5:** Ish davomiyligi
**Qadam 6:** Qo'shimcha izoh
**Qadam 7:** Servis rasmlari
**Qadam 8:** Google Maps joylashuv

### 10. 💊 Dorixona
- Dori nomi *, Retsept talab (ha/yo'q)
- Ishlab chiqaruvchi, Narx *, Mavjud soni
- 24 soat (ha/yo'q), Yetkazib berish
- Xarita

### 11. 📚 Ta'lim
- O'quv markazi nomi *, Yo'nalish *, Kurs nomi *
- O'qituvchi, Davomiyligi *, Narx *
- Boshlanish sanasi, Xarita

### 12. 🏨 Mehmonxona
- Mehmonxona nomi *, Xona turi *
- Narx *, Necha kishilik
- Nonushta (ha/yo'q), Wi-Fi, Avtoturargoh
- Rasmlar, Xarita

---

## Google Maps talablari (barcha kategoriyalar)
- GPS orqali hozirgi joylashuvni olish
- Xaritada pin qo'yish (drag & drop)
- Manzil qidirish (search)
- Latitude/Longitude avtomatik saqlash

## Texnik talablar
- Forma tanlangan kategoriyaga qarab dinamik o'zgaradi
- Majburiy (*) va ixtiyoriy maydonlar belgilanadi
- Brend → Model bog'liqligi ishlaydi
- Konfiguratsiya asosida kengaytiriladigan arxitektura
- Yagona database struktura (barcha kategoriyalar uchun)
