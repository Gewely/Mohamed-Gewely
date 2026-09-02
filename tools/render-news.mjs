/**
 * News listing pre-renderer.
 *
 * Reads the centralised content files under content/news/ and writes crawlable
 * markup into the locale pages between the news:start / news:end markers, plus
 * structured data between the news:jsonld markers. The JSON files stay the
 * single source of truth; the HTML shells (head, header, footer) stay
 * hand-editable and are never touched.
 *
 * Usage: node tools/render-news.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = [
  { data: 'content/news/news.en.json', page: 'en/news/index.html', intl: 'en-AE' },
  { data: 'content/news/news.ar.json', page: 'ar/news/index.html', intl: 'ar-AE' },
];

/* ------------------------------- helpers -------------------------------- */

const esc = (value) =>
  String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const fill = (template, values) =>
  String(template || '').replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match
  );

const byDateDesc = (a, b) => {
  if (a.publishedAt === b.publishedAt) return (a.priority || 0) - (b.priority || 0);
  return a.publishedAt < b.publishedAt ? 1 : -1;
};

const absolute = (baseUrl, path) =>
  String(baseUrl || '').replace(/\/$/, '') + String(path || '');

const ICON_SEARCH =
  '<svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>';

const ICON_CLOSE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>';

const ICON_ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M5 12h13M12 5l7 7-7 7"/></svg>';

/* -------------------------------- blocks -------------------------------- */

function media(article, ctx, { modifier = '', eager = false, sizes = '' } = {}) {
  const cls = ['media', modifier].filter(Boolean).join(' ');
  const image = article.image;

  if (!image || !image.src) {
    return `<figure class="${cls} media--empty"><span>${esc(ctx.ui.imageMissing)}</span></figure>`;
  }

  const focal = image.focal || { x: 50, y: 50 };
  const loading = eager ? 'eager' : 'lazy';
  const priority = eager ? ' fetchpriority="high"' : '';
  const sizeAttr = sizes ? ` sizes="${esc(sizes)}"` : '';

  return (
    `<figure class="${cls}">` +
    `<img src="${esc(image.src)}" alt="${esc(image.alt)}"` +
    ` width="${esc(image.width || 1600)}" height="${esc(image.height || 900)}"` +
    ` loading="${loading}" decoding="async"${priority}${sizeAttr}` +
    ` style="object-position:${Number(focal.x)}% ${Number(focal.y)}%">` +
    `</figure>`
  );
}

function metaLine(article, ctx) {
  return (
    '<p class="meta">' +
    `<span class="meta__cat">${esc(ctx.categoryLabel(article.category))}</span>` +
    '<span class="meta__sep" aria-hidden="true"></span>' +
    `<time datetime="${esc(article.publishedAt)}">${esc(ctx.formatDate(article.publishedAt))}</time>` +
    '</p>'
  );
}

function featuredBlock(article, ctx) {
  return (
    '<section class="section featuredSection" aria-labelledby="featuredHeading">' +
    '<div class="wrap">' +
    `<h2 id="featuredHeading" class="visuallyHidden">${esc(ctx.ui.featuredEyebrow)}</h2>` +
    '<article class="featured reveal">' +
    media(article, ctx, { eager: true, sizes: '(max-width:720px) 100vw, 60vw' }) +
    '<div class="featured__body">' +
    `<p class="sectionTag">${esc(ctx.ui.featuredEyebrow)}</p>` +
    metaLine(article, ctx) +
    `<h3 class="featured__title"><a class="cardLink" href="./${esc(article.slug)}/">${esc(article.title)}</a></h3>` +
    `<p class="featured__summary">${esc(article.summary)}</p>` +
    `<p class="featured__cta"><span class="pill red">${esc(ctx.ui.readStory)}</span></p>` +
    '</div>' +
    '</article>' +
    '</div>' +
    '</section>'
  );
}

const LATEST_VARIANTS = ['story--lead', 'story--side', 'story--side', 'story--half', 'story--half'];

