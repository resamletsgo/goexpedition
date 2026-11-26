const $ = (sel, root = document) => root.querySelector(sel)
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const formatDate = (iso) => {
  if (!iso) return 'No canal Let’s Go with me'
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return `${d} de ${MONTHS[m - 1]} de ${y}`
}
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/* ---------------- Header / nav ---------------- */
const header = $('.site-header')
const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40)
onScroll()
window.addEventListener('scroll', onScroll, { passive: true })

const navToggle = $('#navToggle')
const nav = $('#nav')
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true'
  navToggle.setAttribute('aria-expanded', String(!open))
  navToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu')
  header.classList.toggle('nav-open', !open)
})
$$('a', nav).forEach((a) =>
  a.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false')
    header.classList.remove('nav-open')
  }),
)

/* ---------------- Reveal on scroll ---------------- */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      }
    }),
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
)
$$('.reveal').forEach((el, i) => {
  el.style.setProperty('--d', `${(i % 4) * 70}ms`)
  io.observe(el)
})

/* ---------------- YouTube ---------------- */
let videos = [...VIDEOS]
let activeFilter = 'todos'
let current = videos[0]

const player = $('#player')
const playerTitle = $('#playerTitle')
const playerDate = $('#playerDate')
const playerPlace = $('#playerPlace')
const playerSummary = $('#playerSummary')
const playerLike = $('#playerLike')
const playerShare = $('#playerShare')
const playlist = $('#playlist')
const chips = $('#chips')
const sync = $('#ytSync')

const thumb = (id, q = 'mqdefault') => `https://i.ytimg.com/vi/${id}/${q}.jpg`

function renderFacade(video) {
  player.innerHTML = `
    <button class="player-facade" aria-label="Reproduzir: ${escapeHtml(video.title)}">
      <img src="${thumb(video.id, 'maxresdefault')}" alt="" onerror="this.onerror=null;this.src='${thumb(video.id, 'hqdefault')}'" />
      <span class="play-btn" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
    </button>`
  $('.player-facade', player).addEventListener('click', () => playInline(video))
}

function playInline(video) {
  player.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1"
    title="${escapeHtml(video.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
}

const watchUrl = (id) => `https://www.youtube.com/watch?v=${id}`

// Resumo = parágrafos da descrição antes do texto padrão do canal (apoio, links, parceiros)
const BOILERPLATE = /^\s*(seja membro|quer ajudar|d[eê] seu apoio|acesse|voc[eê] pode tamb[eé]m|parceiros|obrigado!|https?:\/\/)/i
function summarize(desc = '') {
  const keep = []
  for (const p of desc.split(/\n\s*\n/)) {
    if (BOILERPLATE.test(p)) break
    keep.push(p)
  }
  let s = keep.join(' ').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim()
  if (s.length > 320) s = s.slice(0, 320).replace(/[\s,.;:!]+\S*$/, '') + '…'
  return s
}

// Local = rota "sai de X, com destino a Y" ou o primeiro lugar conhecido (PLACES) no título/descrição
const tidyPlace = (s) => s.replace(/\s+em\s+/i, ', ').trim()
function placeOf(v) {
  if (v.place) return v.place
  const text = `${v.title} ${v.description || ''}`
  const route = text.match(/\bsa[ií]u? (?:do bairro |da cidade )?(?:de|da|do) (.+?),? com destino (?:a|ao|à) (.+?)(?=,|\.|\n| passando)/i)
  if (route) return `${tidyPlace(route[1])} → ${tidyPlace(route[2])}`
  return PLACES.find((p) => p.re.test(text))?.label || ''
}

function renderMeta(video) {
  const place = placeOf(video)
  playerPlace.hidden = !place
  playerPlace.lastElementChild.textContent = place
  const summary = video.summary || summarize(video.description)
  playerSummary.hidden = !summary
  playerSummary.innerHTML = summary
    ? `${escapeHtml(summary)} <a href="${watchUrl(video.id)}" target="_blank" rel="noopener">Ler mais no YouTube →</a>`
    : ''
  playerLike.href = watchUrl(video.id)
}

// Rola até o player (descontando o header fixo) quando ele não estiver visível
function scrollToPlayer() {
  const headerH = $('.site-header')?.offsetHeight || 80
  const rect = player.getBoundingClientRect()
  if (rect.top >= headerH && rect.bottom <= window.innerHeight) return
  const label = $('#midia .yt .panel-label')
  window.scrollTo({ top: label.getBoundingClientRect().top + window.scrollY - headerH - 12, behavior: 'smooth' })
}

