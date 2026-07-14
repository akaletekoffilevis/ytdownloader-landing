/* ===== Theme ===== */
const theme = localStorage.getItem('yt-theme') || 'dark';
function applyTheme(t) {
  document.documentElement.classList.toggle('dark', t === 'dark');
  document.documentElement.classList.toggle('light', t === 'light');
  localStorage.setItem('yt-theme', t);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}
function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}
applyTheme(theme);

/* ===== i18n ===== */
let lang = localStorage.getItem('yt-landing-lang') || 'fr';
function applyLang() {
  document.querySelectorAll('[data-fr][data-en]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt) el.textContent = txt;
  });
  document.querySelectorAll('[data-fr-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute('data-fr-placeholder');
    if (lang === 'en' && el.hasAttribute('data-en-placeholder')) el.placeholder = el.getAttribute('data-en-placeholder');
  });
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
  document.documentElement.lang = lang;
}
function toggleLang() {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('yt-landing-lang', lang);
  applyLang();
}

/* ===== Nav component ===== */
let mobileMenuOpen = false;
function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const menu = document.getElementById('mobile-menu');
  const icon = document.getElementById('hamburger-icon');
  if (!menu) return;
  if (mobileMenuOpen) {
    menu.classList.remove('hidden');
    menu.style.maxHeight = '0';
    menu.style.opacity = '0';
    requestAnimationFrame(() => { menu.style.maxHeight = '400px'; menu.style.opacity = '1'; });
    if (icon) { icon.className = 'fas fa-xmark text-gray-500 dark:text-gray-400 text-lg'; }
    document.addEventListener('click', closeMobileMenuOutside);
  } else {
    menu.style.maxHeight = '0';
    menu.style.opacity = '0';
    if (icon) { icon.className = 'fas fa-bars text-gray-500 dark:text-gray-400 text-lg'; }
    setTimeout(() => menu.classList.add('hidden'), 200);
    document.removeEventListener('click', closeMobileMenuOutside);
  }
}
function closeMobileMenuOutside(e) {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('hamburger-btn');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) toggleMobileMenu();
}

function getCurrentPage() {
  const path = window.location.pathname;
  if (path.endsWith('features.html')) return 'features';
  if (path.endsWith('download.html')) return 'download';
  if (path.endsWith('about.html')) return 'about';
  if (path.endsWith('changelog.html')) return 'changelog';
  if (path.endsWith('contact.html')) return 'contact';
  return 'home';
}

