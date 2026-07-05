const HanaTalkProgress = (function () {
  const STORAGE_KEY = 'hanatalk.v1';
  const XP_PER_TYPE = { listen: 10, recall: 15, speak: 20 };
  const MASTERY_STREAK = 3; // correct answers in a row to count an entry as "mastered"
  const CLINIC_MASTERY_THRESHOLD = 0.8; // 80% — see spec §5, "Clinic Communicator" badge
  const CLINIC_CATEGORIES = ['clinic-greeting', 'clinic-consultation', 'clinic-treatment', 'clinic-procedure', 'clinic-aftercare', 'clinic-payment', 'clinic-staff'];

  function defaultState() {
    return { xp: 0, streak: 0, lastPlayedDate: null, tier: 'beginner', dailyGoal: 10, masteredCount: {}, missedKeys: [], badges: [] };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function calculateLevel(xp) {
    let level = 1, threshold = 0, step = 100;
    while (xp >= threshold + step) { threshold += step; step += 100; level++; }
    return level;
  }

  function addXP(state, exerciseType) {
    state.xp += XP_PER_TYPE[exerciseType] || 10;
    return state;
  }

  function updateStreak(state, todayISO) {
    if (state.lastPlayedDate === todayISO) return state;
    const y = new Date(todayISO);
    y.setDate(y.getDate() - 1);
    const yesterdayISO = y.toISOString().slice(0, 10);
    state.streak = state.lastPlayedDate === yesterdayISO ? state.streak + 1 : 1;
    state.lastPlayedDate = todayISO;
    return state;
  }

  function recordAnswer(state, entry, correct) {
    const key = HanaTalkData.entryKey(entry);
    state.masteredCount[key] = correct ? (state.masteredCount[key] || 0) + 1 : 0;
    if (correct) {
      state.missedKeys = (state.missedKeys || []).filter(k => k !== key);
    } else if (!(state.missedKeys || []).includes(key)) {
      state.missedKeys = (state.missedKeys || []).concat(key);
    }
    return state;
  }

  function checkBadges(state, allEntries) {
    const earned = [];
    const isMastered = e => (state.masteredCount[HanaTalkData.entryKey(e)] || 0) >= MASTERY_STREAK;

    if (state.streak >= 7 && !state.badges.includes('streak-7')) earned.push('streak-7');

    const masteredTotal = allEntries.filter(isMastered).length;
    if (masteredTotal >= 50 && !state.badges.includes('phrases-50')) earned.push('phrases-50');

    const clinicEntries = allEntries.filter(e => CLINIC_CATEGORIES.includes(e.category));
    const clinicRatio = clinicEntries.length ? clinicEntries.filter(isMastered).length / clinicEntries.length : 0;
    if (clinicRatio >= CLINIC_MASTERY_THRESHOLD && !state.badges.includes('clinic-communicator')) {
      earned.push('clinic-communicator');
    }

    state.badges.push(...earned);
    return earned;
  }

  return { defaultState, load, save, calculateLevel, addXP, updateStreak, recordAnswer, checkBadges, MASTERY_STREAK, CLINIC_MASTERY_THRESHOLD };
})();
