// Reproductor Armónico de Cuencos y Ondas Sonoras NÜMA

export function initSoundPlayer() {
  const audio = document.getElementById('chantico-sound-audio') || document.getElementById('numa-sound-audio');
  const playBtn = document.getElementById('sound-play-btn');
  const playIcon = document.getElementById('sound-play-icon');
  const pauseIcon = document.getElementById('sound-pause-icon');
  const timeCurrent = document.getElementById('sound-time-current');
  const timeTotal = document.getElementById('sound-time-total');
  const progressBar = document.getElementById('sound-progress-bar');
  const progressFill = document.getElementById('sound-progress-fill');
  const waveBars = document.querySelectorAll('.wave-bar');
  const heroAudioBtn = document.getElementById('hero-audio-btn');
  const floatingPlayer = document.getElementById('chantico-floating-player') || document.getElementById('numa-floating-player');
  const floatingPlayBtn = document.getElementById('floating-audio-play-btn');
  const floatingPlayIcon = document.getElementById('floating-play-icon');
  const floatingPauseIcon = document.getElementById('floating-pause-icon');
  const floatingStatus = document.getElementById('floating-player-status');

  if (!audio || !playBtn) return;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function setPlayingState(isPlaying) {
    if (isPlaying) {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      waveBars.forEach(bar => bar.classList.add('animating'));
      if (heroAudioBtn) {
        heroAudioBtn.innerHTML = '⏸ PAUSAR PURIFICACIÓN';
        heroAudioBtn.classList.add('is-playing');
      }
      if (floatingPlayer) {
        floatingPlayer.classList.add('is-playing');
        if (floatingPlayIcon) floatingPlayIcon.style.display = 'none';
        if (floatingPauseIcon) floatingPauseIcon.style.display = 'block';
        if (floatingStatus) floatingStatus.textContent = 'Chantico Purificación • Sonando 🔥';
      }
    } else {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      waveBars.forEach(bar => bar.classList.remove('animating'));
      if (heroAudioBtn) {
        heroAudioBtn.innerHTML = '✦ CHANTICO PURIFICACIÓN';
        heroAudioBtn.classList.remove('is-playing');
      }
      if (floatingPlayer) {
        floatingPlayer.classList.remove('is-playing');
        if (floatingPlayIcon) floatingPlayIcon.style.display = 'block';
        if (floatingPauseIcon) floatingPauseIcon.style.display = 'none';
        if (floatingStatus) floatingStatus.textContent = 'Chantico Purificación • Escuchar';
      }
    }
  }

  if (heroAudioBtn) {
    heroAudioBtn.addEventListener('click', () => {
      playBtn.click();
    });
  }

  if (floatingPlayer) {
    floatingPlayer.addEventListener('click', (e) => {
      // Evitar doble toggle si se hace click directamente en el botón
      playBtn.click();
    });
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch(err => {
        console.warn('Audio playback blocked or failed', err);
      });
    } else {
      audio.pause();
      setPlayingState(false);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
    if (progressFill && audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;
    }
  });

  audio.addEventListener('ended', () => {
    setPlayingState(false);
    if (progressFill) progressFill.style.width = '0%';
    if (timeCurrent) timeCurrent.textContent = '00:00';
  });

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (audio.duration) {
        audio.currentTime = clickPos * audio.duration;
      }
    });
  }

  // Activar audio automáticamente en la primera interacción si el usuario no ha hecho click en los botones
  audio.volume = 0.85;

  function enableAudioOnFirstInteraction() {
    if (audio.paused) {
      audio.play().then(() => {
        setPlayingState(true);
      }).catch(() => {});
    }
  }

  // Intentar autoplay inicial; si el navegador lo bloquea, escuchar la primera interacción
  audio.play().then(() => {
    setPlayingState(true);
  }).catch(() => {
    const onUserAction = () => {
      enableAudioOnFirstInteraction();
      window.removeEventListener('click', onUserAction);
      window.removeEventListener('touchstart', onUserAction);
      window.removeEventListener('scroll', onUserAction);
    };
    window.addEventListener('click', onUserAction, { once: true });
    window.addEventListener('touchstart', onUserAction, { once: true });
    window.addEventListener('scroll', onUserAction, { once: true });
  });
}
