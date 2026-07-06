const HanaTalkSettings = (function () {
  const TIERS = ['beginner', 'intermediate', 'advanced'];
  const BADGE_LABELS = {
    'streak-7': '🔥 7-Day Streak',
    'phrases-50': '🏆 50 Phrases Mastered',
    'clinic-communicator': '🏥 Clinic Communicator'
  };

  function init(state, onStateChange) {
    const root = document.getElementById('screen-settings');
    root.innerHTML = `
      <h2>Progress</h2>
      <p>🔥 Streak: <strong>${state.streak}</strong> hari</p>
      <p>⭐ Level <strong>${HanaTalkProgress.calculateLevel(state.xp)}</strong> (${state.xp} XP)</p>
      <div class="badges">${(state.badges || []).map(b => `<span class="badge">${BADGE_LABELS[b] || b}</span>`).join('')}</div>
      <h2>Tier</h2>
      <select id="tier-select">
        ${TIERS.map(t => `<option value="${t}" ${t === state.tier ? 'selected' : ''}>${t}</option>`).join('')}
      </select>
      <h2>Target harian</h2>
      <input type="number" id="daily-goal" min="5" max="30" step="5" value="${state.dailyGoal}">
    `;
    root.querySelector('#tier-select').addEventListener('change', e => {
      state.tier = e.target.value;
      onStateChange(state);
    });
    root.querySelector('#daily-goal').addEventListener('change', e => {
      state.dailyGoal = parseInt(e.target.value, 10) || 10;
      onStateChange(state);
    });
  }

  return { init };
})();
