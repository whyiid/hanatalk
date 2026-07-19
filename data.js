const HanaTalkData = (function () {
  const CATEGORIES = [
    { id: 'clinic-greeting', domain: 'clinic', name: 'Greeting patients' },
    { id: 'clinic-consultation', domain: 'clinic', name: 'Consultation/complaints' },
    { id: 'clinic-treatment', domain: 'clinic', name: 'Explaining treatments' },
    { id: 'clinic-procedure', domain: 'clinic', name: 'Instructions during procedure' },
    { id: 'clinic-aftercare', domain: 'clinic', name: 'Aftercare & discharge' },
    { id: 'clinic-payment', domain: 'clinic', name: 'Payment/admin' },
    { id: 'clinic-staff', domain: 'clinic', name: 'Talking with Korean staff' },
    { id: 'daily-greeting', domain: 'daily', name: 'Everyday greetings' },
    { id: 'daily-shopping', domain: 'daily', name: 'Shopping & restaurants' },
    { id: 'daily-transport', domain: 'daily', name: 'Transportation' },
    { id: 'daily-emergency', domain: 'daily', name: 'Emergency/personal health' }
  ];

  // Starter set: 4 daily-life categories only (drafted by Claude, per spec §4/§10).
  // The 7 clinic-* categories stay empty until Wahyu supplies source material —
  // adding them later is just appending objects here, no code change needed elsewhere.
  const ENTRIES = [
    { ko: '안녕하세요', romaja: 'annyeonghaseyo', id: 'Halo/selamat pagi-siang-sore (sopan)', category: 'daily-greeting', tier: 'beginner', type: 'phrase' },
    { ko: '감사합니다', romaja: 'gamsahamnida', id: 'Terima kasih', category: 'daily-greeting', tier: 'beginner', type: 'phrase' },
    { ko: '죄송합니다', romaja: 'joesonghamnida', id: 'Maaf/permisi', category: 'daily-greeting', tier: 'beginner', type: 'phrase' },
    { ko: '괜찮아요', romaja: 'gwaenchanayo', id: 'Tidak apa-apa/baik-baik saja', category: 'daily-greeting', tier: 'beginner', type: 'phrase' },
    { ko: '이거 얼마예요?', romaja: 'igeo eolmayeyo?', id: 'Ini berapa harganya?', category: 'daily-shopping', tier: 'beginner', type: 'sentence' },
    { ko: '카드 되나요?', romaja: 'kadeu doenayo?', id: 'Bisa bayar pakai kartu?', category: 'daily-shopping', tier: 'intermediate', type: 'sentence' },
    { ko: '메뉴판 주세요', romaja: 'menyupan juseyo', id: 'Tolong minta menunya', category: 'daily-shopping', tier: 'beginner', type: 'sentence' },
    { ko: '여기서 내려주세요', romaja: 'yeogiseo naeryeojuseyo', id: 'Tolong turunkan saya di sini', category: 'daily-transport', tier: 'intermediate', type: 'sentence' },
    { ko: '지하철역이 어디예요?', romaja: 'jihacheollyeogi eodiyeyo?', id: 'Di mana stasiun kereta bawah tanah?', category: 'daily-transport', tier: 'intermediate', type: 'sentence' },
    { ko: '병원에 가야 해요', romaja: 'byeongwone gaya haeyo', id: 'Saya perlu ke rumah sakit', category: 'daily-emergency', tier: 'intermediate', type: 'sentence' },
    { ko: '도와주세요', romaja: 'dowajuseyo', id: 'Tolong!', category: 'daily-emergency', tier: 'beginner', type: 'phrase' },
    // clinic-* : framing "liaison Korea" — Febri berbicara dengan tim medis Korea (Fase B PPSCC).
    // 2 frasa/kategori sebagai starter; tambah kapan saja dengan append di sini + jalankan tools/gen-audio.js.
    { ko: '안녕하세요, 인도네시아에서 온 닥터 페브리입니다', romaja: 'annyeonghaseyo, indonesiaeseo on dakteo Pebeuri-imnida', id: 'Halo, saya dr. Febri dari Indonesia', category: 'clinic-greeting', tier: 'beginner', type: 'sentence' },
    { ko: '저희 환자를 잘 부탁드립니다', romaja: 'jeohui hwanjareul jal butakdeurimnida', id: 'Mohon bantuannya untuk pasien kami', category: 'clinic-greeting', tier: 'intermediate', type: 'sentence' },
    { ko: '알레르기가 있어요', romaja: 'allereugiga isseoyo', id: 'Ada alergi', category: 'clinic-consultation', tier: 'beginner', type: 'sentence' },
    { ko: '환자가 통증을 느껴요', romaja: 'hwanjaga tongjeungeul neukkyeoyo', id: 'Pasien merasa nyeri', category: 'clinic-consultation', tier: 'intermediate', type: 'sentence' },
    { ko: '회복 기간은 얼마나 되나요?', romaja: 'hoebok giganeun eolmana doenayo?', id: 'Berapa lama masa pemulihannya?', category: 'clinic-treatment', tier: 'intermediate', type: 'sentence' },
    { ko: '붓기는 언제 빠지나요?', romaja: 'butgineun eonje ppajinayo?', id: 'Kapan bengkaknya turun?', category: 'clinic-treatment', tier: 'intermediate', type: 'sentence' },
    { ko: '지금 상태가 어때요?', romaja: 'jigeum sangtaega eottaeyo?', id: 'Bagaimana kondisinya sekarang?', category: 'clinic-procedure', tier: 'beginner', type: 'sentence' },
    { ko: '마취는 잘 됐나요?', romaja: 'machwineun jal dwaennayo?', id: 'Apakah biusnya sudah bekerja?', category: 'clinic-procedure', tier: 'intermediate', type: 'sentence' },
    { ko: '약은 어떻게 먹어요?', romaja: 'yageun eotteoke meogeoyo?', id: 'Obatnya diminum bagaimana?', category: 'clinic-aftercare', tier: 'beginner', type: 'sentence' },
    { ko: '다음 진료는 언제예요?', romaja: 'daeum jillyoneun eonjeyeyo?', id: 'Kapan kontrol berikutnya?', category: 'clinic-aftercare', tier: 'intermediate', type: 'sentence' },
    { ko: '영수증 주세요', romaja: 'yeongsujeung juseyo', id: 'Tolong kwitansinya', category: 'clinic-payment', tier: 'beginner', type: 'sentence' },
    { ko: '진료 기록을 받을 수 있을까요?', romaja: 'jillyo girogeul badeul su isseulkkayo?', id: 'Bisa minta rekam medisnya?', category: 'clinic-payment', tier: 'intermediate', type: 'sentence' },
    { ko: '천천히 말씀해 주세요', romaja: 'cheoncheonhi malsseumhae juseyo', id: 'Tolong bicara pelan-pelan', category: 'clinic-staff', tier: 'beginner', type: 'sentence' },
    { ko: '통역 가능하세요?', romaja: 'tongyeok ganeunghaseyo?', id: 'Bisa menerjemahkan?', category: 'clinic-staff', tier: 'intermediate', type: 'sentence' },
    // --- Perluasan klinik (batch 2) : ~8-9 frasa/kategori, tetap framing "liaison Korea" ---
    // clinic-greeting
    { ko: '처음 뵙겠습니다', romaja: 'cheoeum boepgetseumnida', id: 'Senang bertemu (pertama kali)', category: 'clinic-greeting', tier: 'beginner', type: 'phrase' },
    { ko: '환자와 함께 왔어요', romaja: 'hwanjawa hamkke wasseoyo', id: 'Saya datang bersama pasien', category: 'clinic-greeting', tier: 'beginner', type: 'sentence' },
    { ko: '오늘 일정을 확인하고 싶어요', romaja: 'oneul iljeongeul hwaginhago sipeoyo', id: 'Saya ingin cek jadwal hari ini', category: 'clinic-greeting', tier: 'intermediate', type: 'sentence' },
    { ko: '담당 선생님을 뵐 수 있을까요?', romaja: 'damdang seonsaengnimeul boel su isseulkkayo?', id: 'Bisa bertemu dokter penanggung jawab?', category: 'clinic-greeting', tier: 'intermediate', type: 'sentence' },
    { ko: '시간 내주셔서 감사합니다', romaja: 'sigan naejusyeoseo gamsahamnida', id: 'Terima kasih sudah meluangkan waktu', category: 'clinic-greeting', tier: 'intermediate', type: 'sentence' },
    { ko: '잘 부탁드립니다', romaja: 'jal butakdeurimnida', id: 'Mohon kerja samanya', category: 'clinic-greeting', tier: 'beginner', type: 'phrase' },
    // clinic-consultation
    { ko: '열이 있어요', romaja: 'yeori isseoyo', id: 'Ada demam', category: 'clinic-consultation', tier: 'beginner', type: 'sentence' },
    { ko: '환자가 어지러워해요', romaja: 'hwanjaga eojireowohaeyo', id: 'Pasien merasa pusing', category: 'clinic-consultation', tier: 'intermediate', type: 'sentence' },
    { ko: '이 부위가 부었어요', romaja: 'i buwiga bueosseoyo', id: 'Bagian ini bengkak', category: 'clinic-consultation', tier: 'intermediate', type: 'sentence' },
    { ko: '언제부터 아팠어요?', romaja: 'eonjebuteo apasseoyo?', id: 'Sejak kapan sakitnya?', category: 'clinic-consultation', tier: 'intermediate', type: 'sentence' },
    { ko: '과거 병력이 있어요', romaja: 'gwageo byeongnyeogi isseoyo', id: 'Ada riwayat penyakit', category: 'clinic-consultation', tier: 'advanced', type: 'sentence' },
    { ko: '임신 중이에요', romaja: 'imsin jungieyo', id: 'Sedang hamil', category: 'clinic-consultation', tier: 'beginner', type: 'sentence' },
    // clinic-treatment
    { ko: '이 시술은 어떻게 진행되나요?', romaja: 'i sisureun eotteoke jinhaengdoenayo?', id: 'Tindakan ini prosesnya bagaimana?', category: 'clinic-treatment', tier: 'advanced', type: 'sentence' },
    { ko: '부작용이 있나요?', romaja: 'bujagyongi innayo?', id: 'Ada efek samping?', category: 'clinic-treatment', tier: 'intermediate', type: 'sentence' },
    { ko: '몇 번 받아야 하나요?', romaja: 'myeot beon badaya hanayo?', id: 'Perlu berapa kali tindakan?', category: 'clinic-treatment', tier: 'intermediate', type: 'sentence' },
    { ko: '흉터가 남나요?', romaja: 'hyungteoga namnayo?', id: 'Apakah meninggalkan bekas luka?', category: 'clinic-treatment', tier: 'intermediate', type: 'sentence' },
    { ko: '다른 방법도 있나요?', romaja: 'dareun bangbeopdo innayo?', id: 'Ada metode lain?', category: 'clinic-treatment', tier: 'intermediate', type: 'sentence' },
    { ko: '결과는 언제 나와요?', romaja: 'gyeolgwaneun eonje nawayo?', id: 'Hasilnya kapan keluar?', category: 'clinic-treatment', tier: 'beginner', type: 'sentence' },
    // clinic-procedure
    { ko: '긴장하지 마세요', romaja: 'ginjanghaji maseyo', id: 'Jangan tegang', category: 'clinic-procedure', tier: 'beginner', type: 'sentence' },
    { ko: '조금 아플 수 있어요', romaja: 'jogeum apeul su isseoyo', id: 'Mungkin terasa sedikit sakit', category: 'clinic-procedure', tier: 'intermediate', type: 'sentence' },
    { ko: '숨을 크게 쉬세요', romaja: 'sumeul keuge swiseyo', id: 'Tarik napas panjang', category: 'clinic-procedure', tier: 'intermediate', type: 'sentence' },
    { ko: '움직이지 마세요', romaja: 'umjigiji maseyo', id: 'Jangan bergerak', category: 'clinic-procedure', tier: 'beginner', type: 'sentence' },
    { ko: '거의 다 됐어요', romaja: 'geoui da dwaesseoyo', id: 'Hampir selesai', category: 'clinic-procedure', tier: 'beginner', type: 'phrase' },
    { ko: '불편하면 말씀하세요', romaja: 'bulpyeonhamyeon malsseumhaseyo', id: 'Kalau tidak nyaman, beri tahu', category: 'clinic-procedure', tier: 'intermediate', type: 'sentence' },
    // clinic-aftercare
    { ko: '상처에 물이 닿지 않게 하세요', romaja: 'sangcheoe muri datji anke haseyo', id: 'Jaga luka jangan sampai kena air', category: 'clinic-aftercare', tier: 'advanced', type: 'sentence' },
    { ko: '무리하지 마세요', romaja: 'murihaji maseyo', id: 'Jangan memaksakan diri', category: 'clinic-aftercare', tier: 'beginner', type: 'sentence' },
    { ko: '냉찜질을 하세요', romaja: 'naengjjimjireul haseyo', id: 'Lakukan kompres dingin', category: 'clinic-aftercare', tier: 'intermediate', type: 'sentence' },
    { ko: '실밥은 언제 풀어요?', romaja: 'silbabeun eonje pureoyo?', id: 'Kapan jahitan dibuka?', category: 'clinic-aftercare', tier: 'intermediate', type: 'sentence' },
    { ko: '붓기는 며칠 지나면 가라앉아요', romaja: 'butgineun myeochil jinamyeon garaanjayo', id: 'Bengkak turun setelah beberapa hari', category: 'clinic-aftercare', tier: 'advanced', type: 'sentence' },
    { ko: '문제가 있으면 병원에 연락 주세요', romaja: 'munjega isseumyeon byeongwone yeollak juseyo', id: 'Kalau ada masalah, hubungi klinik', category: 'clinic-aftercare', tier: 'intermediate', type: 'sentence' },
    // clinic-payment
    { ko: '총 비용이 얼마예요?', romaja: 'chong biyongi eolmayeyo?', id: 'Total biayanya berapa?', category: 'clinic-payment', tier: 'beginner', type: 'sentence' },
    { ko: '카드로 결제할게요', romaja: 'kadeuro gyeoljehalgeyo', id: 'Saya bayar pakai kartu', category: 'clinic-payment', tier: 'beginner', type: 'sentence' },
    { ko: '견적서를 받을 수 있을까요?', romaja: 'gyeonjeokseoreul badeul su isseulkkayo?', id: 'Bisa minta surat estimasi biaya?', category: 'clinic-payment', tier: 'advanced', type: 'sentence' },
    { ko: '추가 비용이 있나요?', romaja: 'chuga biyongi innayo?', id: 'Ada biaya tambahan?', category: 'clinic-payment', tier: 'intermediate', type: 'sentence' },
    { ko: '보험 처리가 되나요?', romaja: 'boheom cheoriga doenayo?', id: 'Bisa diproses asuransi?', category: 'clinic-payment', tier: 'intermediate', type: 'sentence' },
    { ko: '분할 납부가 가능한가요?', romaja: 'bunhal nabbuga ganeunghangayo?', id: 'Bisa bayar dengan cicilan?', category: 'clinic-payment', tier: 'advanced', type: 'sentence' },
    // clinic-staff
    { ko: '다시 한번 말씀해 주세요', romaja: 'dasi hanbeon malsseumhae juseyo', id: 'Tolong ulangi sekali lagi', category: 'clinic-staff', tier: 'beginner', type: 'sentence' },
    { ko: '잘 못 들었어요', romaja: 'jal mot deureosseoyo', id: 'Saya kurang jelas mendengarnya', category: 'clinic-staff', tier: 'intermediate', type: 'sentence' },
    { ko: '여기에 적어 주실 수 있어요?', romaja: 'yeogie jeogeo jusil su isseoyo?', id: 'Bisa tuliskan di sini?', category: 'clinic-staff', tier: 'intermediate', type: 'sentence' },
    { ko: '이해했어요', romaja: 'ihaehaesseoyo', id: 'Saya mengerti', category: 'clinic-staff', tier: 'beginner', type: 'phrase' },
    { ko: '연락처를 알 수 있을까요?', romaja: 'yeollakcheoreul al su isseulkkayo?', id: 'Bisa minta nomor kontaknya?', category: 'clinic-staff', tier: 'intermediate', type: 'sentence' },
    { ko: '도와주셔서 감사합니다', romaja: 'dowajusyeoseo gamsahamnida', id: 'Terima kasih atas bantuannya', category: 'clinic-staff', tier: 'beginner', type: 'phrase' }
  ];

  function entryKey(entry) {
    return entry.category + ':' + entry.ko;
  }

  function validateEntry(entry) {
    const VALID_TIERS = ['beginner', 'intermediate', 'advanced'];
    const VALID_TYPES = ['word', 'phrase', 'sentence'];
    const errors = [];
    if (!entry.ko) errors.push('missing ko');
    if (!entry.romaja) errors.push('missing romaja');
    if (!entry.id) errors.push('missing id');
    if (!CATEGORIES.some(c => c.id === entry.category)) errors.push(`unknown category "${entry.category}"`);
    if (!VALID_TIERS.includes(entry.tier)) errors.push(`invalid tier "${entry.tier}"`);
    if (!VALID_TYPES.includes(entry.type)) errors.push(`invalid type "${entry.type}"`);
    return errors;
  }

  return { CATEGORIES, ENTRIES, entryKey, validateEntry };
})();
