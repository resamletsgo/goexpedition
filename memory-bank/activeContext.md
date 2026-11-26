# Active context

**Current focus**: player com local, data, resumo e botões Inscrever-se / Curtir / Compartilhar (sem API key, extração no navegador em `js/app.js`). Antes: CTA da Cicloviagem + card 06.

**In progress**:

- [ ] Merge de `cursor/cicloviagem-e48a` no `main` para a Action agendada começar a rodar

**Decisions (recent)**:

- GitHub Pages não roda backend → `scripts/update-videos.mjs` + `.github/workflows/update-videos.yml` (a cada 3h) gravam `api/videos.json` a partir do feed RSS do canal (ID `UC3x5NZW-Wk-VoOEIWvzr7oQ`, sem chave de API).
- `syncLatest()` em `js/app.js` junta feed + acervo (`js/data.js`), ordena por data e seleciona o mais novo se nada estiver tocando.
- Botões `[data-play]` rolam até o rótulo "youtube.com/@letsgowithme" (descontando o header fixo).
- `netlify.toml` removido (hospedagem é GitHub Pages).

**Open questions**:

- Shorts entram no feed e podem virar o vídeo em destaque (sem filtro confiável sem API key).

_Update when the task or branch focus changes._
