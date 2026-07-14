/* ===== Router ===== */
let currentPage = localStorage.getItem('yt-page') || 'home';

function navigate(page) {
  currentPage = page;
  localStorage.setItem('yt-page', page);
  document.querySelectorAll('[data-page]').forEach(p => p.classList.remove('active'));
  const target = document.querySelector(`[data-page="${page}"]`);
  if (target) target.classList.add('active');
  // Nav links
  document.querySelectorAll('[data-page-link]').forEach(a => {
    a.classList.toggle('active', a.dataset.pageLink === page);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  // Re-trigger reveals
  setTimeout(initReveal, 50);
}

// Handle URL hash
if (window.location.hash) {
  const hash = window.location.hash.slice(1);
  if (['home','features','download','about'].includes(hash)) navigate(hash);
}
navigate(currentPage);

/* ===== i18n ===== */
let lang = localStorage.getItem('yt-landing-lang') || 'fr';

function applyLang() {
  document.querySelectorAll('[data-fr][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  document.getElementById('lang-btn').textContent = lang === 'fr' ? 'EN' : 'FR';
  document.documentElement.lang = lang;
}

function toggleLang() {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('yt-landing-lang', lang);
  applyLang();
}
applyLang();

/* ===== Mobile menu ===== */
function toggleMobile() {
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('hamburger-icon');
  menu.classList.toggle('hidden');
  icon.className = menu.classList.contains('hidden') ? 'fas fa-bars text-gray-300 text-lg' : 'fas fa-times text-gray-300 text-lg';
}

/* ===== Navbar scroll ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('bg-[#0a0a14]/90', window.scrollY > 20);
  navbar.classList.toggle('backdrop-blur-xl', window.scrollY > 20);
  navbar.classList.toggle('border-b', window.scrollY > 20);
  navbar.classList.toggle('border-white/5', window.scrollY > 20);
});

/* ===== Scroll reveal ===== */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
}
initReveal();

/* ===== Dynamic downloads ===== */
const REPO = 'akaletekoffilevis/youtube-downloader';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

const fileMeta = {
  '.exe':  { icon: 'fas fa-file-download', color: 'text-blue-400', label: 'Windows Installer' },
  '.msi':  { icon: 'fas fa-cube', color: 'text-blue-300', label: 'Windows MSI' },
  '.deb':  { icon: 'fab fa-debian', color: 'text-red-400', label: 'Debian / Ubuntu' },
  '.appimage': { icon: 'fas fa-cube', color: 'text-orange-400', label: 'AppImage (Universel)' },
  '.rpm':  { icon: 'fas fa-cube', color: 'text-red-300', label: 'Fedora / RPM' },
  '.dmg':  { icon: 'fab fa-apple', color: 'text-gray-300', label: 'macOS Apple Silicon' },
  '.tar.gz': { icon: 'fas fa-archive', color: 'text-gray-400', label: 'macOS Intel' },
};

const platformMap = {
  'dl-windows': [/\.exe$/i, /\.msi$/i],
  'dl-linux':   [/\.deb$/i, /\.appimage$/i, /\.rpm$/i],
  'dl-macos':   [/\.dmg$/i, /\.tar\.gz$/i],
};

function getExt(name) {
  if (name.endsWith('.tar.gz')) return '.tar.gz';
  const idx = name.lastIndexOf('.');
  return idx !== -1 ? name.slice(idx).toLowerCase() : '';
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024*1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024*1024)).toFixed(1) + ' MB';
}

function renderFile(asset) {
  const ext = getExt(asset.name);
  const meta = fileMeta[ext] || { icon: 'fas fa-file', color: 'text-gray-400', label: ext };
  const size = formatSize(asset.size);
  return `<a href="${asset.browser_download_url}" class="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group" target="_blank" rel="noopener">
    <div class="flex items-center gap-3 min-w-0">
      <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
        <i class="${meta.icon} ${meta.color}"></i>
      </div>
      <div class="min-w-0">
        <div class="text-sm font-semibold text-white truncate">${asset.name}</div>
        <div class="text-xs text-gray-500">${meta.label} · ${size}</div>
      </div>
    </div>
    <i class="fas fa-download text-gray-600 group-hover:text-brand-400 text-sm transition-colors flex-shrink-0 ml-3"></i>
  </a>`;
}

async function loadDownloads() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('No release');
    const data = await res.json();
    const assets = data.assets || [];
    for (const [id, patterns] of Object.entries(platformMap)) {
      const el = document.getElementById(id);
      if (!el) continue;
      const matched = assets.filter(a => patterns.some(p => p.test(a.name)));
      el.innerHTML = matched.length
        ? matched.map(renderFile).join('')
        : `<div class="px-4 py-3 text-sm text-gray-500 text-center" data-fr="Bientôt disponible" data-en="Coming soon">Bientôt disponible</div>`;
    }
  } catch {
    for (const id of Object.keys(platformMap)) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<a href="https://github.com/${REPO}/releases/latest" class="flex items-center justify-center px-4 py-3 text-sm text-brand-400 hover:text-brand-300" target="_blank"><i class="fas fa-external-link-alt mr-2"></i><span data-fr="Voir sur GitHub" data-en="View on GitHub">Voir sur GitHub</span></a>`;
    }
  }
}
loadDownloads();
