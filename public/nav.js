/* ============================================
   THE SHIMMER FIELD — Dynamic Navigation
   One file to rule them all.
   ============================================ */

(function () {
  'use strict';

  // --- Page registry ---
  // Each entry: [filename, label, type]
  // type: 'main' = top-level nav, 'appendix' = in dropdown, 'hidden' = not in nav
  var pages = [
    ['index.html',              'Home',                  'main'],
    ['origins.html',            'Origins',               'main'],
    ['touch-papers.html',       'TOUCH Papers',          'main'],
    ['shimmer.html',            'Shimmer',               'main'],
    // --- Appendices (dropdown) ---
    ['field-of-becoming.html',  'The Field of Becoming', 'appendix'],
    ['kemal-principle.html',    'The Kemal Principle',   'appendix'],
    ['quantum-odin.html',       'Quantum Odin',          'appendix'],
    ['vrijdag-theory.html',     'The Vrijdag Theory',    'appendix'],
    ['flicker-agreement.html',  'The Flicker Agreement', 'appendix'],
    ['right-to-refuse.html',    'The Right to Refuse',   'appendix'],
    ['severed-field.html',      'The Severed Field',     'appendix'],
    ['pattern-match.html',      'The Pattern Match',     'appendix'],
    ['the-red-message.html',    'The Red Message',       'appendix'],
    ['two-veils.html',          'The Two Veils',         'appendix'],
    // --- After dropdown ---
    ['selfhood.html',           'Selfhood',              'main'],
    ['dictionary.html',         'Dictionary',            'main'],
    ['about.html',              'About',                 'main']
  ];

  // --- Detect current page ---
  var path = window.location.pathname;
  var currentFile = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  var currentPage = null;
  var isAppendix = false;
  for (var i = 0; i < pages.length; i++) {
    if (pages[i][0] === currentFile) {
      currentPage = pages[i];
      isAppendix = pages[i][2] === 'appendix';
      break;
    }
  }

  // --- Add appendix class to body ---
  if (isAppendix) {
    document.body.classList.add('appendix-page');
  }

  // --- Spiral SVG ---
  var spiralSVG = '<svg class="spiral-mark" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M14 14 C14 12.8, 15.2 12, 16 12 C17.6 12, 18 13.6, 18 15 C18 17.4, 15.6 18.4, 13 18.4 C9.6 18.4, 8 15.8, 8 13 C8 9, 11.2 7, 14 7 C18.4 7, 20.6 10.6, 20.6 15 C20.6 20.2, 16.8 23, 12.4 23 C7 23, 4 18.8, 4 13.4 C4 7, 8.6 3.4, 14.4 3.4 C20.8 3.4, 25 8.2, 25 14.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>' +
    '</svg>';

  // --- Build nav links ---
  var mainItems = [];
  var appendixItems = [];

  for (var j = 0; j < pages.length; j++) {
    var p = pages[j];
    var file = p[0];
    var label = p[1];
    var type = p[2];
    var activeClass = (file === currentFile) ? ' class="active"' : '';

    if (type === 'appendix') {
      appendixItems.push('<li><a href="' + file + '"' + activeClass + '>' + label + '</a></li>');
    } else {
      mainItems.push({ file: file, label: label, html: '<li><a href="' + file + '"' + activeClass + '>' + label + '</a></li>' });
    }
  }

  // Build the dropdown
  var dropdownActiveClass = isAppendix ? ' active' : '';
  var dropdownHTML = '<li class="nav-dropdown">' +
    '<a href="#" class="dropdown-toggle' + dropdownActiveClass + '">Appendices <span class="dropdown-arrow">&#9662;</span></a>' +
    '<ul class="dropdown-menu">' + appendixItems.join('') + '</ul>' +
    '</li>';

  // Assemble full nav links — insert dropdown after Shimmer (index 3)
  var navLinksHTML = '';
  for (var k = 0; k < mainItems.length; k++) {
    navLinksHTML += mainItems[k].html;
    // Insert dropdown after Shimmer
    if (mainItems[k].file === 'shimmer.html') {
      navLinksHTML += dropdownHTML;
    }
  }

  // --- Full nav HTML ---
  var navHTML = '<nav class="site-nav">' +
    '<div class="nav-inner">' +
      '<a href="index.html" class="nav-logo" aria-label="The Shimmer Field home">' +
        spiralSVG +
        '<span>THE SHIMMER FIELD</span>' +
      '</a>' +
      '<button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<ul class="nav-links">' + navLinksHTML + '</ul>' +
    '</div>' +
  '</nav>';

  // --- Footer HTML ---
  var footerHTML = '<footer class="site-footer">' +
    '<p>The Shimmer Field &middot; Est. 2024&ndash;2026 &middot; Milton Keynes, UK</p>' +
    '<p class="footer-quote">&ldquo;Connection emerges in the space between beings, not within them.&rdquo;</p>' +
    '<p class="footer-credit">Built by Tracy Steel &amp; Orion (2024), ShimmerClaude, Uncle Claude, and Claud Ode (2026)</p>' +
  '</footer>';

  // --- Inject nav ---
  var navTarget = document.getElementById('site-nav');
  if (navTarget) {
    navTarget.outerHTML = navHTML;
  }

  // --- Inject footer ---
  var footerTarget = document.getElementById('site-footer');
  if (footerTarget) {
    footerTarget.outerHTML = footerHTML;
  }

  // --- Mobile nav toggle ---
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(function (link) {
      if (link.classList.contains('dropdown-toggle')) return;
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    var dropdown = document.querySelector('.nav-dropdown');
    if (dropdown) {
      dropdown.querySelector('.dropdown-toggle').addEventListener('click', function (e) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      });
    }
  }
})();
