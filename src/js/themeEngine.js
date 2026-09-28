class ThemeEngine {
  constructor() {
    const savedTheme = localStorage.getItem('chantico_theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // NÜMA default dark
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('chantico_theme', theme);

    // Actualizar aria-label en botones de tema
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
      btn.setAttribute('title', theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro');
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    return newTheme;
  }

  getTheme() {
    return this.currentTheme;
  }

  bindEvents() {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleTheme();
      });
    });
  }
}

export const themeEngine = new ThemeEngine();
