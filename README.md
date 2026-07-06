# 하나 HanaTalk — Belajar Korea

Aplikasi belajar bahasa Korea untuk kerja klinik PPSCC + kehidupan sehari-hari di Korea.
Dibuat untuk **dr. Febriani Sari (Febri)**. Tanpa app store, tanpa login, offline setelah
kunjungan pertama.

## Cara pakai
Buka `https://<username>.github.io/hanatalk/` di Chrome (Android) → menu ⋮ → "Add to Home
screen" → install seperti app biasa.

## 3 layar
- 📚 **Daily Drill** — sesi flashcard harian (Listen & Choose / Recall / Speak & Check),
  10 kartu per sesi (bisa diubah di Settings).
- 📋 **Phrasebook** — semua frasa, selalu terbuka penuh, tanpa gating — untuk lookup
  real-time saat kerja.
- ⚙️ **Settings** — streak, level, badge, dan filter tier (Beginner/Intermediate/Advanced).

## Menambah konten
Semua frasa ada di satu file: `data.js`. Tambah entry baru dengan format yang sama
(`ko`, `romaja`, `id`, `category`, `tier`, `type`), lalu jalankan ulang:
```bash
node tools/gen-audio.js
```
dan naikkan nomor cache di `sw.js` (`const CACHE = 'hanatalk-v1'` → `v2`, dst) supaya
klip audio lama tidak ke-cache.

## Under the hood
- Vanilla HTML/CSS/JS, tanpa framework, tanpa build step.
- Audio: klip MP3 pre-rendered (Google TTS, suara Korea) di `audio/`, dengan Web Speech
  synthesis sebagai fallback kalau klip belum ada.
- Speak & Check pakai Web Speech API (`ko-KR`) — butuh HTTPS, makanya di-host di GitHub
  Pages (bukan `http-server` lokal seperti MandoQuest, yang menyebabkan mic sering tidak
  terdeteksi). Kalau tidak didukung device/browser, otomatis fallback ke mode
  "tap ✅ untuk konfirmasi sendiri".
- Progress (XP, streak, badge, tier) disimpan di `localStorage` — 1 device, tanpa akun.

## Reset progress
Di browser console:
```js
localStorage.removeItem('hanatalk.v1'); location.reload();
```