playerShare.addEventListener('click', async () => {
  const data = { title: current.title, url: watchUrl(current.id) }
  const label = $('span', playerShare)
  try {
    if (navigator.share) return await navigator.share(data)
    await navigator.clipboard.writeText(data.url)
    label.textContent = 'Link copiado!'
  } catch (e) {
    if (e?.name === 'AbortError') return
    window.open(data.url, '_blank', 'noopener')
  }
  setTimeout(() => (label.textContent = 'Compartilhar'), 2000)
})

function selectVideo(video, { autoplay = false } = {}) {
  current = video
  playerTitle.textContent = video.title
  playerDate.textContent = formatDate(video.date)
  renderMeta(video)
  autoplay ? playInline(video) : renderFacade(video)
  $$('.playlist button').forEach((b) => b.setAttribute('aria-current', String(b.dataset.id === video.id)))
}

function renderChips() {
  chips.innerHTML = FILTERS.map(
    (f) => `<button role="tab" data-filter="${f.id}" aria-selected="${f.id === activeFilter}">${f.label}</button>`,
  ).join('')
}

function renderPlaylist() {
  const list = activeFilter === 'todos' ? videos : videos.filter((v) => v.tags.includes(activeFilter))
  if (!list.length) {
    playlist.innerHTML = `<li class="playlist-empty">Nenhum vídeo nesta categoria ainda. <a href="https://www.youtube.com/@letsgowithme/videos" target="_blank" rel="noopener">Veja o canal completo →</a></li>`
    return
  }
  playlist.innerHTML = list
    .map(
      (v) => `<li><button data-id="${v.id}" aria-current="${v.id === current.id}">
        <span class="pl-thumb"><img src="${thumb(v.id)}" alt="" loading="lazy" width="320" height="180" />${v.isNew ? '<em>novo</em>' : ''}</span>
        <span class="pl-text"><strong>${escapeHtml(v.title)}</strong><small>${formatDate(v.date)}</small></span>
      </button></li>`,
    )
    .join('')
}

function setFilter(id) {
  activeFilter = id
  renderChips()
  renderPlaylist()
  playlist.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

chips.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-filter]')
  if (b) setFilter(b.dataset.filter)
})
playlist.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-id]')
  if (!b) return
  const v = videos.find((x) => x.id === b.dataset.id)
  if (!v) return
  selectVideo(v, { autoplay: true })
  scrollToPlayer()
})

// Experience cards -> filter the playlist
$$('.xp-card[data-filter]').forEach((card) =>
  card.addEventListener('click', () => {
    setFilter(card.dataset.filter)
    $('#midia').scrollIntoView({ behavior: 'smooth' })
  }),
)

// Any [data-play] button elsewhere on the page plays in the main player
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-play]')
  if (!b) return
  const v = videos.find((x) => x.id === b.dataset.play) || { id: b.dataset.play, title: b.textContent.trim(), tags: [] }
  selectVideo(v, { autoplay: true })
  scrollToPlayer()
})

const cleanTitle = (t) =>
  t
    .replace(/#[\p{L}\p{N}_]+/gu, '')
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{1F3FB}-\u{1F3FF}]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

async function syncLatest() {
  try {
    const res = await fetch('api/videos.json', { cache: 'no-cache', headers: { accept: 'application/json' } })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    const feed = data.videos || []
    const byId = new Map(videos.map((v) => [v.id, v]))
    // Vídeos do acervo ganham a data (se faltar) e a descrição do feed
    feed.forEach((f) => {
      const v = byId.get(f.id)
      if (!v) return
      if (!v.date) v.date = f.published
      if (!v.description) v.description = f.description
    })
    const fresh = feed
      .filter((v) => !byId.has(v.id))
      .map((v) => ({
        id: v.id,
        title: cleanTitle(v.title),
        date: v.published,
        description: v.description,
        isNew: true,
        tags: (() => {
          const tags = TAG_RULES.filter((r) => r.re.test(v.title + ' ' + v.description)).map((r) => r.tag)
          return tags.length ? tags : ['trilhas']
        })(),
      }))
    // Mais recente primeiro; vídeos sem data (acervo antigo) ficam no fim, na ordem original
    videos = [...fresh, ...videos].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    const playing = !!$('iframe', player)
    if (!playing) selectVideo(videos[0])
    else renderMeta(current)
    renderPlaylist()
    sync.dataset.state = 'ok'
    sync.querySelector('b').textContent = fresh.length ? `${fresh.length} novo${fresh.length > 1 ? 's' : ''}` : 'atualizado'
  } catch {
    sync.dataset.state = 'off'
    sync.querySelector('b').textContent = 'acervo'
  }
}

