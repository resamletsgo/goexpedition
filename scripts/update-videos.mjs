// Lê o feed público do canal no YouTube e grava api/videos.json (usado pelo site no GitHub Pages).
// Roda pela GitHub Action .github/workflows/update-videos.yml — requer Node 18+ (fetch nativo).
import { writeFile, mkdir } from 'node:fs/promises'

const CHANNEL_ID = 'UC3x5NZW-Wk-VoOEIWvzr7oQ' // youtube.com/@letsgowithme
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const OUT = new URL('../api/videos.json', import.meta.url)

const decode = (s = '') =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()

const tag = (xml, name) => decode(xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1])

const res = await fetch(FEED, { headers: { 'user-agent': 'Mozilla/5.0 (site feed updater)' } })
if (!res.ok) throw new Error(`Feed do YouTube respondeu ${res.status}`)
const xml = await res.text()

const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
  .map(([, e]) => ({
    id: tag(e, 'yt:videoId'),
    title: tag(e, 'title'),
    published: tag(e, 'published'),
    description: tag(e, 'media:description'),
  }))
  .filter((v) => v.id && v.title)

if (!videos.length) throw new Error('Feed sem vídeos — mantendo o arquivo anterior')

await mkdir(new URL('.', OUT), { recursive: true })
await writeFile(OUT, JSON.stringify({ channelId: CHANNEL_ID, videos }, null, 2) + '\n')
console.log(`api/videos.json: ${videos.length} vídeos, mais recente ${videos[0].id} (${videos[0].published})`)
