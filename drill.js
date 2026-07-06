const HanaTalkDrill = (function () {
  const EXERCISE_TYPES = ['listen', 'recall', 'speak'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function buildSessionQueue(allEntries, tier, sessionSize, missedKeys) {
    const pool = allEntries.filter(e => e.tier === tier);
    if (pool.length === 0) return [];
    const isMissed = e => missedKeys.includes(HanaTalkData.entryKey(e));
    const missedPool = pool.filter(isMissed);
    const restPool = shuffle(pool.filter(e => !isMissed(e)));
    return missedPool.concat(restPool).slice(0, sessionSize)
      .map(entry => ({ entry, exerciseType: EXERCISE_TYPES[Math.floor(Math.random() * EXERCISE_TYPES.length)] }));
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function pickDistractors(correct, pool, count, field) {
    const others = shuffle(pool.filter(e => e[field] !== correct[field]));
    return others.slice(0, count).map(e => e[field]);
  }

  function checkSpeechMatch(alternatives, targetKo) {
    const norm = s => s.replace(/[\s.,!?]/g, '');
    const target = norm(targetKo);
    return alternatives.some(a => norm(a) === target || norm(a).includes(target));
  }

  let session = null;

  function init(state, onStateChange) {
    const root = document.getElementById('screen-drill');
    session = {
      queue: buildSessionQueue(HanaTalkData.ENTRIES, state.tier, state.dailyGoal, state.missedKeys || []),
      index: 0,
      state,
      onStateChange,
      slow: false, // spec §6 playback speed toggle — resets to normal each new session
      locked: false
    };
    renderCard(root);
  }

  function renderCard(root) {
    session.locked = false;
    if (!session.queue.length) {
      root.innerHTML = `<h2>Belum ada konten</h2><p>Tidak ada frasa untuk tier "${esc(session.state.tier)}" ini.</p>`;
      return;
    }
    if (session.index >= session.queue.length) {
      root.innerHTML = `<h2>Selesai! 🎉</h2><p>Sesi hari ini beres.</p>`;
      return;
    }
    const { entry, exerciseType } = session.queue[session.index];
    const pool = HanaTalkData.ENTRIES.filter(e => e.tier === session.state.tier);
    root.classList.remove('flash-correct', 'flash-incorrect');

    if (exerciseType === 'listen' || exerciseType === 'recall') {
      const field = exerciseType === 'listen' ? 'id' : 'ko';
      const choices = shuffle([entry[field], ...pickDistractors(entry, pool, 3, field)]);
      root.innerHTML = `
        <p class="progress-count">${session.index + 1}/${session.queue.length}</p>
        ${exerciseType === 'listen' ? `
          <div class="audio-controls">
            <button id="play-btn">🔊 Play</button>
            <button id="speed-toggle" class="chip${session.slow ? ' active' : ''}">🐢 Pelan</button>
          </div>
        ` : `<p class="prompt">${esc(entry.id)}</p>`}
        <div class="choices">${choices.map(c => `<button class="choice-btn" data-value="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      `;
      if (exerciseType === 'listen') {
        root.querySelector('#play-btn').addEventListener('click', () => HanaTalkAudio.play(entry.ko, { slow: session.slow }));
        root.querySelector('#speed-toggle').addEventListener('click', () => {
          session.slow = !session.slow;
          root.querySelector('#speed-toggle').classList.toggle('active', session.slow);
          HanaTalkAudio.play(entry.ko, { slow: session.slow });
        });
        HanaTalkAudio.play(entry.ko, { slow: session.slow });
      }
      root.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => answer(root, entry, btn.dataset.value === entry[field]));
      });
    } else {
      root.innerHTML = `
        <p class="progress-count">${session.index + 1}/${session.queue.length}</p>
        <p class="prompt">${esc(entry.ko)}</p>
        <p class="romaja">${esc(entry.romaja)}</p>
        ${HanaTalkAudio.speechSupported
          ? `<button id="mic-btn">🎤 Ucapkan</button>`
          : `<button id="confirm-btn">✅ Sudah saya ucapkan</button>`}
      `;
      if (HanaTalkAudio.speechSupported) {
        root.querySelector('#mic-btn').addEventListener('click', () => {
          root.querySelector('#mic-btn').textContent = '🎤 Mendengarkan...';
          HanaTalkAudio.listenOnce(
            alts => answer(root, entry, checkSpeechMatch(alts, entry.ko)),
            () => answer(root, entry, false)
          );
        });
      } else {
        root.querySelector('#confirm-btn').addEventListener('click', () => answer(root, entry, true));
      }
    }
  }

  function answer(root, entry, correct) {
    if (session.locked) return;
    session.locked = true;
    HanaTalkProgress.recordAnswer(session.state, entry, correct);
    HanaTalkProgress.addXP(session.state, session.queue[session.index].exerciseType);
    HanaTalkProgress.checkBadges(session.state, HanaTalkData.ENTRIES);
    session.onStateChange(session.state);
    root.classList.add(correct ? 'flash-correct' : 'flash-incorrect');
    session.index++;
    setTimeout(() => renderCard(root), 600);
  }

  return { init, buildSessionQueue, checkSpeechMatch, pickDistractors };
})();
