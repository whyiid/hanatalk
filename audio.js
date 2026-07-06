const HanaTalkAudio = (function () {
  const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechSupported = !!SRClass;

  function play(ko, opts) {
    const rate = (opts && opts.slow) ? 0.7 : 1.0;
    const src = window.HANATALK_AUDIO && window.HANATALK_AUDIO[ko];
    if (src) {
      const audio = new Audio(src);
      audio.playbackRate = rate;
      audio.play().catch(() => {});
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(ko);
      u.lang = 'ko-KR';
      u.rate = rate;
      speechSynthesis.speak(u);
    }
  }

  function listenOnce(onResult, onError) {
    if (!speechSupported) { onError('unsupported'); return null; }
    let r;
    try { r = new SRClass(); } catch (e) { onError('unsupported'); return null; }
    r.lang = 'ko-KR';
    r.interimResults = false;
    r.maxAlternatives = 3;
    r.continuous = false;
    let settled = false;
    const settle = fn => (...args) => { if (settled) return; settled = true; clearTimeout(timer); fn(...args); };
    const timer = setTimeout(settle(() => { try { r.abort(); } catch (_) {} onError('network'); }), 12000);
    r.onresult = settle(e => onResult(Array.from(e.results[0]).map(alt => alt.transcript.trim())));
    r.onerror = settle(e => onError(e.error || 'error'));
    r.onend = settle(() => onError('no-speech'));
    setTimeout(() => { try { r.start(); } catch (e) { settled = true; clearTimeout(timer); onError('error'); } }, 300);
    return r;
  }

  return { play, listenOnce, speechSupported };
})();