function latestBlock(articles, ctx) {
  const cards = articles
    .map((article, index) => {
      const variant = LATEST_VARIANTS[index] || 'story--half';
      const lead = variant === 'story--lead';
      return (
        `<article class="story ${variant} reveal">` +
        media(article, ctx, { sizes: lead ? '(max-width:720px) 100vw, 55vw' : '(max-width:720px) 100vw, 40vw' }) +
        '<div class="story__body">' +
        metaLine(article, ctx) +
        `<h3 class="story__title"><a class="cardLink" href="./${esc(article.slug)}/"><span>${esc(article.title)}</span></a></h3>` +
        `<p class="story__summary">${esc(article.summary)}</p>` +
        '</div>' +
        '</article>'
      );
    })
    .join('');

  return (
    '<section class="section latestSection" aria-labelledby="latestHeading">' +
    '<div class="wrap">' +
    '<div class="sectionHead">' +
    '<div>' +
    `<p class="sectionTag">${esc(ctx.ui.latestEyebrow)}</p>` +
    `<h2 id="latestHeading" class="sectionTitle">${esc(ctx.ui.latestTitle)}</h2>` +
    '</div>' +
    '</div>' +
    `<div class="latestGrid">${cards}</div>` +
    '</div>' +
    '</section>'
  );
}

function archiveBlock(articles, ctx) {
  const rows = articles
    .map((article, index) => {
      const haystack = [
        article.title,
        article.summary,
        ctx.categoryLabel(article.category),
        (article.tags || []).join(' '),
      ]
        .filter(Boolean)
        .join(' ');

      return (
        `<li class="archiveItem" data-category="${esc(article.category)}"` +
        ` data-date="${esc(article.publishedAt)}" data-index="${index}"` +
        ` data-search="${esc(haystack)}">` +
        `<div class="archiveItem__thumb">${media(article, ctx, { sizes: '132px' })}</div>` +
        '<p class="archiveItem__date">' +
        `<span class="meta__cat">${esc(ctx.categoryLabel(article.category))}</span>` +
        `<time datetime="${esc(article.publishedAt)}">${esc(ctx.formatDate(article.publishedAt))}</time>` +
        '</p>' +
        `<h3 class="archiveItem__title"><a class="cardLink" href="./${esc(article.slug)}/">${esc(article.title)}</a></h3>` +
        `<span class="archiveItem__go" aria-hidden="true">${ICON_ARROW}</span>` +
        '</li>'
      );
    })
    .join('');

  const total = articles.length;

  return (
    '<section class="section archiveSection" aria-labelledby="archiveHeading">' +
    '<div class="wrap">' +
    '<div class="sectionHead">' +
    '<div>' +
    `<p class="sectionTag">${esc(ctx.ui.archiveEyebrow)}</p>` +
    `<h2 id="archiveHeading" class="sectionTitle">${esc(ctx.ui.archiveTitle)}</h2>` +
    '</div>' +
    `<p class="sectionCount" data-count data-template="${esc(ctx.ui.archiveCount)}">` +
    `${esc(fill(ctx.ui.archiveCount, { count: total }))}</p>` +
    '</div>' +
    `<ol class="archiveList" data-archive>${rows}</ol>` +
    '<div class="moreBar js-only" data-more-bar>' +
    `<p class="moreBar__status" data-more-status data-template="${esc(ctx.ui.loadMoreRemaining)}"></p>` +
    `<button type="button" class="pill red" data-load-more>${esc(ctx.ui.loadMore)}</button>` +
    '</div>' +
    `<p class="visuallyHidden" role="status" aria-live="polite" data-live data-template="${esc(ctx.ui.resultsAnnouncement)}"></p>` +
    '</div>' +
    '</section>' +
    '<section class="noResults" data-no-results aria-labelledby="noResultsHeading">' +
    '<div class="wrap">' +
    `<h2 id="noResultsHeading">${esc(ctx.ui.noResultsTitle)}</h2>` +
    `<p>${esc(ctx.ui.noResultsText)}</p>` +
    `<button type="button" class="pill red" data-reset>${esc(ctx.ui.noResultsReset)}</button>` +
    '</div>' +
    '</section>'
  );
}

function headBlock(page, ctx) {
  const crumbs = page.breadcrumb
    .map((crumb, index) => {
      const last = index === page.breadcrumb.length - 1;
      return last
        ? `<li><a href="${esc(crumb.href)}" aria-current="page">${esc(crumb.label)}</a></li>`
        : `<li><a href="${esc(crumb.href)}">${esc(crumb.label)}</a></li>`;
    })
    .join('');

  return (
    '<div class="pageHead">' +
    '<div class="wrap">' +
    `<nav class="crumbs" aria-label="${esc(ctx.ui.breadcrumbLabel)}"><ol>${crumbs}</ol></nav>` +
    `<h1>${esc(page.title)}</h1>` +
    `<p class="pageHead__intro">${esc(page.intro)}</p>` +
    '</div>' +
    '</div>'
  );
}