function renderNav() {
  const page = getCurrentPage();
  const links = [
    { id:'home', href:'index.html', fr:'Accueil', en:'Home' },
    { id:'features', href:'features.html', fr:'Fonctionnalités', en:'Features' },
    { id:'download', href:'download.html', fr:'Télécharger', en:'Download' },
    { id:'changelog', href:'changelog.html', fr:'Versions', en:'Changelog' },
    { id:'about', href:'about.html', fr:'À propos', en:'About' },
    { id:'contact', href:'contact.html', fr:'Contact', en:'Contact' },
  ];
  const navLinks = links.map(l =>
    `<a href="${l.href}" class="px-3 py-2 text-sm font-medium rounded-lg transition-colors ${l.id===page?'text-indigo-400 dark:text-indigo-400 text-indigo-600':'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}" data-fr="${l.fr}" data-en="${l.en}">${l.fr}</a>`
  ).join('');
  const mobileLinks = links.map(l =>
    `<a href="${l.href}" onclick="if(mobileMenuOpen)toggleMobileMenu()" class="block px-4 py-3 rounded-xl text-base font-medium transition-colors ${l.id===page?'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400':'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 active:bg-gray-100 dark:active:bg-white/10'}" data-fr="${l.fr}" data-en="${l.en}">${l.fr}</a>`
  ).join('');

  const nav = document.getElementById('site-nav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a14]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="flex items-center justify-between h-16">
          <a href="index.html" class="flex items-center gap-2.5 group shrink-0">
            <img src="assets/logo.svg" alt="Logo" class="w-8 h-8 rounded-lg group-hover:scale-110 transition-transform">
            <span class="font-bold text-lg text-gray-900 dark:text-white hidden sm:inline">YT Downloader</span>
          </a>
          <div class="hidden md:flex items-center gap-1">${navLinks}</div>
          <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button onclick="toggleLang()" class="px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all" id="lang-btn">EN</button>
            <button onclick="toggleTheme()" class="p-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
              <i id="theme-icon" class="fas ${theme==='dark'?'fa-sun':'fa-moon'} text-sm"></i>
            </button>
            <a href="https://github.com/akaletekoffilevis/youtube-downloader" target="_blank" class="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
              <i class="fab fa-github"></i>
            </a>
            <button onclick="toggleMobileMenu()" id="hamburger-btn" class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 active:bg-gray-200 dark:active:bg-white/10">
              <i id="hamburger-icon" class="fas fa-bars text-gray-500 dark:text-gray-400 text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="mobile-menu" class="md:hidden hidden fixed top-16 left-0 right-0 z-40 px-4 pb-4" style="max-height:0;opacity:0;transition:all 0.25s ease">
      <div class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/10 dark:shadow-black/40">${mobileLinks}</div>
    </div>`;
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <img src="assets/logo.svg" alt="Logo" class="w-6 h-6 rounded">
          <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">YT Downloader</span>
        </div>
        <div class="text-xs text-gray-400">&copy; 2026 Koffi Levis Akalete. MIT License.</div>
        <div class="flex items-center gap-4 text-xs flex-wrap justify-center">
          <a href="index.html" class="text-gray-400 hover:text-indigo-500 transition-colors" data-fr="Accueil" data-en="Home">Accueil</a>
          <a href="features.html" class="text-gray-400 hover:text-indigo-500 transition-colors" data-fr="Fonctionnalités" data-en="Features">Fonctionnalités</a>
          <a href="download.html" class="text-gray-400 hover:text-indigo-500 transition-colors" data-fr="Télécharger" data-en="Download">Télécharger</a>
          <a href="https://github.com/akaletekoffilevis/youtube-downloader" target="_blank" class="text-gray-400 hover:text-indigo-500 transition-colors"><i class="fab fa-github"></i></a>
          <a href="mailto:koffilevis21@gmail.com" class="text-gray-400 hover:text-indigo-500 transition-colors"><i class="fas fa-envelope"></i></a>
        </div>
      </div>
    </div>`;
}

/* ===== Dynamic Downloads ===== */
async function loadDownloads() {
  const REPO = 'akaletekoffilevis/youtube-downloader';
  const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
  const fileMeta = {
    '.exe':  { icon:'fas fa-file-download', color:'text-blue-500', label:'Windows Installer' },
    '.msi':  { icon:'fas fa-cube', color:'text-blue-400', label:'Windows MSI' },
    '.deb':  { icon:'fab fa-debian', color:'text-red-500', label:'Debian / Ubuntu' },
    '.appimage': { icon:'fas fa-cube', color:'text-orange-500', label:'AppImage' },
    '.rpm':  { icon:'fas fa-cube', color:'text-red-400', label:'Fedora / RPM' },
    '.dmg':  { icon:'fab fa-apple', color:'text-gray-500 dark:text-gray-300', label:'macOS Apple Silicon' },
    '.tar.gz': { icon:'fas fa-archive', color:'text-gray-400', label:'macOS Intel' },
  };
  const platformMap = {
    'dl-windows': [/\.exe$/i, /\.msi$/i],
    'dl-linux':   [/\.deb$/i, /\.appimage$/i, /\.rpm$/i],
    'dl-macos':   [/\.dmg$/i, /\.tar\.gz$/i],
  };
  function getExt(n) { if(n.endsWith('.tar.gz'))return '.tar.gz'; const i=n.lastIndexOf('.'); return i!==-1?n.slice(i).toLowerCase():''; }
  function fmtSize(b) { if(!b)return''; if(b<1048576)return(b/1024).toFixed(0)+' KB'; return(b/1048576).toFixed(1)+' MB'; }
  function renderFile(a, isMain) {
    const ext=getExt(a.name), m=fileMeta[ext]||{icon:'fas fa-file',color:'text-gray-400',label:ext};
    if (isMain) {
      return `<a href="${a.browser_download_url}" download class="flex items-center justify-between px-4 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-all group shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0"><i class="fas fa-download text-white"></i></div>
          <div class="min-w-0"><div class="text-sm font-bold truncate">${a.name}</div><div class="text-xs text-white/70">${m.label} · ${fmtSize(a.size)}</div></div>
        </div>
        <i class="fas fa-arrow-down text-white/80 group-hover:text-white text-sm transition-colors flex-shrink-0 ml-3"></i></a>`;
    }
    return `<a href="${a.browser_download_url}" download class="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all group">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0"><i class="${m.icon} ${m.color}"></i></div>
        <div class="min-w-0"><div class="text-sm font-semibold text-gray-900 dark:text-white truncate">${a.name}</div><div class="text-xs text-gray-400">${m.label} · ${fmtSize(a.size)}</div></div>
      </div>
      <i class="fas fa-download text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 text-sm transition-colors flex-shrink-0 ml-3"></i></a>`;
  }
  try {
    const res=await fetch(API_URL); if(!res.ok)throw 0;
    const data=await res.json(), assets=data.assets||[];
    for(const[id,pats]of Object.entries(platformMap)){
      const el=document.getElementById(id); if(!el)continue;
      const matched=assets.filter(a=>pats.some(p=>p.test(a.name)));
      el.innerHTML=matched.length?matched.map((a,i)=>renderFile(a,i===0)).join(''):
        `<div class="px-4 py-3 text-sm text-gray-400 text-center" data-fr="Bientôt disponible" data-en="Coming soon">Bientôt disponible</div>`;
    }
  } catch {
    for(const id of Object.keys(platformMap)){
      const el=document.getElementById(id); if(!el)continue;
      el.innerHTML=`<a href="https://github.com/${REPO}/releases/latest" class="flex items-center justify-center px-4 py-3 text-sm text-indigo-500" target="_blank"><i class="fas fa-external-link-alt mr-2"></i>GitHub Releases</a>`;
    }
  }
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  applyLang();
  if (document.getElementById('dl-windows')) loadDownloads();
});
