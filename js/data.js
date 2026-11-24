// Conteúdo editável do site — vídeos em destaque, filtros e perfis do Instagram.
// A lista abaixo é o acervo base; /api/videos acrescenta automaticamente os lançamentos mais recentes do canal.

export const CHANNEL = {
  youtube: 'https://www.youtube.com/@letsgowithme',
  subscribe: 'https://www.youtube.com/@letsgowithme?sub_confirmation=1',
  instagram: 'https://www.instagram.com/letsgowithmebr/',
  linktree: 'https://linktr.ee/letsgowithme',
  email: 'letsgowithmebr@outlook.com',
}

export const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'trilhas', label: 'MTB & trilhas' },
  { id: 'viagens', label: 'Cicloviagens' },
  { id: 'cangalha', label: 'Caminho dos Anjos' },
  { id: 'grandevolta', label: 'A Grande Volta' },
  { id: 'eventos', label: 'Eventos & parks' },
]

export const VIDEOS = [
  { id: 'B6KpmEbeV0o', title: 'Sufoco na trilha! A trilha do Jacaré está insana', date: '2026-11-17', tags: ['trilhas', 'grandevolta'] },
  { id: 'Uhhc4iy-irc', title: 'Nas trilhas com a galera', date: '2026-11-10', tags: ['trilhas', 'grandevolta'] },
  { id: 't-TNM5OWCUE', title: 'Treino de aniversário do Gabriel', date: '2026-11-06', tags: ['trilhas'] },
  { id: 'dWxtc4IpmKQ', title: 'Tour de Pobre 2026 — de gravel', date: '2026-11-02', tags: ['viagens', 'eventos'] },
  { id: '8blx8nYtXoc', title: 'As aventuras do rolê em Pedro Teixeira', date: '2026-10-16', tags: ['trilhas'] },
  { id: 'kIRMVdjJqB4', title: 'Caminho dos Anjos, dia 3: pela terra do queijo e da cachaça até o Cangalha', date: '2026-10-07', tags: ['viagens', 'cangalha'] },
  { id: 'MCIXJLdxOAw', title: 'De volta às origens', date: '2026-09-29', tags: ['trilhas'] },
  { id: 'z6lcSW1-MkA', title: 'Caminho dos Anjos, dia 2: dos búfalos aos carcarás', date: '2026-09-23', tags: ['viagens', 'cangalha'] },
  { id: 'F8FOE1FHRM0', title: 'WTR Rota Vulcânica em Poços de Caldas', date: '2026-09-18', tags: ['eventos'] },
  { id: 't4qd5DA6BXc', title: 'Caminho dos Anjos, dia 1: desbravando a Serra do Papagaio', date: '2026-09-16', tags: ['viagens', 'cangalha'] },
  { id: 'SFD7bvB2oYI', title: 'Planejando o Caminho dos Anjos', date: '2026-09-09', tags: ['viagens', 'cangalha'] },
  { id: '6-z55eGdcd4', title: 'e-Grande Volta', tags: ['grandevolta', 'trilhas'] },
  { id: 'faoVd2OlTe4', title: 'Caminho da Fé 2026: a emoção de concluir a jornada', tags: ['viagens'] },
  { id: 'UQS6mAnuUa0', title: 'Caminho da Fé 2026: a jornada está chegando ao fim', tags: ['viagens'] },
  { id: 'rZ7XILIxkl0', title: 'Zoom Bike Park 11 anos', tags: ['eventos'] },
  { id: 'qfE4AnfuQnA', title: 'Caminho da Fé 2026: o caminho para o sonho continua', tags: ['viagens'] },
  { id: '3yvJnHW-Afk', title: 'Dia dos pais na Grande Volta', tags: ['grandevolta', 'trilhas'] },
  { id: 'Y0LIdDLFtEY', title: 'Caminho da Fé 2026: a jornada para a realização de um sonho', tags: ['viagens'] },
  { id: 'JeCGJS90j58', title: 'Caminho da Fé 2026: a realização de um sonho', tags: ['viagens'] },
  { id: 'ykG3QyFa9Ks', title: 'Mais um feliz na Grande Volta', tags: ['grandevolta', 'trilhas'] },
  { id: 'cl2r_yCBaLM', title: 'Topo do Mundo em Nova Lima e suas vistas fantásticas', tags: ['trilhas'] },
  { id: 'SrM0VTvvD50', title: 'WTR Agulhas Negras', tags: ['eventos'] },
  { id: '5_brTgUV43I', title: 'De volta à Grande Volta', tags: ['grandevolta', 'trilhas'] },
  { id: 'vCEB3ViJo7U', title: 'Jump line na Montanha Azul MTB Park', tags: ['eventos'] },
  { id: 'ySkUAuQZhFs', title: 'Pra quem achava que iria chover — A Grande Volta', tags: ['grandevolta', 'trilhas'] },
  { id: '-ICyqzvt_HA', title: 'Projeto Trilhas em Nova Lima', tags: ['trilhas'] },
]

// Regras para classificar vídeos novos que chegam pelo feed do canal.
export const TAG_RULES = [
  { tag: 'grandevolta', re: /grande volta|jacar[eé]/i },
  { tag: 'cangalha', re: /caminho dos anjos|cangalha/i },
  { tag: 'viagens', re: /caminho|viagem|rota|serra|gravel|tour/i },
  { tag: 'eventos', re: /wtr|park|evento|desafio/i },
]

export const INSTAGRAM_PROFILES = [
  {
    handle: 'letsgowithmebr',
    name: "Let's Go with me",
    bio: 'Bike, viagem, tecnologia e vídeos. Bastidores dos pedais, stories das rotas e o que rola entre um vídeo e outro.',
  },
  {
    handle: 'ciclocangalha',
    name: 'Ciclo Cangalha',
    bio: 'Cicloturismo, natureza, cultura local e impacto social no Cangalha, em Aiuruoca (MG).',
  },
  {
    handle: 'agrandevolta',
    name: 'A Grande Volta',
    bio: 'Trilhas abertas e mantidas pela comunidade. Nossas trilhas, nossa casa.',
  },
]

// Para fixar posts específicos abaixo do perfil, cole aqui os links dos posts/reels.
// Ex.: 'https://www.instagram.com/p/XXXXXXXXXXX/'
export const INSTAGRAM_POSTS = {
  letsgowithmebr: [],
  ciclocangalha: [],
  agrandevolta: [],
}
