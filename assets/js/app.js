(function () {
  const { categories, libraryEpisodes, teamMembers } = window.AppData;

  const state = {
    podcasts: libraryEpisodes.map((podcast) => ({
      ...podcast,
      tags: [...(podcast.tags || [])],
      cover: podcast.cover ? { ...podcast.cover } : null
    })),
    current: null,
    currentKind: 'episode',
    db: null,
    aiDraft: null,
    aiIsSpeaking: false,
    aiIsPaused: false,
    uploadObjectUrls: new Set()
  };

  const els = {
    homePage: document.getElementById('homePage'),
    aiPage: document.getElementById('aiPage'),
    aboutPage: document.getElementById('aboutPage'),
    heroRow: document.getElementById('heroRow'),
    librarySections: document.getElementById('librarySections'),
    teamGrid: document.getElementById('teamGrid'),
    searchInput: document.getElementById('searchInput'),
    aboutBtn: document.getElementById('aboutBtn'),
    aboutBackBtn: document.getElementById('aboutBackBtn'),
    addBtn: document.getElementById('addBtn'),
    aiOpenBtn: document.getElementById('aiOpenBtn'),
    aiBackBtn: document.getElementById('aiBackBtn'),
    aiPrompt: document.getElementById('aiPrompt'),
    aiGenerateBtn: document.getElementById('aiGenerateBtn'),
    aiClearBtn: document.getElementById('aiClearBtn'),
    aiOutput: document.getElementById('aiOutput'),
    detailModal: document.getElementById('detailModal'),
    closeDetailBtn: document.getElementById('closeDetailBtn'),
    detailCloseBtn: document.getElementById('detailCloseBtn'),
    detailPlayBtn: document.getElementById('detailPlayBtn'),
    detailCover: document.getElementById('detailCover'),
    detailTitle: document.getElementById('detailTitle'),
    detailDesc: document.getElementById('detailDesc'),
    detailMeta: document.getElementById('detailMeta'),
    detailTags: document.getElementById('detailTags'),
    miniCover: document.getElementById('miniCover'),
    miniTitle: document.getElementById('miniTitle'),
    miniMeta: document.getElementById('miniMeta'),
    miniPlayPauseBtn: document.getElementById('miniPlayPauseBtn'),
    miniStopBtn: document.getElementById('miniStopBtn'),
    audioPlayer: document.getElementById('audioPlayer'),
    addModal: document.getElementById('addModal'),
    closeAddBtn: document.getElementById('closeAddBtn'),
    cancelUploadBtn: document.getElementById('cancelUploadBtn'),
    saveUploadBtn: document.getElementById('saveUploadBtn'),
    uploadFile: document.getElementById('uploadFile'),
    uploadTitle: document.getElementById('uploadTitle'),
    uploadCategory: document.getElementById('uploadCategory'),
    uploadDuration: document.getElementById('uploadDuration'),
    uploadTags: document.getElementById('uploadTags'),
    uploadDescription: document.getElementById('uploadDescription')
  };

  const TEAM_PLACEHOLDER_COPY = 'Add a portrait to the about_us folder and update this card when the final team info is ready.';

  const THEME_BLUEPRINTS = {
    general: {
      label: 'General',
      lens: ['the structure behind the topic', 'the logic that makes the topic work', 'the bigger idea underneath the surface'],
      everyday: [
        'normal conversations, schoolwork, and the way people make sense of unfamiliar ideas',
        'everyday decisions, practical examples, and simple comparisons that make the idea feel real',
        'the situations where people need to explain, compare, or understand something clearly'
      ],
      misconception: [
        'People often assume the topic is either too simple to matter or too complex to explain clearly, but usually the real challenge is just organizing the idea properly.',
        'A common mistake is treating the topic like a single fact instead of a system of connected parts.',
        'It can sound abstract at first, but once the moving parts are named, it becomes much easier to follow.'
      ],
      mechanics: [
        'the definition, the context, and the result',
        'what it is, how it behaves, and why people care about it',
        'the core idea, the example, and the takeaway'
      ],
      impact: [
        'how people understand the world, make decisions, and explain things to each other',
        'the way information gets interpreted and turned into action',
        'why clear understanding matters before people form opinions or make choices'
      ],
      closing: [
        'The useful takeaway is that understanding the structure of the topic is often more important than memorizing a one-line definition.',
        'Once the topic is broken into clear steps, it stops feeling vague and starts feeling useful.',
        'That is usually the moment when the topic shifts from sounding difficult to sounding interesting.'
      ]
    },
    technology: {
      label: 'Technology',
      lens: ['systems, inputs, and outputs', 'the connection between software, devices, and people', 'how information turns into action'],
      everyday: [
        'phones, apps, websites, and the invisible systems people depend on every day',
        'the tools people use constantly without always thinking about what is happening underneath',
        'search, messaging, streaming, and the small automated decisions built into modern devices'
      ],
      misconception: [
        'A lot of people talk about technology like it is magic, when most of it is a chain of understandable steps and design choices.',
        'It is easy to focus only on shiny gadgets, but the deeper story is about systems and the information flowing through them.',
        'People often think the topic matters only to experts, even though it shapes basic daily habits for almost everyone.'
      ],
      mechanics: [
        'the input, the process, and the output',
        'the data, the rules, and the result',
        'what the system receives, how it handles it, and what happens next'
      ],
      impact: [
        'speed, convenience, automation, and the tradeoffs built into digital life',
        'how people communicate, find information, and trust the tools around them',
        'privacy, reliability, and the way small design decisions affect millions of users'
      ],
      closing: [
        'That is why the topic matters: it is not just a buzzword, it is part of how modern life actually runs.',
        'The clearer you see the system, the less mysterious the technology feels.',
        'Once the process is visible, the topic becomes much easier to evaluate instead of just admire.'
      ]
    },
    science: {
      label: 'Science',
      lens: ['observation, explanation, and evidence', 'patterns in the natural world', 'how causes lead to visible effects'],
      everyday: [
        'health, weather, motion, space, and the hidden processes that affect daily life',
        'the body, the sky, and the ordinary questions people ask when they notice patterns',
        'real-world examples where a scientific explanation makes confusing things easier to understand'
      ],
      misconception: [
        'People sometimes treat science like memorizing facts, but the real skill is asking what causes something and how we know the answer.',
        'A scientific topic can sound intimidating until you connect it to evidence, observation, and one concrete example.',
        'The topic usually feels harder than it is because people hear the vocabulary before they hear the logic.'
      ],
      mechanics: [
        'the observation, the explanation, and the real-world effect',
        'what is happening, why it happens, and what that means in practice',
        'the cause, the mechanism, and the outcome'
      ],
      impact: [
        'health, safety, prediction, and the way people make sense of the world around them',
        'how we interpret evidence and apply it to real situations',
        'why scientific understanding changes what people believe and how they act'
      ],
      closing: [
        'That is the strength of science-focused topics: once the cause-and-effect chain is clear, the whole idea becomes more intuitive.',
        'The big win is not just learning the fact, but learning the reasoning behind it.',
        'When the process makes sense, the topic stops feeling like a mystery and starts feeling logical.'
      ]
    },
    geography: {
      label: 'Geography',
      lens: ['place, movement, and environment', 'how locations shape human activity', 'patterns across land, climate, and resources'],
      everyday: [
        'weather, cities, rivers, landforms, and the practical ways people respond to place',
        'maps, travel, climate, and the visible patterns people notice across different regions',
        'transport, resources, settlements, and why some places behave differently from others'
      ],
      misconception: [
        'A lot of people reduce geography to memorizing locations, but the real topic is how places connect and why those patterns matter.',
        'It can look like a list of names until you start asking what the land, water, and climate are doing.',
        'The topic gets more interesting once you stop thinking of it as a map quiz and start treating it like a living system.'
      ],
      mechanics: [
        'the physical setting, the human response, and the long-term effect',
        'the location, the process, and the pattern it creates',
        'the environment, the movement through it, and the result people experience'
      ],
      impact: [
        'how people build, travel, farm, plan, and respond to natural conditions',
        'why resources, risks, and opportunities are distributed unevenly across places',
        'how climate and landscape shape everyday life and major decisions'
      ],
      closing: [
        'That is what makes geography powerful: it explains why the world is connected instead of looking like isolated points on a map.',
        'Once you see the pattern, the topic becomes a story about relationships between places.',
        'The interesting part is not just where something is, but what that location changes.'
      ]
    },
    history: {
      label: 'History',
      lens: ['causes, turning points, and consequences', 'how decisions shape later events', 'what the present inherits from the past'],
      everyday: [
        'monuments, borders, traditions, and the stories societies keep carrying forward',
        'how people remember events and how those events still influence modern life',
        'the moments when one decision changes a larger chain of events'
      ],
      misconception: [
        'People often flatten history into dates and names, but the real value is understanding why events happened and what followed.',
        'The topic feels much richer once you start asking about motives, pressure, and consequence instead of just sequence.',
        'History is usually more understandable when it is treated like a chain of choices rather than a list to memorize.'
      ],
      mechanics: [
        'the background, the turning point, and the consequence',
        'the context, the decision, and the long-term result',
        'the pressures building up, the event itself, and the changes that followed'
      ],
      impact: [
        'how people interpret the present and understand why societies look the way they do',
        'why ideas, borders, institutions, and identities still carry traces of earlier events',
        'the lessons people draw when they look at success, failure, conflict, and change over time'
      ],
      closing: [
        'That is why history matters: it explains the present by showing what had to happen before it.',
        'Once the cause-and-effect chain is visible, the topic stops feeling distant and starts feeling relevant.',
        'The real lesson is usually not just what happened, but why the outcome still matters now.'
      ]
    }
  };

  function openPage(page) {
    const isAI = page === 'ai';
    const isAbout = page === 'about';

    document.body.classList.toggle('ai-mode', isAI);
    els.homePage.classList.toggle('active', !isAI && !isAbout);
    els.aiPage.classList.toggle('active', isAI);
    els.aboutPage.classList.toggle('active', isAbout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function normalizeText(str) {
    return String(str || '').trim().replace(/\s+/g, ' ');
  }

  function normalize(str) {
    return normalizeText(str).toLowerCase();
  }

  function wordsOnly(str) {
    return normalize(str).match(/[a-z0-9']+/g) || [];
  }

  function countWords(str) {
    return wordsOnly(str).length;
  }

  function formatDurationFromWords(words) {
    const totalSeconds = Math.max(60, Math.round((words / 145) * 60));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
  }

  function shortTags(tags) {
    return (tags || [])
      .slice(0, 4)
      .map((tag) => `<span class="chip">#${escapeHtml(tag)}</span>`)
      .join('');
  }

  function getCoverText(podcast) {
    return podcast.cover?.text
      || podcast.title
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();
  }

  function getCoverGradient(podcast) {
    return podcast.cover?.gradient || 'linear-gradient(135deg, #4b5563, #d1d5db)';
  }

  function getSource(podcast) {
    return podcast.objectUrl || podcast.file || '';
  }

  function hashString(str) {
    let hash = 2166136261;
    const input = String(str || '');

    for (let i = 0; i < input.length; i += 1) {
      hash ^= input.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  function createTopicPicker(seed) {
    return function pick(values, salt = 0) {
      if (!values.length) return '';
      const index = hashString(`${seed}:${salt}`) % values.length;
      return values[index];
    };
  }

  function extractKeywords(topic) {
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'for', 'with', 'into', 'from', 'that', 'this', 'these', 'those',
      'about', 'your', 'you', 'are', 'was', 'were', 'is', 'be', 'been', 'being', 'a', 'an', 'to',
      'of', 'in', 'on', 'at', 'as', 'by', 'it', 'its', 'we', 'they', 'them', 'their', 'our', 'my',
      'what', 'why', 'how', 'when', 'where', 'who', 'which', 'could', 'would', 'should', 'can',
      'do', 'does', 'did', 'just', 'really', 'very', 'more', 'most', 'much', 'many'
    ]);

    return [...new Set(wordsOnly(topic).filter((word) => word.length > 2 && !stopWords.has(word)))].slice(0, 5);
  }

  function detectTheme(topic, referenceEpisode) {
    if (referenceEpisode?.category) return normalize(referenceEpisode.category);

    const value = normalize(topic);

    if (/\b(ai|technology|tech|internet|computer|computers|software|app|apps|phone|smartphone|robot|robots|device|devices|data|coding|code|digital|network|networks)\b/.test(value)) {
      return 'technology';
    }
    if (/\b(science|space|planet|planets|star|stars|galaxy|galaxies|universe|black hole|black holes|biology|physics|chemistry|vaccine|vaccines|body|brain|dream|dreams|lab|experiment|experiments)\b/.test(value)) {
      return 'science';
    }
    if (/\b(geography|geo|country|countries|city|cities|desert|deserts|ocean|oceans|earthquake|earthquakes|climate|weather|mountain|mountains|river|rivers|map|maps|landscape|landscapes|terrain|dam|dams)\b/.test(value)) {
      return 'geography';
    }
    if (/\b(history|historic|ancient|rome|roman|empire|war|wars|revolution|revolutions|king|queen|civilization|civilisations|civilizations|taj mahal|india|medieval|dynasty|museum)\b/.test(value)) {
      return 'history';
    }

    return 'general';
  }

  function scoreReferenceEpisode(episode, cleanTopic, keywords) {
    const topic = normalize(cleanTopic);
    const title = normalize(episode.title);
    const description = normalize(episode.description);
    const tags = (episode.tags || []).map(normalize);
    const category = normalize(episode.category);

    let score = 0;

    if (title.includes(topic)) score += 20;
    if (description.includes(topic)) score += 10;
    if (category.includes(topic)) score += 6;

    keywords.forEach((keyword) => {
      if (title.includes(keyword)) score += 10;
      if (description.includes(keyword)) score += 6;
      if (category.includes(keyword)) score += 4;
      if (tags.some((tag) => tag.includes(keyword) || keyword.includes(tag))) score += 8;
    });

    return score;
  }

  function findReferenceEpisode(topic) {
    const cleanTopic = normalizeText(topic);
    const keywords = extractKeywords(cleanTopic);

    const rankedEpisodes = libraryEpisodes
      .map((episode) => ({
        episode,
        score: scoreReferenceEpisode(episode, cleanTopic, keywords)
      }))
      .sort((a, b) => b.score - a.score);

    return rankedEpisodes[0] && rankedEpisodes[0].score >= 12 ? rankedEpisodes[0].episode : null;
  }

  function lowerFirst(str) {
    const value = normalizeText(str);
    return value ? value.charAt(0).toLowerCase() + value.slice(1) : '';
  }

  function inferMediaKind(url) {
    const value = normalize(url);

    if (/\.(mp4|webm|mov|m4v|ogv)$/i.test(value)) return 'video';
    if (/\.(mp3|wav|ogg|m4a|aac)$/i.test(value)) return 'audio';

    return 'link';
  }

  function renderHeroCards() {
    els.heroRow.innerHTML = categories.map((category) => `
      <article
        class="hero-card"
        data-jump="${escapeHtml(category.id)}"
        role="button"
        tabindex="0"
        aria-label="Jump to ${escapeHtml(category.id)}"
        style="background:${category.gradient}; color:${category.accent};"
      >
        <div class="hero-copy">
          <div class="eyebrow">Featured</div>
          <h3>${escapeHtml(category.id)}</h3>
          <p>${escapeHtml(category.desc)}</p>
        </div>
        <div class="hero-chip">${escapeHtml(category.chip)}</div>
        <div class="hero-art">${escapeHtml(category.icon)}</div>
      </article>
    `).join('');

    els.heroRow.querySelectorAll('[data-jump]').forEach((card) => {
      const openSection = () => {
        const id = card.getAttribute('data-jump');
        const section = document.getElementById(`section-${id}`);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      card.addEventListener('click', openSection);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openSection();
        }
      });
    });
  }

  function podcastMatchesQuery(podcast, query) {
    const cleanQuery = normalize(query);
    if (!cleanQuery) return true;

    const haystack = normalize([
      podcast.title,
      podcast.category,
      podcast.description,
      ...(podcast.tags || [])
    ].join(' '));

    if (haystack.includes(cleanQuery)) return true;

    return cleanQuery.split(/\s+/).every((token) => haystack.includes(token));
  }

  function renderCardCover(podcast) {
    if (podcast.cover?.imageUrl) {
      return `<img src="${escapeHtml(podcast.cover.imageUrl)}" alt="${escapeHtml(podcast.title)} cover" class="cover-image" loading="lazy" />`;
    }

    return `<div class="cover-title">${escapeHtml(getCoverText(podcast))}</div>`;
  }

  function renderPodcastCard(podcast) {
    return `
      <article
        class="card-surface"
        data-open="${escapeHtml(podcast.id)}"
        role="button"
        tabindex="0"
        aria-label="Open details for ${escapeHtml(podcast.title)}"
      >
        <div class="cover" style="background:${getCoverGradient(podcast)};">
          ${renderCardCover(podcast)}
        </div>
        <div class="card-body">
          <div class="title-row">
            <h3 class="episode-title">${escapeHtml(podcast.title)}</h3>
            <div class="duration">${escapeHtml(podcast.duration)}</div>
          </div>
          <div class="meta">${escapeHtml(podcast.category)} · ${escapeHtml(podcast.description)}</div>
          <div class="chip-wrap">
            ${shortTags(podcast.tags)}
          </div>
        </div>
      </article>
    `;
  }

  function bindLibraryCards() {
    els.librarySections.querySelectorAll('[data-open]').forEach((card) => {
      const openCard = () => {
        const id = card.getAttribute('data-open');
        const podcast = state.podcasts.find((item) => item.id === id);
        if (podcast) openDetail(podcast);
      };

      card.addEventListener('click', openCard);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCard();
        }
      });
    });
  }

  function renderLibrary() {
    const query = els.searchInput.value;

    els.librarySections.innerHTML = categories.map((category) => {
      const items = state.podcasts.filter((podcast) => podcast.category === category.id && podcastMatchesQuery(podcast, query));
      const hidden = items.length === 0 ? 'hidden' : '';

      return `
        <section id="section-${category.id}" class="section ${hidden}">
          <div class="section-header">
            <div>
              <h2 class="section-title">${escapeHtml(category.id)}</h2>
              <p class="section-hint">${escapeHtml(category.desc)}</p>
            </div>
            <div class="chip">${items.length} episode${items.length === 1 ? '' : 's'}</div>
          </div>
          <div class="carousel">
            ${items.map(renderPodcastCard).join('')}
          </div>
        </section>
      `;
    }).join('');

    const visibleSections = [...els.librarySections.querySelectorAll('.section')].some((section) => !section.classList.contains('hidden'));
    if (!visibleSections) {
      els.librarySections.innerHTML = `
        <div class="empty">
          No episodes matched your search. Try a different title, tag, or category.
        </div>
      `;
      return;
    }

    bindLibraryCards();
  }

  function renderDetailCover(podcast) {
    if (podcast.cover?.imageUrl) {
      els.detailCover.innerHTML = `<img src="${escapeHtml(podcast.cover.imageUrl)}" alt="${escapeHtml(podcast.title)} cover" class="detail-cover-image" />`;
      els.detailCover.style.background = getCoverGradient(podcast);
      return;
    }

    els.detailCover.innerHTML = `<span>${escapeHtml(getCoverText(podcast))}</span>`;
    els.detailCover.style.background = getCoverGradient(podcast);
  }

  function renderMiniCover(podcast) {
    els.miniCover.style.background = getCoverGradient(podcast);

    if (podcast.cover?.imageUrl) {
      els.miniCover.innerHTML = `<img src="${escapeHtml(podcast.cover.imageUrl)}" alt="${escapeHtml(podcast.title)} cover" class="mini-cover-image" />`;
      return;
    }

    els.miniCover.textContent = getCoverText(podcast).slice(0, 4);
  }

  function openDetail(podcast) {
    state.current = podcast;

    els.detailTitle.textContent = podcast.title;
    els.detailDesc.textContent = podcast.description;
    els.detailMeta.innerHTML = `
      <span class="chip">${escapeHtml(podcast.category)}</span>
      <span class="chip">${escapeHtml(podcast.duration)}</span>
      <span class="chip">${podcast.objectUrl ? 'Uploaded locally' : 'Library episode'}</span>
    `;
    els.detailTags.innerHTML = (podcast.tags || [])
      .map((tag) => `<span class="chip">#${escapeHtml(tag)}</span>`)
      .join('');

    renderDetailCover(podcast);
    els.detailModal.classList.add('active');
    els.detailModal.setAttribute('aria-hidden', 'false');
  }

  function closeDetail() {
    els.detailModal.classList.remove('active');
    els.detailModal.setAttribute('aria-hidden', 'true');
  }

  function setMiniPlayer(podcast) {
    els.miniTitle.textContent = podcast.title;
    els.miniMeta.textContent = `${podcast.category} · ${podcast.duration}`;
    renderMiniCover(podcast);
    els.miniPlayPauseBtn.disabled = false;
    els.miniStopBtn.disabled = false;
  }

  function resetMiniPlayer() {
    els.miniTitle.textContent = 'Nothing playing';
    els.miniMeta.textContent = 'Choose an episode to send it here.';
    els.miniCover.style.background = 'linear-gradient(135deg, #7a7a7a, #d8d8d8)';
    els.miniCover.textContent = 'AI';
    els.miniPlayPauseBtn.disabled = true;
    els.miniStopBtn.disabled = true;
    els.miniPlayPauseBtn.textContent = '▶';
  }

  function stopEpisodePlayback() {
    els.audioPlayer.pause();
    els.audioPlayer.currentTime = 0;
    els.miniPlayPauseBtn.textContent = '▶';
  }

  function playPodcast(podcast) {
    const src = getSource(podcast);
    if (!src) return;

    stopAISpeech();
    state.currentKind = 'episode';
    state.aiDraft = null;
    state.current = podcast;

    setMiniPlayer(podcast);

    if (els.audioPlayer.src !== src) {
      els.audioPlayer.src = src;
    }

    els.audioPlayer.play()
      .then(() => {
        els.miniPlayPauseBtn.textContent = '⏸';
      })
      .catch(() => {
        els.miniPlayPauseBtn.textContent = '▶';
      });
  }

  function togglePlayPause() {
    if (!state.current) return;

    if (els.audioPlayer.paused) {
      els.audioPlayer.play().catch(() => {});
      els.miniPlayPauseBtn.textContent = '⏸';
      return;
    }

    els.audioPlayer.pause();
    els.miniPlayPauseBtn.textContent = '▶';
  }

  function getVoicesReady() {
    const synth = window.speechSynthesis;

    return new Promise((resolve) => {
      const voices = synth ? synth.getVoices() : [];
      if (voices && voices.length) {
        resolve(voices);
        return;
      }

      const timeout = setTimeout(() => resolve(synth ? synth.getVoices() : []), 1200);
      if (!synth) {
        clearTimeout(timeout);
        resolve([]);
        return;
      }

      synth.onvoiceschanged = () => {
        clearTimeout(timeout);
        resolve(synth.getVoices());
      };
    });
  }

  function scoreVoiceForRole(voice, role) {
    const name = normalize(voice.name);
    const lang = normalize(voice.lang);

    let score = 0;

    if (lang.startsWith('en')) score += 20;
    if (lang === 'en-us' || lang === 'en-gb' || lang === 'en-in' || lang === 'en-au') score += 10;
    if (voice.localService) score += 5;
    if (voice.default) score += 2;

    if (role === 'a') {
      if (/female|zira|samantha|victoria|karen|susan|tessa|allison|serena|eva|lisa|emma|nicky|jenny/.test(name)) score += 25;
      if (/male|daniel|david|fred|tom|mark|george|alex|james|matthew|raj|arjun|ravi/.test(name)) score += 2;
    } else {
      if (/male|daniel|david|fred|tom|mark|george|alex|james|matthew|raj|arjun|ravi/.test(name)) score += 25;
      if (/female|zira|samantha|victoria|karen|susan|tessa|allison|serena|eva|lisa|emma|nicky|jenny/.test(name)) score += 2;
    }

    return score;
  }

  function pickVoicePair(voices) {
    const englishVoices = voices.filter((voice) => normalize(voice.lang).startsWith('en'));
    const usableVoices = englishVoices.length ? englishVoices : voices;

    if (!usableVoices.length) return [null, null];

    const voiceA = [...usableVoices].sort((a, b) => scoreVoiceForRole(b, 'a') - scoreVoiceForRole(a, 'a'))[0] || usableVoices[0];
    const voiceB = [...usableVoices]
      .filter((voice) => voice.name !== voiceA.name)
      .sort((a, b) => scoreVoiceForRole(b, 'b') - scoreVoiceForRole(a, 'b'))[0]
      || usableVoices.find((voice) => voice.name !== voiceA.name)
      || voiceA;

    return [voiceA, voiceB];
  }

  function buildStudioDraft(topic) {
    const cleanTopic = normalizeText(topic);
    const pick = createTopicPicker(cleanTopic);
    const keywords = extractKeywords(cleanTopic);
    const referenceEpisode = findReferenceEpisode(cleanTopic);
    const theme = detectTheme(cleanTopic, referenceEpisode);
    const themeBlueprint = THEME_BLUEPRINTS[theme] || THEME_BLUEPRINTS.general;

    const focusOne = keywords[0] || cleanTopic;
    const focusTwo = keywords[1] || themeBlueprint.label.toLowerCase();
    const focusThree = keywords[2] || focusOne;
    const mechanicsFrame = pick(themeBlueprint.mechanics, 1);
    const everydayFrame = pick(themeBlueprint.everyday, 2);
    const misconceptionLine = pick(themeBlueprint.misconception, 3);
    const impactLine = pick(themeBlueprint.impact, 4);
    const closingLine = pick(themeBlueprint.closing, 5);
    const lensLine = pick(themeBlueprint.lens, 6);
    const speakerNames = pick([
      ['Host', 'Analyst'],
      ['Host', 'Co-host'],
      ['Narrator', 'Producer']
    ], 7);

    const referenceLine = referenceEpisode
      ? `A useful anchor here is the library episode "${referenceEpisode.title}", which already frames the topic as ${lowerFirst(referenceEpisode.description)}`
      : `Even without a perfect matching library episode, the topic becomes clearer once you connect the definition to one real situation.`;

    const exampleLine = referenceEpisode
      ? `That reference gives us a practical lens: focus on ${referenceEpisode.tags.slice(0, 2).join(' and ')}, because those clues show where the topic becomes concrete.`
      : `A simple way to picture it is to imagine ${focusOne} changing what people notice, decide, or build in a real setting.`;

    const questionsLine = pick([
      `The smartest first question is not "Can I memorize this?" but "What is changing, and why does that change matter?"`,
      `A better starting point is to ask what problem the topic solves, what forces shape it, and what result follows from it.`,
      `The quickest route into the topic is to identify the main pattern first and the details second.`
    ], 8);

    const connectiveLine = pick([
      `That is where ${cleanTopic} starts to feel bigger than one definition, because it connects to ${lensLine} and to ${everydayFrame}.`,
      `Once those pieces line up, ${cleanTopic} stops sounding isolated and starts to look like part of a wider system.`,
      `That wider context matters, because the topic almost never lives alone. It connects outward to other ideas, choices, and consequences.`
    ], 9);

    const recapLine = pick([
      `So the core picture is this: ${cleanTopic} makes the most sense when you track ${mechanicsFrame} instead of only memorizing labels.`,
      `The short summary is that ${cleanTopic} becomes easier once you move from surface description to underlying structure.`,
      `In plain language, the topic matters because it helps people see how a process works instead of just hearing its name.`
    ], 10);

    const outroLine = pick([
      'That wraps up today’s studio draft. Thanks for listening.',
      'That is the full quick take for today. Thanks for being here.',
      'That is all for this episode. See you in the next one.'
    ], 11);

    const segments = [
      {
        speaker: speakerNames[0],
        voice: 0,
        text: `Welcome back to AI Podcast Hub. Today we are unpacking ${cleanTopic}, and the best way to approach it is to treat it like a real idea with moving parts, not just a headline.`
      },
      {
        speaker: speakerNames[1],
        voice: 1,
        text: `${cleanTopic} is easier to follow when you break it into ${mechanicsFrame}. That simple structure keeps the explanation clear and gives us a path through the topic.`
      },
      {
        speaker: speakerNames[0],
        voice: 0,
        text: `${questionsLine} In this case, the lens is really about ${lensLine}, and that helps explain why the topic keeps showing up in ${everydayFrame}.`
      },
      {
        speaker: speakerNames[1],
        voice: 1,
        text: `${misconceptionLine} Once you stop treating it like a vague term, it becomes easier to identify what ${focusOne}, ${focusTwo}, and ${focusThree} are each contributing to the bigger picture.`
      },
      {
        speaker: speakerNames[0],
        voice: 0,
        text: `${referenceLine} ${exampleLine}`
      },
      {
        speaker: speakerNames[1],
        voice: 1,
        text: `Why does any of this matter? Because the topic influences ${impactLine}, and that means it changes how people understand situations and respond to them.`
      },
      {
        speaker: speakerNames[0],
        voice: 0,
        text: `${connectiveLine} That is usually the point where the topic becomes interesting instead of intimidating.`
      },
      {
        speaker: speakerNames[1],
        voice: 1,
        text: `${recapLine} ${closingLine}`
      },
      {
        speaker: speakerNames[0],
        voice: 0,
        text: outroLine
      }
    ];

    const transcript = segments.map((segment) => `${segment.speaker}: ${segment.text}`).join('\n\n');
    const totalWords = segments.reduce((sum, segment) => sum + countWords(segment.text), 0);

    return {
      title: `AI Podcast: ${cleanTopic}`,
      themeLabel: themeBlueprint.label,
      durationLabel: formatDurationFromWords(totalWords),
      transcript,
      segments,
      referenceEpisode,
      keywords
    };
  }

  function renderAIDraft(draft) {
    const keywordMarkup = draft.keywords.length
      ? draft.keywords.slice(0, 4).map((keyword) => `<span class="chip">#${escapeHtml(keyword)}</span>`).join('')
      : '<span class="chip">#podcast</span>';

    const referenceMarkup = draft.referenceEpisode
      ? `<span class="chip">Related: ${escapeHtml(draft.referenceEpisode.title)}</span>`
      : '<span class="chip">Original studio draft</span>';

    els.aiOutput.innerHTML = `
      <div class="ai-output-meta">
        <span class="chip">${escapeHtml(draft.themeLabel)}</span>
        <span class="chip">${escapeHtml(draft.durationLabel)}</span>
        ${referenceMarkup}
      </div>
      <h3 class="ai-output-title">${escapeHtml(draft.title)}</h3>
      <div class="chip-wrap ai-output-tags">${keywordMarkup}</div>
      <div class="ai-output-script">
        ${draft.segments.map((segment) => `
          <p>
            <span class="ai-speaker">${escapeHtml(segment.speaker)}</span>
            ${escapeHtml(segment.text)}
          </p>
        `).join('')}
      </div>
    `;
  }

  function setMiniPlayerForAI(draft) {
    state.currentKind = 'ai';
    state.aiDraft = draft;
    state.current = {
      title: draft.title,
      category: 'AI Studio',
      duration: draft.durationLabel,
      cover: {
        text: 'AI',
        gradient: 'linear-gradient(135deg, #8f5bff, #00d8ff)'
      }
    };

    els.miniTitle.textContent = draft.title;
    els.miniMeta.textContent = `${draft.themeLabel} · ${draft.durationLabel}`;
    renderMiniCover(state.current);
    els.miniPlayPauseBtn.disabled = false;
    els.miniStopBtn.disabled = false;
    els.miniPlayPauseBtn.textContent = '⏸';
  }

  function speakSegments(segments) {
    const synth = window.speechSynthesis;

    if (!synth) {
      alert('Your browser does not support offline speech synthesis.');
      els.miniPlayPauseBtn.textContent = '▶';
      return;
    }

    synth.cancel();

    getVoicesReady().then((voices) => {
      const [voiceA, voiceB] = pickVoicePair(voices);

      state.aiIsSpeaking = true;
      state.aiIsPaused = false;
      els.miniPlayPauseBtn.textContent = '⏸';

      segments.forEach((segment, index) => {
        const utterance = new SpeechSynthesisUtterance(segment.text);
        const chosenVoice = segment.voice === 0 ? voiceA : voiceB;

        if (chosenVoice) utterance.voice = chosenVoice;

        utterance.rate = segment.rate ?? (segment.voice === 0 ? 0.97 : 1.01);
        utterance.pitch = segment.pitch ?? (segment.voice === 0 ? 0.96 : 1.03);
        utterance.volume = 1;

        if (index === segments.length - 1) {
          utterance.onend = () => {
            state.aiIsSpeaking = false;
            state.aiIsPaused = false;
            els.miniPlayPauseBtn.textContent = '▶';
          };
          utterance.onerror = () => {
            state.aiIsSpeaking = false;
            state.aiIsPaused = false;
            els.miniPlayPauseBtn.textContent = '▶';
          };
        }

        synth.speak(utterance);
      });
    });
  }

  function toggleAISpeech() {
    if (!state.aiDraft) return;
    const synth = window.speechSynthesis;

    if (!synth) {
      alert('Your browser does not support offline speech synthesis.');
      return;
    }

    if (synth.speaking && !synth.paused) {
      synth.pause();
      state.aiIsPaused = true;
      els.miniPlayPauseBtn.textContent = '▶';
      return;
    }

    if (synth.paused) {
      synth.resume();
      state.aiIsPaused = false;
      els.miniPlayPauseBtn.textContent = '⏸';
      return;
    }

    speakSegments(state.aiDraft.segments);
  }

  function stopAISpeech() {
    const synth = window.speechSynthesis;

    if (synth) synth.cancel();
    state.aiIsSpeaking = false;
    state.aiIsPaused = false;

    if (state.currentKind === 'ai') {
      els.miniPlayPauseBtn.textContent = '▶';
    }
  }

  function renderMemberPortrait(member) {
    if (member.imageUrl) {
      return `<img src="${escapeHtml(member.imageUrl)}" alt="Portrait of ${escapeHtml(member.name)}" class="member-portrait" loading="lazy" />`;
    }

    return `
      <div class="member-portrait member-portrait--placeholder">
        <span>${escapeHtml(member.name)}</span>
      </div>
    `;
  }

  function renderMemberMedia(member) {
    if (!member.mediaUrl) {
      return `<div class="upload-drop member-media-placeholder">${escapeHtml(member.mediaPlaceholder || TEAM_PLACEHOLDER_COPY)}</div>`;
    }

    const mediaKind = inferMediaKind(member.mediaUrl);
    const safeUrl = escapeHtml(member.mediaUrl);

    if (mediaKind === 'video') {
      return `<video class="member-media-player" controls preload="metadata" src="${safeUrl}"></video>`;
    }

    if (mediaKind === 'audio') {
      return `<audio class="member-media-player" controls preload="metadata" src="${safeUrl}"></audio>`;
    }

    return `<a class="btn light member-media-link" href="${safeUrl}">Open media</a>`;
  }

  function renderTeamMembers() {
    els.teamGrid.innerHTML = teamMembers.map((member) => `
      <article class="team-card">
        ${renderMemberPortrait(member)}
        <div class="team-card__body">
          <div class="team-card__header">
            <h4>${escapeHtml(member.name)}</h4>
            ${member.role ? `<p>${escapeHtml(member.role)}</p>` : ''}
          </div>
          <p class="team-card__bio">${escapeHtml(member.bio)}</p>
          <div class="team-card__media">
            <div class="team-card__media-label">${escapeHtml(member.mediaLabel || 'Audio or video')}</div>
            ${renderMemberMedia(member)}
          </div>
        </div>
      </article>
    `).join('');
  }

  function openAddModal() {
    els.addModal.classList.add('active');
    els.addModal.setAttribute('aria-hidden', 'false');
  }

  function closeAddModal() {
    els.addModal.classList.remove('active');
    els.addModal.setAttribute('aria-hidden', 'true');
  }

  function clearUploadForm() {
    els.uploadFile.value = '';
    els.uploadTitle.value = '';
    els.uploadCategory.value = 'Technology';
    els.uploadDuration.value = '';
    els.uploadTags.value = '';
    els.uploadDescription.value = '';
  }

  function durationFromSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ai-podcast-hub', 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('uploads')) {
          db.createObjectStore('uploads', { keyPath: 'id' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function idbGetAll(db) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('uploads', 'readonly');
      const store = tx.objectStore('uploads');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  function idbPut(db, value) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('uploads', 'readwrite');
      const store = tx.objectStore('uploads');
      const request = store.put(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function loadUploads() {
    state.db = await openDB();
    const uploads = await idbGetAll(state.db);

    uploads.forEach((item) => {
      const objectUrl = URL.createObjectURL(item.blob);
      state.uploadObjectUrls.add(objectUrl);
      state.podcasts.push({
        id: item.id,
        title: item.title,
        category: item.category,
        tags: item.tags,
        duration: item.duration,
        description: item.description,
        objectUrl,
        cover: item.cover
      });
    });
  }

  function autoFillDurationFromFile(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.src = url;

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (Number.isFinite(audio.duration)) resolve(durationFromSeconds(audio.duration));
        else resolve('');
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };
    });
  }

  async function saveUpload() {
    const file = els.uploadFile.files[0];
    const title = normalizeText(els.uploadTitle.value);
    const category = els.uploadCategory.value;
    const duration = normalizeText(els.uploadDuration.value);
    const tags = els.uploadTags.value.split(',').map((tag) => normalizeText(tag)).filter(Boolean).slice(0, 4);
    const description = normalizeText(els.uploadDescription.value);

    if (!file) return alert('Please choose an MP3 file first.');
    if (!title) return alert('Please add a title.');
    if (tags.length < 4) return alert('Please enter 4 tags separated by commas.');
    if (!description) return alert('Please add a short description.');

    if (!state.db) {
      state.db = await openDB();
    }

    const blob = file.slice(0, file.size, file.type);
    const objectUrl = URL.createObjectURL(blob);
    state.uploadObjectUrls.add(objectUrl);

    const id = `upload-${Date.now()}`;
    const coverText = title.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'UP';
    const gradients = [
      'linear-gradient(135deg, #7c3aed, #06b6d4)',
      'linear-gradient(135deg, #111827, #f59e0b)',
      'linear-gradient(135deg, #0f766e, #22c55e)',
      'linear-gradient(135deg, #7f1d1d, #f97316)'
    ];

    const podcast = {
      id,
      title,
      category,
      tags,
      duration: duration || '0:00',
      description,
      objectUrl,
      cover: {
        text: coverText,
        gradient: gradients[hashString(title) % gradients.length]
      }
    };

    state.podcasts.push(podcast);

    await idbPut(state.db, {
      id,
      title,
      category,
      tags,
      duration: podcast.duration,
      description,
      blob,
      cover: podcast.cover
    });

    renderLibrary();
    clearUploadForm();
    closeAddModal();
    alert('Episode added successfully.');
  }

  function cleanupObjectUrls() {
    state.uploadObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    state.uploadObjectUrls.clear();
  }

  function wireEvents() {
    els.aboutBtn.addEventListener('click', () => openPage('about'));
    els.aboutBackBtn.addEventListener('click', () => openPage('home'));

    els.searchInput.addEventListener('input', renderLibrary);

    els.addBtn.addEventListener('click', openAddModal);
    els.closeAddBtn.addEventListener('click', closeAddModal);
    els.cancelUploadBtn.addEventListener('click', closeAddModal);

    els.aiOpenBtn.addEventListener('click', () => openPage('ai'));
    els.aiBackBtn.addEventListener('click', () => openPage('home'));

    els.aiPrompt.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        els.aiGenerateBtn.click();
      }
    });

    els.aiGenerateBtn.addEventListener('click', () => {
      const topic = normalizeText(els.aiPrompt.value);
      if (!topic) {
        els.aiOutput.innerHTML = '<div class="ai-output__placeholder">Please type a podcast topic first.</div>';
        return;
      }

      stopEpisodePlayback();
      const draft = buildStudioDraft(topic);
      renderAIDraft(draft);
      setMiniPlayerForAI(draft);
      speakSegments(draft.segments);
    });

    els.aiClearBtn.addEventListener('click', () => {
      els.aiPrompt.value = '';
      els.aiOutput.innerHTML = '<div class="ai-output__placeholder">Your generated script will appear here.</div>';
      stopAISpeech();
      state.aiDraft = null;
      if (state.currentKind === 'ai') {
        state.current = null;
        state.currentKind = 'episode';
        resetMiniPlayer();
      }
    });

    els.detailPlayBtn.addEventListener('click', () => {
      if (state.current) {
        playPodcast(state.current);
        closeDetail();
      }
    });

    els.closeDetailBtn.addEventListener('click', closeDetail);
    els.detailCloseBtn.addEventListener('click', closeDetail);
    els.detailModal.addEventListener('click', (event) => {
      if (event.target === els.detailModal) closeDetail();
    });

    els.addModal.addEventListener('click', (event) => {
      if (event.target === els.addModal) closeAddModal();
    });

    els.saveUploadBtn.addEventListener('click', saveUpload);

    els.uploadFile.addEventListener('change', async () => {
      const file = els.uploadFile.files[0];
      if (!file) return;

      const duration = await autoFillDurationFromFile(file);
      if (duration) els.uploadDuration.value = duration;

      if (!normalizeText(els.uploadTitle.value)) {
        els.uploadTitle.value = file.name.replace(/\.[^/.]+$/, '').replaceAll(/[_-]+/g, ' ');
      }
    });

    els.miniPlayPauseBtn.addEventListener('click', () => {
      if (state.currentKind === 'ai' && state.aiDraft) {
        toggleAISpeech();
        return;
      }

      togglePlayPause();
    });

    els.miniStopBtn.addEventListener('click', () => {
      if (state.currentKind === 'ai') {
        stopAISpeech();
        return;
      }

      stopEpisodePlayback();
    });

    els.audioPlayer.addEventListener('play', () => {
      state.currentKind = 'episode';
      els.miniPlayPauseBtn.textContent = '⏸';
    });

    els.audioPlayer.addEventListener('pause', () => {
      if (els.audioPlayer.currentTime === 0 || !els.audioPlayer.ended) {
        els.miniPlayPauseBtn.textContent = '▶';
      }
    });

    els.audioPlayer.addEventListener('ended', () => {
      els.miniPlayPauseBtn.textContent = '▶';
    });

    els.audioPlayer.addEventListener('error', () => {
      alert('This audio file could not be loaded. Check the filename in assets/js/data.js.');
      els.miniPlayPauseBtn.textContent = '▶';
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDetail();
        closeAddModal();
      }
    });

    window.addEventListener('beforeunload', cleanupObjectUrls);
  }

  async function init() {
    renderHeroCards();
    renderTeamMembers();
    wireEvents();

    try {
      await loadUploads();
    } catch (error) {
      console.warn('IndexedDB uploads could not be loaded:', error);
    }

    renderLibrary();
    resetMiniPlayer();
  }

  init();
})();
