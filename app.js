/* ===== i18n ===== */
const toggle = document.getElementById('lang-toggle');
let lang = localStorage.getItem('yt-landing-lang') || 'fr';
function applyLang() {
  document.querySelectorAll('[data-fr][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  toggle.textContent = lang === 'fr' ? 'EN' : 'FR';
  document.documentElement.lang = lang;
}
toggle.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('yt-landing-lang', lang);
  applyLang();
});
applyLang();

/* ===== Mobile menu ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ===== Smooth scroll ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ===== Navbar shadow on scroll ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 20);
});

/* ===== Download section: fetch GitHub release assets ===== */
const REPO = 'akaletekoffilevis/youtube-downloader';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

const iconMap = {
  '.exe':  { icon: 'fas fa-file-download', label: 'EXE' },
  '.msi':  { icon: 'fas fa-file-download', label: 'MSI' },
  '.deb':  { icon: 'fab fa-debian',         label: 'DEB' },
  '.appimage': { icon: 'fas fa-cube',       label: 'AppImage' },
  '.dmg':  { icon: 'fab fa-apple',          label: 'DMG' },
};

const platformMatchers = {
  'dl-windows': [/\.exe$/i, /\.msi$/i],
  'dl-linux':   [/\.deb$/i, /\.appimage$/i],
  'dl-macos':   [/\.dmg$/i],
};

function getExt(name) {
  const idx = name.lastIndexOf('.');
  return idx !== -1 ? name.slice(idx).toLowerCase() : '';
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function buildFileLink(asset) {
  const ext = getExt(asset.name);
  const meta = iconMap[ext] || { icon: 'fas fa-file', label: ext.toUpperCase().slice(1) };
  const size = formatSize(asset.size);
  return `<a href="${asset.browser_download_url}" class="dl-file" target="_blank" rel="noopener">
    <div class="dl-file-left">
      <i class="${meta.icon} dl-file-icon"></i>
      <div>
        <span class="dl-file-name">${asset.name}</span>
        <span class="dl-file-meta">${meta.label} · ${size}</span>
      </div>
    </div>
    <i class="fas fa-download dl-file-dl"></i>
  </a>`;
}

async function loadDownloads() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('No release');
    const data = await res.json();
    const assets = data.assets || [];

    for (const [containerId, patterns] of Object.entries(platformMatchers)) {
      const container = document.getElementById(containerId);
      if (!container) continue;
      const matched = assets.filter(a => patterns.some(p => p.test(a.name)));
      if (matched.length === 0) {
        container.innerHTML = `<div class="dl-none" data-fr="Bientôt disponible" data-en="Coming soon">Bientôt disponible</div>`;
      } else {
        container.innerHTML = matched.map(buildFileLink).join('');
      }
    }
  } catch {
    for (const containerId of Object.keys(platformMatchers)) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `<a href="https://github.com/${REPO}/releases/latest" class="dl-file" target="_blank">
          <div class="dl-file-left">
            <i class="fas fa-external-link-alt dl-file-icon"></i>
            <div>
              <span class="dl-file-name" data-fr="Voir sur GitHub" data-en="View on GitHub">Voir sur GitHub</span>
              <span class="dl-file-meta">GitHub Releases</span>
            </div>
          </div>
          <i class="fas fa-arrow-right dl-file-dl"></i>
        </a>`;
      }
    }
  }
}
loadDownloads();

/* ===== Scroll reveal ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .how-step, .tech-item, .testimonial-card, .dl-platform').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
