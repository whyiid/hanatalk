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
    { ko: '통역 가능하세요?', romaja: 'tongyeok ganeunghaseyo?', id: 'Bisa menerjemahkan?', category: 'clinic-staff', tier: 'intermediate', type: 'sentence' }
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
