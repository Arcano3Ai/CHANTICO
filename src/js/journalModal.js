import { JOURNAL_POSTS } from '../data/journal.js';

export class JournalModal {
  constructor() {
    this.modalEl = document.getElementById('journal-modal');
    this.closeBtn = document.getElementById('journal-close-btn');
    this.contentWrap = document.getElementById('journal-modal-body');
    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }
  }

  open(postId) {
    const post = JOURNAL_POSTS.find(p => p.id === postId);
    if (!post || !this.contentWrap) return;

    this.contentWrap.innerHTML = `
      <div style="max-width: 720px; margin: 0 auto;">
        <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 2rem; border: 1px solid var(--color-border-gold);">
          <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 340px; object-fit: cover;">
          <span class="badge badge-gold" style="position: absolute; top: 1.25rem; left: 1.25rem;">${post.category}</span>
        </div>
        
        <div style="display: flex; gap: 1rem; font-size: 0.78rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 0.75rem;">
          <span>${post.date}</span>
          <span>•</span>
          <span>${post.readTime}</span>
          <span>•</span>
          <span>${post.author}</span>
        </div>

        <h1 style="font-family: var(--font-serif-display); font-size: 2rem; color: var(--color-beige-light); line-height: 1.25; margin-bottom: 1.75rem;">
          ${post.title}
        </h1>

        <div class="journal-post-rich-text" style="color: var(--color-text-secondary); font-size: 1.02rem; line-height: 1.85;">
          ${post.content}
        </div>

        <div style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.82rem; color: var(--color-beige);">
            Compartir en tu frecuencia: <strong>#FrecuenciaDelSer</strong>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('journal-close-btn').click();">
            CERRAR ARTÍCULO
          </button>
        </div>
      </div>
    `;

    if (this.modalEl) this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modalEl) this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }
}