renderChips()
renderPlaylist()
selectVideo(current)
syncLatest()

/* ---------------- Instagram ---------------- */
const igTabs = $('#igTabs')
const igCard = $('#igCard')
const igEmbed = $('#igEmbed')
let igActive = INSTAGRAM_PROFILES[0].handle
let igScript = null
let igRender = 0

function loadInstagramScript() {
  if (igScript) return igScript
  igScript = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://www.instagram.com/embed.js'
    s.async = true
    s.onload = () => resolve(window.instgrm)
    s.onerror = reject
    document.body.appendChild(s)
  })
  return igScript
}

const blockquote = (url) => `
  <blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed" data-instgrm-version="14">
    <a href="${url}" target="_blank" rel="noopener">Ver no Instagram</a>
  </blockquote>`

function renderInstagram() {
  const token = ++igRender
  const p = INSTAGRAM_PROFILES.find((x) => x.handle === igActive)
  const url = `https://www.instagram.com/${p.handle}/`

  igTabs.innerHTML = INSTAGRAM_PROFILES.map(
    (x) => `<button role="tab" data-handle="${x.handle}" aria-selected="${x.handle === igActive}">@${x.handle}</button>`,
  ).join('')

  igCard.innerHTML = `
    <div class="ig-avatar" aria-hidden="true">${p.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}</div>
    <div class="ig-card-text"><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.bio)}</span></div>
    <a class="btn btn-sun btn-sm" href="${url}" target="_blank" rel="noopener">Seguir</a>`

  const posts = INSTAGRAM_POSTS[p.handle] || []
  igEmbed.innerHTML = `
    <div class="ig-skeleton" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
    ${blockquote(url)}
    ${posts.map(blockquote).join('')}`

  const fallback = () => {
    if (token !== igRender || igEmbed.querySelector('iframe')) return
    igEmbed.innerHTML = `
      <div class="ig-fallback">
        <p>O Instagram não carregou aqui — pode ser um bloqueador de conteúdo do navegador.</p>
        <a class="link-arrow" href="${url}" target="_blank" rel="noopener">Abrir @${p.handle} no Instagram <span aria-hidden="true">→</span></a>
      </div>`
  }

  loadInstagramScript()
    .then((ig) => {
      ig?.Embeds?.process()
      setTimeout(fallback, 9000)
    })
    .catch(fallback)

  // Hide the skeleton once Instagram swaps the blockquote for an iframe
  const mo = new MutationObserver(() => {
    if (igEmbed.querySelector('iframe')) {
      igEmbed.classList.add('is-loaded')
      mo.disconnect()
    }
  })
  igEmbed.classList.remove('is-loaded')
  mo.observe(igEmbed, { childList: true, subtree: true })
}

igTabs.addEventListener('click', (e) => {
  const b = e.target.closest('button[data-handle]')
  if (!b || b.dataset.handle === igActive) return
  igActive = b.dataset.handle
  renderInstagram()
})

// Load Instagram only when the media section approaches the viewport
const igIo = new IntersectionObserver(
  (entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      renderInstagram()
      igIo.disconnect()
    }
  },
  { rootMargin: '400px 0px' },
)
igIo.observe($('.ig'))
igTabs.innerHTML = INSTAGRAM_PROFILES.map(
  (x, i) => `<button role="tab" data-handle="${x.handle}" aria-selected="${i === 0}">@${x.handle}</button>`,
).join('')

/* ---------------- Manual tabs ---------------- */
const tabs = $$('.manual-tabs [role="tab"]')
function activateTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab
    t.setAttribute('aria-selected', String(on))
    t.tabIndex = on ? 0 : -1
    $('#' + t.getAttribute('aria-controls')).hidden = !on
  })
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => activateTab(t))
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]
    next.focus()
    activateTab(next)
  })
})

$('#ano').textContent = new Date().getFullYear()
