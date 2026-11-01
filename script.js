/* Akshit Joshi portfolio — small, dependency-free interactions. */
(() => {
  'use strict';

  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();

  const progress = document.getElementById('readingProgress');
  let progressQueued = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (max <= 0 ? 0 : Math.max(0, Math.min(100, window.scrollY / max * 100))) + '%';
    progressQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!progressQueued) {
      progressQueued = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, {passive: true});
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const menu = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  function setMenu(open) {
    if (!menu || !mobileNav) return;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !open;
    menu.classList.toggle('is-open', open);
  }
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 850) setMenu(false); });

  const filters = document.querySelectorAll('.filter-chip');
  const grid = document.getElementById('projectsGrid');
  filters.forEach(chip => chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    filters.forEach(item => {
      const active = item === chip;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    grid?.classList.toggle('is-filtered', filter !== 'all');
    grid?.querySelectorAll('.project-card').forEach(card => {
      card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter);
    });
  }));

  const projectDetails = {
    'fake-news': {
      label: '01 / MACHINE LEARNING + INFORMATION RETRIEVAL · 2026',
      title: 'Fake News Detection & Evidence Retrieval System',
      intro: 'A group project that goes beyond binary classification: identify potentially false articles, retrieve relevant evidence, and provide users with a way to inspect similar coverage.',
      metrics: [['96%', 'Accuracy on 9,390 held-out test articles'], ['0.96', 'Macro-F1 on the held-out test set'], ['62K+', 'Articles in the retrieval corpus'], ['BM25', 'Evidence retrieval ranking method']],
      sections: [
        {title: 'What I built', items: [
          'Built TF-IDF features and compared Linear SVM with Naive Bayes and Logistic Regression using validation macro-F1; selected Linear SVM.',
          'Engineered BM25-based retrieval over a corpus of more than 62,000 articles to find closely related stories.',
          'Used n-gram overlap verification to determine whether an article was present in the indexed corpus.',
          'Added a Google News RSS and BeautifulSoup-based fallback for retrieving external coverage when the article was not in the local collection.',
          'Delivered the complete workflow in an interactive Flask web application.'
        ]},
        {title: 'The key idea', items: ['A model prediction is more useful when users can also see related sources. Combining classification and retrieval makes the result easier to investigate.']}
      ],
      stack: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TF-IDF', 'Linear SVM', 'BM25', 'Flask', 'BeautifulSoup', 'HTML', 'CSS']
    },
    influencer: {
      label: '02 / DATA ENGINEERING + ANALYTICS · 2023—2026',
      title: 'Influencer Marketing & Sponsorship Analytics Platform',
      intro: 'An end-to-end, role-based application for sponsors, influencers, and admins, supported by event publishing, data transformations, backend analytics, and a Power BI reporting layer.',
      metrics: [['100K+', 'Synthetic raw records processed'], ['05', 'Pages designed in Power BI'], ['60 sec', 'Analytics Redis cache TTL'], ['Bronze → Gold', 'Microsoft Fabric medallion architecture']],
      sections: [
        {title: 'Platform and engineering', items: [
          'Developed FastAPI and PostgreSQL workflows for campaign management, collaboration requests, negotiation, and role-specific analytics.',
          'Published ad-request events using Apache Kafka and tested event validation and deduplication with Spark Structured Streaming.',
          'Processed more than 100,000 synthetic raw records with PySpark in Microsoft Fabric, including Silver transformations and Gold star-schema tables.',
          'Orchestrated notebook execution with failure handling and built analytics API caching using Redis with a 60-second TTL and invalidation after updates.',
          'Configured Docker Compose for Redis and environment-based service integration for local development.'
        ]},
        {title: 'Analytics layer', items: [
          'Designed a five-page Power BI report over Gold-layer fact and dimension tables, using DAX KPIs and interactive sponsor, influencer, campaign, and financial filters.'
        ]}
      ],
      stack: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Apache Kafka', 'PySpark', 'Microsoft Fabric', 'Redis', 'Docker', 'Power BI', 'DAX']
    },
    setu: {
      label: '03 / NATURAL LANGUAGE PROCESSING · 2026—PRESENT',
      title: 'Setu — French-to-Hindi Semantic Translation Pipeline',
      intro: 'An ongoing language project combining neural translation with a curated idiom/proverb lookup and custom sentiment scoring, focused on preserving meaning beyond literal words.',
      metrics: [['~2,960', 'French idiom/proverb ↔ Hindi pairs curated'], ['100', 'Pairs manually verified so far'], ['NLLB', 'Neural machine translation model'], ['FR → HI', 'Translation direction']],
      sections: [
        {title: 'How it works', items: [
          'Built a French-to-Hindi pipeline around a local NLLB model from Hugging Face Transformers.',
          'Added an opt-in CSV lookup stage that is activated when input text is explicitly italicized and quoted, returning verified translations for idioms and proverbs.',
          'Curated approximately 2,960 French-to-Hindi idiom and proverb pairs; 100 have been manually verified so far for translation and sentiment accuracy.',
          'Designed a rule-based sentiment scorer using a bilingual French-Hindi lexicon, negation handling, and blended sentence/idiom scores for paragraph analysis.'
        ]},
        {title: 'Current status', items: ['This project is ongoing. The manually verified subset is smaller than the complete curated dataset; the two figures are deliberately not treated as equivalent.']}
      ],
      stack: ['Python', 'FastAPI', 'NLLB', 'Hugging Face Transformers', 'SQL', 'NLP', 'Rule-based Sentiment']
    }
  };

  const dialog = document.getElementById('caseDialog');
  const dialogContent = document.getElementById('dialogContent');
  const dialogClose = document.getElementById('dialogClose');
  function createCaseMarkup(project) {
    return `<span class="dialog-kicker">${project.label}</span>
      <h2 id="dialogTitle">${project.title}</h2>
      <p class="dialog-lede">${project.intro}</p>
      <div class="dialog-metrics">${project.metrics.map(([value, label]) => `<div class="dialog-metric"><strong>${value}</strong><span>${label}</span></div>`).join('')}</div>
      ${project.sections.map(section => `<section class="dialog-section"><h3>${section.title}</h3><ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul></section>`).join('')}
      <section class="dialog-section"><h3>Technology stack</h3><div class="dialog-technology">${project.stack.map(tech => `<span>${tech}</span>`).join('')}</div></section>
      <div class="dialog-footer"><a href="mailto:akshitjoshi101@gmail.com?subject=Question%20about%20your%20portfolio%20project">Discuss this project ↗</a><button type="button" data-close-dialog>Close</button></div>`;
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const detail = projectDetails[button.dataset.project];
    if (!detail || !dialog || !dialogContent) return;
    dialogContent.innerHTML = createCaseMarkup(detail);
    dialog.showModal();
    dialogClose?.focus();
  }));
  dialogClose?.addEventListener('click', () => dialog?.close());
  dialogContent?.addEventListener('click', event => {
    if (event.target.closest('[data-close-dialog]')) dialog?.close();
  });
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  const email = 'akshitjoshi101@gmail.com';
  const copyButton = document.getElementById('copyEmail');
  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2500);
  }
  copyButton?.addEventListener('click', async () => {
    let succeeded = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        succeeded = true;
      } else {
        const temporary = document.createElement('textarea');
        temporary.value = email;
        temporary.style.position = 'fixed';
        temporary.style.opacity = '0';
        document.body.appendChild(temporary);
        temporary.select();
        succeeded = document.execCommand('copy');
        temporary.remove();
      }
    } catch (error) { succeeded = false; }
    showToast(succeeded ? 'Email copied to clipboard' : `Email: ${email}`);
  });
})();
