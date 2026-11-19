# Pulse Impact — v72

Abra `index.html` para iniciar o jogo, como nas versões anteriores. Extraia o ZIP completo antes de abrir. A v72 reorganiza os arquivos da v71 e atualiza os caminhos; os padrões de combate e os tempos permanecem iguais.

## Onde encontrar cada sistema

| Parte | Código | Imagens e animações |
|---|---|---|
| Serafim — primeira forma | `scripts/serafim/first-form.js` | `art/serafim/base/` |
| Serafim — segunda forma | `scripts/serafim/ascended.js` | `art/serafim/ascended/` |
| Transformação do Serafim | `scripts/game.js` | `art/serafim/transformation/` |
| Drones da primeira forma | `scripts/serafim/first-form.js` e `scripts/game.js` | `art/serafim/drones/` |
| Abertura / embarque (launch) | `scripts/cinematics/launch.js` | `art/cinematics/launch/` |
| Mortes da nave | `scripts/player/death.js` | `art/player/deaths/` |
| Nave e tiros do jogador | `scripts/game.js` | `art/player/` |
| Meia-lua, Fortaleza, Centopeia | `scripts/game.js` | `art/enemies/`, em subpastas por inimigo |
| Cenário e asteroides | `scripts/game.js` | `art/backgrounds/` e `art/environment/` |
| HUD e seletor de fases | `scripts/ui/` | — |
| Menu e fonte | `scripts/game.js` e `styles/game.css` | `art/menu/` |

## Demais pastas

- `audio/music/`: música do set.
- `audio/sfx/`: sons separados entre jogador e inimigos.
- `styles/game.css`: estilos extraídos do HTML.
- `scripts/game.js`: lógica principal, carregamento dos assets e desenho do jogo.
- `scripts/bootstrap.js`: inicialização do menu, mantendo a ordem original de carregamento.
- `previews/deaths.html`: prévia isolada das mortes, com caminhos relativos ajustados.
- `docs/`: histórico e registros de validação.

Os caminhos de imagens e sons nos scripts são relativos a `index.html`. As imagens do CSS são relativas a `styles/game.css`. A prévia das mortes usa a raiz do jogo como base. Não mova apenas um arquivo isolado sem ajustar suas referências.

## Verificações da organização

- 87 arquivos binários (imagens, sons, fonte e GIFs) preservados byte a byte.
- Todos os scripts do jogo carregados na ordem original em ambiente de validação Canvas.
- Caminhos de imagens e sons do runtime, HTML e CSS conferidos.
- Abertura, combate e prévia independente das mortes renderizados.
- Os 11 testes da segunda forma passaram novamente.
- Sintaxe dos scripts e integridade do ZIP verificadas.

A validação usa Canvas; não substitui uma partida de conferência no navegador.
