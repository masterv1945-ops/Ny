/* مدرسه‌ی من — بازسازی ساختاری پوسته‌ی رابط کاربری
 * منطق ورود، رویدادها و اتصال Supabase فایل‌های اصلی حفظ شده است.
 */
(function () {
  'use strict';
  if (document.documentElement.dataset.redesignReady === '1') return;
  document.documentElement.dataset.redesignReady = '1';

  const labels = {
    home: 'خانه و نمای کلی', circulars: 'بخش‌نامه‌های مدرسه', grades: 'نمرات من',
    reports: 'کارنامه‌ها', exams: 'برنامه امتحان‌ها', attendance: 'حضور و غیاب',
    violations: 'موارد انضباطی', assignments: 'تکالیف', notifications: 'اعلان‌ها',
    chat: 'گفت‌وگو', calendar: 'تقویم مدرسه', schoolInfo: 'اطلاعات مدرسه',
    aboutApp: 'درباره سامانه', updates: 'به‌روزرسانی‌ها', updateHistory: 'تاریخچه نسخه‌ها',
    settings: 'تنظیمات', account: 'حساب کاربری',
    dashboard: 'داشبورد', teachers: 'مدیریت معلم‌ها', students: 'مدیریت دانش‌آموزها',
    parents: 'مدیریت والدین', assignmentsManager: 'تخصیص درس و کلاس',
    'academic-exams': 'امتحانات و ثبت نمره', 'academic-attendance': 'حضور و غیاب',
    'academic-periodic': 'نمرات دوره‌ای', schedule: 'برنامه هفتگی', password: 'تغییر رمز',
    finance: 'حساب مالی', invoices: 'فاکتورها', discounts: 'تخفیف‌ها'
  };
  const icons = {
    home: '⌂', dashboard: '▦', teachers: '♙', students: '♧', parents: '♧',
    assignments: '▤', grades: '◈', reports: '▧', exams: '▣', attendance: '✓',
    violations: '!', notifications: '◉', chat: '✉', calendar: '▦', schedule: '▦',
    circulars: '▤', settings: '⚙', account: '♙', password: '⌑', schoolInfo: '⌂',
    aboutApp: 'i', updates: '↻', updateHistory: '◷', finance: '¤', invoices: '▧', discounts: '%'
  };
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  function brand(role, subtitle) {
    const b = el('div', 'rd-brand');
    b.innerHTML = '<span class="rd-brand-symbol" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M24 5 4 15l20 10 20-10L24 5Z"/><path d="M11 20v11c7 7 19 7 26 0V20L24 27 11 20Z"/><path d="M42 17v15"/></svg></span><span class="rd-brand-copy"><strong>مدرسه‌ی من</strong><small>' + subtitle + '</small></span>';
    if (role) b.setAttribute('data-role', role);
    return b;
  }
  function addNavIcon(button, key) {
    if (!button || button.querySelector('.rd-nav-icon')) return;
    const ico = el('span', 'rd-nav-icon', icons[key] || '•');
    ico.setAttribute('aria-hidden', 'true');
    button.insertBefore(ico, button.firstChild);
  }
  function markActive(container, current) {
    if (!container) return;
    container.querySelectorAll('[data-rd-page]').forEach(b => b.classList.toggle('active', b.dataset.rdPage === current));
  }
  function buildNav(items, className, onPick) {
    const nav = el('nav', className);
    nav.setAttribute('aria-label', 'ناوبری پنل');
    items.forEach(({ id, label }) => {
      const b = el('button', 'rd-nav-link', '');
      b.type = 'button'; b.dataset.rdPage = id;
      const ico = el('span', 'rd-nav-icon', icons[id] || '•');
      ico.setAttribute('aria-hidden', 'true');
      const txt = el('span', 'rd-nav-label', label || labels[id] || id);
      b.append(ico, txt);
      b.addEventListener('click', () => onPick(id));
      nav.appendChild(b);
    });
    return nav;
  }

  /* صفحة الدخول: قسم تعريفي مستقل + نموذج دخول، مع إبقاء معرّفات المنطق الحالي. */
  const loginSheet = document.querySelector('main.sheet');
  if (loginSheet && document.getElementById('loginForm')) {
    const oldHeader = loginSheet.querySelector('header');
    const boot = document.getElementById('boot');
    const noscript = loginSheet.querySelector('noscript');
    const form = document.getElementById('loginForm');
    const layout = el('div', 'rd-login-layout');
    const intro = el('section', 'rd-login-intro');
    intro.appendChild(brand('welcome', 'سامانه‌ی یکپارچه آموزشی'));
    const eyebrow = el('div', 'rd-eyebrow', 'فضای امن مدرسه، در یک جا');
    intro.appendChild(eyebrow);
    if (oldHeader) intro.appendChild(oldHeader);
    const introFoot = el('div', 'rd-intro-foot');
    introFoot.innerHTML = '<span class="rd-status-dot"></span><span>دسترسی اختصاصی برای اعضای مدرسه</span>';
    intro.appendChild(introFoot);
    const roleWrap = el('div', 'rd-role-shortcuts');
    roleWrap.appendChild(el('div', 'rd-shortcut-title', 'ورود مستقیم به پنل'));
    [
      ['student.html', 'دانش‌آموز', '♙'], ['parent.html', 'والدین', '⌂'],
      ['teacher.html', 'معلم', '✎'], ['index.html?role=manager', 'مدیر مدرسه', '▦']
    ].forEach(([href, text, ico]) => {
      const a = el('a', 'rd-role-link'); a.href = href;
      a.innerHTML = '<span aria-hidden="true">' + ico + '</span><strong>' + text + '</strong><i aria-hidden="true">←</i>';
      roleWrap.appendChild(a);
    });
    intro.appendChild(roleWrap);

    const side = el('section', 'rd-login-panel');
    side.appendChild(el('div', 'rd-login-kicker', 'خوش آمدید'));
    const loginTitle = el('h2', 'rd-login-title', 'ورود به حساب کاربری');
    const loginSubtitle = el('p', 'rd-login-subtitle', 'نام کاربری و رمز عبور مدرسه را وارد کنید.');
    if (new URLSearchParams(location.search).get('role') === 'manager') {
      loginTitle.textContent = 'ورود به پنل مدیر مدرسه';
      loginSubtitle.textContent = 'با حساب مدیر مدرسه وارد شوید. پس از ورود، پنل متناسب با نقش حساب باز می‌شود.';
    }
    side.append(loginTitle, loginSubtitle);
    if (boot) side.appendChild(boot);
    if (noscript) side.appendChild(noscript);
    side.appendChild(form);
    const footer = el('p', 'rd-login-footer', 'در صورت فراموشی رمز عبور، با مدیر مدرسه تماس بگیرید.');
    side.appendChild(footer);
    layout.append(intro, side);
    loginSheet.replaceChildren(layout);
    loginSheet.classList.add('rd-login-sheet');
  }

  /* پنل مدیر: حفظ sectionها و فرم‌های اصلی، نوسازی ناوبری و سرصفحه. */
  const managerLayout = document.querySelector('.layout:has(.sidebar)');
  const managerSidebar = managerLayout && managerLayout.querySelector('.sidebar');
  if (managerSidebar && document.getElementById('dashboard')) {
    managerSidebar.insertBefore(brand('manager', 'پنل مدیریت'), managerSidebar.firstChild);
    managerSidebar.querySelectorAll('.menu-btn').forEach(button => {
      const match = (button.getAttribute('onclick') || '').match(/showPage\(['"]([^'"]+)/);
      const page = match ? match[1] : (button.classList.contains('logout') ? 'logout' : '');
      addNavIcon(button, page === 'logout' ? 'password' : page);
    });
    const managerTopbar = document.querySelector('.topbar');
    if (managerTopbar) managerTopbar.classList.add('rd-manager-topbar');
    const title = document.querySelector('.topbar .top-title');
    if (title) {
      title.innerHTML = '<span class="rd-top-kicker">فضای کاری مدرسه</span><strong>مدیریت مدرسه</strong>';
    }
    const who = document.getElementById('managerName');
    if (who) who.classList.add('rd-user-chip');
    managerLayout.classList.add('rd-workspace', 'rd-manager-workspace');
    managerSidebar.classList.add('rd-sidebar');
    const content = managerLayout.querySelector('.content');
    if (content) content.classList.add('rd-main-content');
    document.querySelectorAll('.menu-btn[onclick*="showPage"]').forEach(b => {
      b.addEventListener('click', () => markActive(managerSidebar, ((b.getAttribute('onclick') || '').match(/showPage\(['"]([^'"]+)/) || [])[1] || 'dashboard'));
    });
  }

  /* پنل معلم: همان منطق رویدادها، با پوسته‌ی دسکتاپ/موبایل جدید. */
  const teacherLayout = document.querySelector('.layout:not(:has(.sidebar))');
  const teacherAside = teacherLayout && teacherLayout.querySelector('aside');
  if (teacherAside && document.getElementById('classFilter')) {
    teacherAside.insertBefore(brand('teacher', 'پنل معلم'), teacherAside.firstChild);
    const tnav = teacherAside.querySelector('.nav');
    if (tnav) {
      tnav.querySelectorAll('button').forEach(button => {
        const match = (button.getAttribute('onclick') || '').match(/showPage\(['"]([^'"]+)/);
        addNavIcon(button, match ? match[1] : 'home');
      });
      tnav.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
        const match = (button.getAttribute('onclick') || '').match(/showPage\(['"]([^'"]+)/);
        if (match) markActive(tnav, match[1]);
      }));
    }
    teacherLayout.classList.add('rd-workspace', 'rd-teacher-workspace');
    teacherAside.classList.add('rd-sidebar');
    const main = teacherLayout.querySelector('main');
    if (main) main.classList.add('rd-main-content');
    const top = document.querySelector('header.top');
    if (top) top.classList.add('rd-topbar');
    const currentTeacher = document.getElementById('teacherName');
    if (currentTeacher) currentTeacher.classList.add('rd-user-chip');
  }

  /* پنل دانش‌آموز: ساخت ناوبری عمودی از همان بخش‌های موجود؛ تب‌های پایین برای موبایل حفظ می‌شوند. */
  const studentApp = document.getElementById('appView');
  const studentLogin = document.getElementById('loginView');
  const studentTabs = document.getElementById('bottomTabs');
  if (studentApp && studentLogin && studentTabs) {
    const ids = Array.from(studentApp.querySelectorAll('section.page')).map(s => ({ id: s.id, label: labels[s.id] || s.querySelector('h2,h3')?.textContent?.trim() || s.id }));
    const shell = el('div', 'rd-student-shell');
    const sidebar = el('aside', 'rd-sidebar rd-student-sidebar');
    sidebar.appendChild(brand('student', 'پنل دانش‌آموز'));
    const nav = buildNav(ids, 'rd-nav', id => {
      if (typeof window.go === 'function') window.go(id);
      markActive(nav, id);
    });
    sidebar.appendChild(nav);
    sidebar.appendChild(el('div', 'rd-sidebar-note', 'یادگیری، برنامه‌ها و خبرهای مدرسه در یک نگاه.'));
    const main = el('div', 'rd-student-main');
    studentApp.parentNode.insertBefore(shell, studentApp);
    shell.append(sidebar, main);
    main.append(studentApp, studentTabs);
    shell.dataset.rdRole = 'student';
    const originalGo = window.go;
    if (typeof originalGo === 'function' && !originalGo.__rdWrapped) {
      const wrapped = function (page) {
        const result = originalGo.apply(this, arguments);
        markActive(nav, page);
        return result;
      };
      wrapped.__rdWrapped = true;
      window.go = wrapped;
    }
    document.body.classList.add('rd-student-page');
  }

  /* پنل والدین: منوی ثابت دسکتاپ از روی عملکردهای موجود؛ خانه و پنجره‌های فعلی حفظ می‌شوند. */
  const parentApp = document.getElementById('app');
  const parentLogin = document.getElementById('login');
  const parentWrap = document.querySelector('main.wrap');
  if (parentApp && parentLogin && parentWrap && document.getElementById('schoolTitle')) {
    const grid = parentApp.querySelector('.grid');
    const shell = el('div', 'rd-parent-shell');
    const sidebar = el('aside', 'rd-sidebar rd-parent-sidebar');
    sidebar.appendChild(brand('parent', 'پنل والدین'));
    const nav = el('nav', 'rd-nav'); nav.setAttribute('aria-label', 'ناوبری پنل والدین');
    const parentItems = [
      ['home', 'خانه'], ['schedule', 'برنامه هفتگی'], ['chat', 'پیام‌ها'],
      ['notifications', 'اعلان‌ها'], ['finance', 'حساب مالی'], ['invoices', 'فاکتورها'],
      ['discounts', 'تخفیف‌ها'], ['reports', 'گزارش‌ها']
    ];
    parentItems.forEach(([id, text]) => {
      const b = el('button', 'rd-nav-link'); b.type = 'button'; b.dataset.rdPage = id;
      const ico = el('span', 'rd-nav-icon', icons[id] || '•');
      const label = el('span', 'rd-nav-label', text);
      b.append(ico, label);
      b.addEventListener('click', () => {
        if (id === 'home') { if (typeof window.showPage === 'function') window.showPage('home'); }
        else if (typeof window.showPage === 'function') window.showPage(id);
        markActive(nav, id);
      });
      nav.appendChild(b);
    });
    sidebar.appendChild(nav);
    sidebar.appendChild(el('div', 'rd-sidebar-note', 'پیگیری وضعیت تحصیلی و ارتباط با مدرسه.'));
    const main = el('div', 'rd-parent-main');
    const title = el('div', 'rd-parent-heading');
    const schoolTitle = document.getElementById('schoolTitle');
    title.appendChild(schoolTitle);
    title.appendChild(el('span', 'rd-parent-context', 'نمای کلی حساب والدین'));
    main.appendChild(title);
    const appParent = parentApp.parentNode;
    appParent.insertBefore(shell, parentApp);
    shell.append(sidebar, main);
    main.appendChild(parentApp);
    const head = document.querySelector('header.top');
    if (head) head.classList.add('rd-parent-top');
    shell.dataset.rdRole = 'parent';
    document.body.classList.add('rd-parent-page');
    // انتخاب خانه ابتدا فعال است؛ دکمه‌های ناوبری فقط از همان تابع صفحه‌ی اصلی استفاده می‌کنند.
    markActive(nav, 'home');
    const originalShowPage = window.showPage;
    if (typeof originalShowPage === 'function' && !originalShowPage.__rdWrapped) {
      const wrappedShowPage = function (page) {
        const result = originalShowPage.apply(this, arguments);
        markActive(nav, page || 'home');
        return result;
      };
      wrappedShowPage.__rdWrapped = true;
      window.showPage = wrappedShowPage;
    }
  }

  // استانداردسازی عنوان‌ها، حالت فعال و ابزارهای کنترلی بدون لمس رویدادهای کسب‌وکار.
  document.querySelectorAll('input, select, textarea').forEach(n => n.classList.add('rd-control'));
  document.querySelectorAll('.panel, .card, .stat, .tile, .notice, .summary').forEach(n => n.classList.add('rd-surface'));
  document.querySelectorAll('table').forEach(t => { if (!t.parentElement.classList.contains('rd-table-scroll') && !t.parentElement.classList.contains('table-wrap')) { const w = el('div', 'rd-table-scroll'); t.parentNode.insertBefore(w, t); w.appendChild(t); } });
})();
