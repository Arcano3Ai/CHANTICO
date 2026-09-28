import { MEDITACIONES_GUIADAS } from '../data/meditaciones.js';

export class MeditacionGuiadaPlayer {
  constructor() {
    this.tracks = MEDITACIONES_GUIADAS;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    this.container = document.getElementById('meditacion-guiada-section');
    if (!this.container) return;

    this.init();
  }

  init() {
    this.renderTrackList();
    this.bindEvents();
    this.loadTrack(0, false);
  }

  getCurrentTrack() {
    return this.tracks[this.currentIndex];
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  loadTrack(index, autoPlay = true) {
    if (index < 0 || index >= this.tracks.length) return;
    this.currentIndex = index;
    const track = this.getCurrentTrack();

    // Actualizar datos en UI
    const titleEl = document.getElementById('med-player-title');
    const freqEl = document.getElementById('med-player-frequency');
    const descEl = document.getElementById('med-player-desc');
    const badgeEl = document.getElementById('med-player-badge');
    const durationEl = document.getElementById('med-player-duration');

    if (titleEl) titleEl.textContent = track.title;
    if (freqEl) freqEl.textContent = track.frequency;
    if (descEl) descEl.textContent = track.description;
    if (badgeEl) badgeEl.textContent = track.badge || 'Meditación Guiada';
    if (durationEl) durationEl.textContent = track.duration;

    // Actualizar clase activa en la lista
    document.querySelectorAll('.med-track-card').forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });

    // Cargar audio con fallback inteligente
    this.audio.src = track.audioSrc;
    this.audio.onerror = () => {
      // Si la canción aún no ha sido copiada por el usuario, usar el audio armónico existente
      if (this.audio.src !== track.fallbackSrc) {
        this.audio.src = track.fallbackSrc;
        if (this.isPlaying) {
          this.audio.play().catch(() => {});
        }
      }
    };

    if (autoPlay) {
      this.play();
    } else {
      this.updatePlayState(false);
    }
  }

  play() {
    // Si el reproductor de cuencos global está sonando, pausarlo
    const globalAudio = document.getElementById('numa-sound-audio');
    if (globalAudio && !globalAudio.paused) {
      globalAudio.pause();
    }

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayState(true);
    }).catch(err => {
      console.warn('Auto-play prevent or pending audio file:', err);
      // Fallback a pista insignia si falla
      const track = this.getCurrentTrack();
      if (track.fallbackSrc && this.audio.src !== track.fallbackSrc) {
        this.audio.src = track.fallbackSrc;
        this.audio.play().then(() => {
          this.isPlaying = true;
          this.updatePlayState(true);
        }).catch(() => {});
      }
    });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayState(false);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next() {
    const nextIdx = (this.currentIndex + 1) % this.tracks.length;
    this.loadTrack(nextIdx, true);
  }

  prev() {
    const prevIdx = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.loadTrack(prevIdx, true);
  }

  updatePlayState(isPlaying) {
    const playIcon = document.getElementById('med-play-icon');
    const pauseIcon = document.getElementById('med-pause-icon');
    const playerBox = document.getElementById('med-player-box');
    const waveVisualizer = document.getElementById('med-wave-visualizer');

    if (playIcon && pauseIcon) {
      playIcon.style.display = isPlaying ? 'none' : 'block';
      pauseIcon.style.display = isPlaying ? 'block' : 'none';
    }

    if (playerBox) {
      playerBox.classList.toggle('is-playing', isPlaying);
    }

    if (waveVisualizer) {
      waveVisualizer.querySelectorAll('.wave-bar').forEach(bar => {
        bar.classList.toggle('animating', isPlaying);
      });
    }

    // Actualizar íconos en la lista
    document.querySelectorAll('.med-track-card').forEach((card, idx) => {
      const isCurrent = idx === this.currentIndex;
      const cardPlayBtn = card.querySelector('.track-play-indicator');
      if (cardPlayBtn) {
        cardPlayBtn.textContent = (isCurrent && isPlaying) ? '⏸' : '▶';
      }
    });
  }

  bindEvents() {
    const playBtn = document.getElementById('med-play-btn');
    const nextBtn = document.getElementById('med-next-btn');
    const prevBtn = document.getElementById('med-prev-btn');
    const progressBar = document.getElementById('med-progress-bar');
    const progressFill = document.getElementById('med-progress-fill');
    const timeCurrent = document.getElementById('med-time-current');
    const timeTotal = document.getElementById('med-time-total');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }

    // Actualizar barra de progreso con el tiempo del audio
    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio.duration) return;
      const pct = (this.audio.currentTime / this.audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (timeCurrent) timeCurrent.textContent = this.formatTime(this.audio.currentTime);
      if (timeTotal && !isNaN(this.audio.duration)) {
        timeTotal.textContent = this.formatTime(this.audio.duration);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    // Clic en la barra para adelantar/retroceder
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickRatio = Math.max(0, Math.min(1, clickX / width));
        if (this.audio.duration) {
          this.audio.currentTime = clickRatio * this.audio.duration;
        }
      });
    }
  }

  renderTrackList() {
    const listContainer = document.getElementById('med-tracks-list');
    if (!listContainer) return;

    listContainer.innerHTML = this.tracks.map((track, idx) => `
      <div class="med-track-card ${idx === 0 ? 'active' : ''}" data-track-index="${idx}">
        <div class="track-play-indicator">▶</div>
        <div class="track-meta">
          <div class="track-header-row">
            <span class="track-tag">${track.tag}</span>
            <span class="track-frequency-badge">${track.frequency}</span>
          </div>
          <h4 class="track-title">${track.title}</h4>
          <p class="track-intention">${track.intention}</p>
        </div>
        <div class="track-duration">${track.duration}</div>
      </div>
    `).join('');

    listContainer.querySelectorAll('.med-track-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.trackIndex, 10);
        if (idx === this.currentIndex) {
          this.togglePlay();
        } else {
          this.loadTrack(idx, true);
        }
      });
    });
  }
}

export function initMeditacionGuiada() {
  return new MeditacionGuiadaPlayer();
}
