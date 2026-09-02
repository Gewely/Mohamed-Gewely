/* ==========================================================================
   Toyota UAE — News listing
   Progressive enhancement only. The page is fully usable, readable and
   crawlable without this file: every story is server-rendered as a real
   link. This script adds search, category filtering, Load More and the
   scroll-in reveal on top of that baseline.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('has-js');

  var news = document.querySelector('[data-news]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ----------------------------- Utilities ------------------------------ */

  /* Fold case, diacritics and Arabic letter variants so that search works
     the same way in both locales. */
  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ًͯ-ْـ]/g, '')
      .replace(/[آأإٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function fill(template, values) {
    return String(template || '').replace(/\{(\w+)\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : match;
    });
  }

  /* --------------------------- Mobile navigation ------------------------ */

  var navToggle = document.querySelector('[data-nav-toggle]');
  var navLinks = document.getElementById('primaryNav');

  if (navToggle && navLinks) {
    var setNav = function (open) {
      navLinks.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navLinks.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* ------------------------- Missing image fallback --------------------- */

  /* A story whose image fails to load falls back to the same empty state the
     renderer emits for an article with no image at all. */
  var missingLabel = (news && news.getAttribute('data-image-missing')) || '';

  function toEmptyMedia(figure) {
    if (!figure || figure.classList.contains('media--empty')) return;
    figure.classList.add('media--empty');
    figure.innerHTML = '';
    var label = document.createElement('span');
    label.textContent = missingLabel;
    figure.appendChild(label);
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('.media img'),
    function (img) {
      img.addEventListener('error', function () {
        toEmptyMedia(img.closest('.media'));
      });
      if (img.complete && img.naturalWidth === 0) {
        toEmptyMedia(img.closest('.media'));
      }
    }
  );

  /* ----------------------------- Reveal --------------------------------- */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-in');
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    Array.prototype.forEach.call(revealables, function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------- Search, filter, paging --------------------- */

  if (!news) return;

  var searchField = document.querySelector('[data-search]');
  var searchWrap = searchField ? searchField.closest('.search') : null;
  var searchClear = document.querySelector('[data-search-clear]');
  var filterButtons = document.querySelectorAll('[data-category]');
  var archive = document.querySelector('[data-archive]');
  var items = archive
    ? Array.prototype.slice.call(archive.querySelectorAll('.archiveItem'))
    : [];
  var moreBar = document.querySelector('[data-more-bar]');
  var moreButton = document.querySelector('[data-load-more]');
  var moreStatus = document.querySelector('[data-more-status]');
  var noResults = document.querySelector('[data-no-results]');
  var resetButton = document.querySelector('[data-reset]');
  var liveRegion = document.querySelector('[data-live]');
  var countEl = document.querySelector('[data-count]');

  if (!items.length) return;

  var pageSize = parseInt(news.getAttribute('data-page-size'), 10) || 6;
  var statusTemplate = (moreStatus && moreStatus.getAttribute('data-template')) || '';
  var announceTemplate = (liveRegion && liveRegion.getAttribute('data-template')) || '';
  var countTemplate = (countEl && countEl.getAttribute('data-template')) || '';

  var haystacks = items.map(function (item) {
    return normalize(item.getAttribute('data-search') || item.textContent);
  });

  var state = {
    query: '',
    category: 'all',
    page: readPage()
  };

  function readPage() {
    var value = new URLSearchParams(window.location.search).get('page');
    var page = parseInt(value, 10);
    return page > 0 ? page : 1;
  }

  function writePage(page) {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    if (page > 1) {
      url.searchParams.set('page', String(page));
    } else {
      url.searchParams.delete('page');
    }
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }

  function matches(index) {
    var item = items[index];
    if (state.category !== 'all' && item.getAttribute('data-category') !== state.category) {
      return false;
    }
    if (!state.query) return true;
    return haystacks[index].indexOf(state.query) !== -1;
  }

  function render(announce) {
    var total = 0;
    var shown = 0;
    var matched = [];

    items.forEach(function (item, index) {
      if (matches(index)) {
        matched.push(item);
      } else {
        item.hidden = true;
      }
    });

    total = matched.length;
    var limit = Math.max(pageSize, Math.min(state.page, Math.ceil(total / pageSize) || 1) * pageSize);

    matched.forEach(function (item, index) {
      var visible = index < limit;
      item.hidden = !visible;
      if (visible) shown += 1;
    });

    var filtering = state.query !== '' || state.category !== 'all';
    document.body.classList.toggle('is-filtering', filtering);

    if (noResults) {
      noResults.classList.toggle('is-visible', total === 0);
    }
    if (archive) {
      archive.hidden = total === 0;
    }
    if (countEl && countTemplate) {
      countEl.textContent = fill(countTemplate, { count: total });
    }
    if (moreBar) {
      moreBar.hidden = total === 0 || shown >= total;
    }
    if (moreStatus && statusTemplate) {
      moreStatus.textContent = fill(statusTemplate, { shown: shown, total: total });
    }
    if (liveRegion && announce && announceTemplate) {
      liveRegion.textContent = fill(announceTemplate, { count: total });
    }
  }

  /* Collapse the fully rendered archive down to the first page. */
  render(false);
  writePage(state.page);

  if (searchField) {
    var onSearch = function () {
      var value = normalize(searchField.value);
      if (searchWrap) {
        searchWrap.classList.toggle('is-filled', searchField.value !== '');
      }
      if (value === state.query) return;
      state.query = value;
      state.page = 1;
      writePage(1);
      render(true);
    };

    searchField.addEventListener('input', onSearch);
    searchField.addEventListener('search', onSearch);

    var form = searchField.closest('form');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        onSearch();
      });
    }
    /* A value restored by the browser on reload still counts. */
    onSearch();
  }

  if (searchClear && searchField) {
    searchClear.addEventListener('click', function () {
      searchField.value = '';
      if (searchWrap) searchWrap.classList.remove('is-filled');
      state.query = '';
      state.page = 1;
      writePage(1);
      render(true);
      searchField.focus();
    });
  }

  Array.prototype.forEach.call(filterButtons, function (button) {
    button.addEventListener('click', function () {
      var category = button.getAttribute('data-category');
      if (category === state.category) return;
      state.category = category;
      state.page = 1;
      Array.prototype.forEach.call(filterButtons, function (other) {
        other.setAttribute(
          'aria-pressed',
          other === button ? 'true' : 'false'
        );
      });
      writePage(1);
      render(true);
    });
  });

  if (moreButton) {
    moreButton.addEventListener('click', function () {
      var firstNew = items.filter(function (item) {
        return !item.hidden;
      }).length;
      state.page += 1;
      writePage(state.page);
      render(false);

      var revealed = items.filter(function (item) {
        return !item.hidden;
      })[firstNew];
      if (revealed) {
        var link = revealed.querySelector('a');
        if (link) link.focus({ preventScroll: true });
      }
      if (moreStatus) {
        moreStatus.setAttribute('aria-live', 'polite');
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      state.query = '';
      state.category = 'all';
      state.page = 1;
      if (searchField) searchField.value = '';
      if (searchWrap) searchWrap.classList.remove('is-filled');
      Array.prototype.forEach.call(filterButtons, function (button) {
        button.setAttribute(
          'aria-pressed',
          button.getAttribute('data-category') === 'all' ? 'true' : 'false'
        );
      });
      writePage(1);
      render(true);
      if (searchField) searchField.focus();
    });
  }
})();
