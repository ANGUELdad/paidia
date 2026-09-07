/**
 * School Moodle Armonia shell — subject-first school space.
 */
(function () {
  'use strict';
  document.documentElement.dataset.shell = 'school';
  window.__PAIDIA_SHELL__ = 'school';

  function enhance() {
    document.body.classList.add('shell-school', 'layout-mobile');
    document.body.classList.remove('layout-desktop');
    if (window.state && window.state.mode === 'staff' && window.state.tab !== 'school') {
      try {
        if (!location.hash || location.hash === '#' || location.hash === '#home') {
          window.state.tab = 'school';
          if (typeof window.syncLocationHash === 'function') window.syncLocationHash();
        }
      } catch {}
    }
    if (!document.getElementById('shellSwitchDesk')) {
      const tools = document.getElementById('topTools');
      if (tools) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'shellSwitchDesk';
        btn.className = 'topbtn shell-switch';
        btn.textContent = 'Desk';
        btn.title = 'Desktop';
        btn.onclick = () => {
          if (window.PaidiaShell) {
            window.PaidiaShell.setOverride('desk');
            window.PaidiaShell.go('desk');
          } else {
            location.href = '/desk/';
          }
        };
        tools.appendChild(btn);
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance);
  else enhance();
  window.addEventListener('paidia:rendered', enhance);
})();
