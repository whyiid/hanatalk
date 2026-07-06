(function () {
  const SCREENS = ['drill', 'phrasebook', 'settings'];
  let state = HanaTalkProgress.load();
  state = HanaTalkProgress.updateStreak(state, new Date().toISOString().slice(0, 10));
  HanaTalkProgress.save(state);

  function showScreen(name) {
    SCREENS.forEach(s => {
      document.getElementById('screen-' + s).hidden = s !== name;
      document.getElementById('nav-' + s).classList.toggle('active', s === name);
    });
    if (name === 'drill') HanaTalkDrill.init(state, onStateChange);
    if (name === 'phrasebook') HanaTalkPhrasebook.init();
    if (name === 'settings') HanaTalkSettings.init(state, onStateChange);
  }

  function onStateChange(newState) {
    state = newState;
    HanaTalkProgress.save(state);
  }

  SCREENS.forEach(s => {
    document.getElementById('nav-' + s).addEventListener('click', () => showScreen(s));
  });

  showScreen('drill');
})();
