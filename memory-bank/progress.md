# Progress

**What works**

- Player com playlist filtrável, acervo em `js/data.js`, vídeos novos via `api/videos.json`.
- Clique em vídeo da Cicloviagem toca no player principal e rola até ele.
- Player mostra local (`placeOf()` + `PLACES` em `js/data.js`), data, resumo da descrição (`summarize()`) e botões Inscrever-se / Curtir no YouTube / Compartilhar.

**Not started / backlog**

- Liberar "Read and write permissions" em Settings → Actions se o commit da Action falhar.

**Known issues**

- Atraso de até ~3h entre publicar no YouTube e aparecer no site.
- Abrindo `index.html` direto (file://) o fetch falha e o site usa o acervo fixo.
- Local é heurístico (rota "sai de X, com destino a Y" ou lista `PLACES`); vídeos antigos sem descrição no feed só mostram local/resumo se tiverem `place`/`summary` manual. Like não é possível no embed — botão abre o vídeo no YouTube.

_Keep bullets factual and small; link issues or PRs when useful._
- Seção Cicloviagem tem chamada (`.ciclo-cta`) levando a `#contato`; grade de experiências com 6 cards (card 06 → `#cicloviagem`, foto `galera-pedal.jpg`; card 02 renomeado "Viagens & caminhos").