function toolbarBlock(categories, ctx) {
  const filters = categories
    .map(
      (category, index) =>
        `<button type="button" class="pill" data-category="${esc(category.id)}"` +
        ` aria-pressed="${index === 0 ? 'true' : 'false'}">${esc(category.label)}</button>`
    )
    .join('');

  return (
    '<div class="toolbar">' +
    '<div class="wrap toolbar__inner">' +
    '<form class="search" role="search" action="./" method="get">' +
    ICON_SEARCH +
    `<label class="visuallyHidden" for="newsSearch">${esc(ctx.ui.searchLabel)}</label>` +
    `<input id="newsSearch" name="q" type="search" data-search autocomplete="off"` +
    ` placeholder="${esc(ctx.ui.searchPlaceholder)}">` +
    `<button type="button" class="search__clear" data-search-clear` +
    ` aria-label="${esc(ctx.ui.searchClear)}">${ICON_CLOSE}</button>` +
    '</form>' +
    `<div class="filters" role="group" aria-label="${esc(ctx.ui.filtersLabel)}">${filters}</div>` +
    '</div>' +
    '</div>'
  );
}

/* ------------------------------ structured data -------------------------- */

function jsonLd(data, articles, ctx) {
  const base = data.site.baseUrl;

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: data.page.seo.title,
    description: data.page.seo.description,
    url: absolute(base, data.page.seo.canonical),
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absolute(base, article.seo.canonical),
      name: article.title,
    })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: data.page.breadcrumb.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: index === data.page.breadcrumb.length - 1 ? absolute(base, data.page.seo.canonical) : base + '/',
    })),
  };

  const featured = articles.find((article) => article.featured) || articles[0];
  const newsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: featured.title,
    description: featured.summary,
    inLanguage: data.page.language,
    datePublished: featured.publishedAt,
    url: absolute(base, featured.seo.canonical),
    mainEntityOfPage: absolute(base, featured.seo.canonical),
    articleSection: ctx.categoryLabel(featured.category),
    keywords: (featured.tags || []).join(', '),
    publisher: {
      '@type': 'Organization',
      name: data.site.name,
      logo: { '@type': 'ImageObject', url: absolute(base, '/' + data.site.publisherLogo) },
    },
  };

  return [itemList, breadcrumbs, newsArticle]
    .map(
      (node) =>
        '<script type="application/ld+json">' +
        JSON.stringify(node).replace(/</g, '\\u003c') +
        '</script>'
    )
    .join('\n    ');
}

/* -------------------------------- render -------------------------------- */

function replaceRegion(html, name, body, file) {
  const start = `<!-- ${name}:start -->`;
  const end = `<!-- ${name}:end -->`;
  const from = html.indexOf(start);
  const to = html.indexOf(end);

  if (from === -1 || to === -1 || to < from) {
    throw new Error(`Missing ${start} / ${end} markers in ${file}`);
  }

  return html.slice(0, from + start.length) + '\n' + body + '\n    ' + html.slice(to);
}

async function render(target) {
  const data = JSON.parse(await readFile(join(ROOT, target.data), 'utf8'));
  const pagePath = join(ROOT, target.page);
  let html = await readFile(pagePath, 'utf8');

  const labels = new Map(data.categories.map((category) => [category.id, category.label]));
  const dateFormatter = new Intl.DateTimeFormat(target.intl, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const ctx = {
    ui: data.page.ui,
    categoryLabel: (id) => labels.get(id) || id,
    formatDate: (value) => dateFormatter.format(new Date(value + 'T00:00:00Z')),
  };

  const sorted = data.articles.slice().sort(byDateDesc);
  const featured = sorted.find((article) => article.featured) || sorted[0];
  const latest = sorted.filter((article) => article !== featured).slice(0, 5);

  const main =
    `    <main id="main" data-news data-page-size="${esc(data.page.pageSize)}"` +
    ` data-image-missing="${esc(data.page.ui.imageMissing)}">\n      ` +
    headBlock(data.page, ctx) +
    toolbarBlock(data.categories, ctx) +
    featuredBlock(featured, ctx) +
    latestBlock(latest, ctx) +
    archiveBlock(sorted, ctx) +
    '\n    </main>';

  html = replaceRegion(html, 'news', main, target.page);
  html = replaceRegion(html, 'news:jsonld', '    ' + jsonLd(data, sorted, ctx), target.page);

  await writeFile(pagePath, html, 'utf8');
  return `${target.page} — ${sorted.length} articles (featured: ${featured.slug})`;
}

for (const target of TARGETS) {
  console.log(await render(target));
}
