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
    { ko: '도와주세요', romaja: 'dowajuseyo', id: 'Tolong!', category: 'daily-emergency', tier: 'beginner', type: 'phrase' }
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
