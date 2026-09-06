/**
 * Mobile shell — phone/tablet only presentation helpers.
 * Layout is locked by bridge; this file adds mobile chrome affordances.
 */
(function () {
  'use strict';
  document.documentElement.dataset.shell = 'm';
  window.__PAIDIA_SHELL__ = 'm';

  function enhance() {
    document.body.classList.add('shell-m', 'layout-mobile');
    document.body.classList.remove('layout-desktop');
    /* Switch-to-PC control in header tools if missing */
    if (!document.getElementById('shellSwitchPc')) {
      const tools = document.getElementById('topTools');
      if (tools) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'shellSwitchPc';
        btn.className = 'topbtn shell-switch';
        btn.textContent = 'PC';
        btn.title = 'Desktop-Ansicht';
        btn.onclick = () => {
          if (window.PaidiaShell) {
            window.PaidiaShell.setOverride('desk');
            window.PaidiaShell.go('desk');
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
