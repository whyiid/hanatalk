const HanaTalkPhrasebook = (function () {
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function filterEntries(allEntries, { query, tier } = {}) {
    const q = (query || '').trim().toLowerCase();
    return allEntries.filter(e => {
      const matchesTier = !tier || tier === 'all' || e.tier === tier;
      const matchesQuery = !q || [e.ko, e.romaja, e.id].some(f => f.toLowerCase().includes(q));
      return matchesTier && matchesQuery;
    });
  }

  function init() {
    const root = document.getElementById('screen-phrasebook');
    root.innerHTML = `
      <input type="search" id="pb-search" placeholder="Cari frasa...">
      <div class="tier-chips">
        ${['all', 'beginner', 'intermediate', 'advanced'].map(t => `<button class="chip${t === 'all' ? ' active' : ''}" data-tier="${t}">${t}</button>`).join('')}
        <button id="pb-speed-toggle" class="chip">🐢 Pelan</button>
      </div>
      <div id="pb-list"></div>
    `;
    let currentTier = 'all';
    let slowMode = false; // spec §6 playback speed toggle — applies to all 🔊 taps on this screen

    function render() {
      const list = filterEntries(HanaTalkData.ENTRIES, { query: root.querySelector('#pb-search').value, tier: currentTier });
      const byCategory = HanaTalkData.CATEGORIES
        .map(cat => ({ cat, entries: list.filter(e => e.category === cat.id) }))
        .filter(g => g.entries.length > 0);
      root.querySelector('#pb-list').innerHTML = byCategory.map(g => `
        <h3>${esc(g.cat.name)}</h3>
        ${g.entries.map(e => `
          <div class="phrase-row">
            <div class="phrase-text"><strong>${esc(e.ko)}</strong> <span class="romaja">${esc(e.romaja)}</span><br><span class="tier-badge">${esc(e.tier)}</span> ${esc(e.id)}</div>
            <button class="play-btn" data-ko="${esc(e.ko)}">🔊</button>
            <button class="practice-btn" data-ko="${esc(e.ko)}">🎤</button>
          </div>
        `).join('')}
      `).join('') || '<p>Tidak ada hasil.</p>';

      root.querySelectorAll('.play-btn').forEach(b => b.addEventListener('click', () => HanaTalkAudio.play(b.dataset.ko, { slow: slowMode })));
      root.querySelectorAll('.practice-btn').forEach(b => b.addEventListener('click', () => {
        b.textContent = '🎤...';
        HanaTalkAudio.listenOnce(() => { b.textContent = '🎤'; }, () => { b.textContent = '🎤'; });
      }));
    }

    root.querySelector('#pb-search').addEventListener('input', render);
    // Scoped to [data-tier] specifically — #pb-speed-toggle also has class="chip" for visual
    // consistency but must NOT be swept into tier-filtering logic.
    root.querySelectorAll('.tier-chips .chip[data-tier]').forEach(chip => chip.addEventListener('click', () => {
      currentTier = chip.dataset.tier;
      root.querySelectorAll('.tier-chips .chip[data-tier]').forEach(c => c.classList.toggle('active', c === chip));
      render();
    }));
    root.querySelector('#pb-speed-toggle').addEventListener('click', () => {
      slowMode = !slowMode;
      root.querySelector('#pb-speed-toggle').classList.toggle('active', slowMode);
    });
    render();
  }

  return { init, filterEntries };
})();
