# Pulse Impact v53

Jogo de nave em HTML, CSS e JavaScript, com música e artes incluídas.

## Rodar localmente

Na pasta extraída, execute `py -m http.server 8000` no Windows ou `python3 -m http.server 8000` no macOS/Linux. Abra http://localhost:8000 no navegador. O servidor local permite que a análise de áudio funcione com a trilha separada.

## GitHub Desktop

Extraia o ZIP. Para um repositório existente, copie o conteúdo da pasta Pulse_Impact para a pasta local do repositório, revise as mudanças, faça o commit e use Push origin. Para um projeto novo, crie um repositório no GitHub Desktop e copie os arquivos para a pasta criada antes de fazer o commit e publicar.

## v54 experimental

Sirva a pasta com `python -m http.server 8000` (ou `py -m http.server 8000` no Windows).
Abra `http://localhost:8000/` e selecione **Amostra · 20 s** para jogar a abertura
com os controles e a música originais. Compare com `/comparar-v53.html`.
**Iniciar** abre a partida inteira. Use `/?canvas` para testar a alternativa Canvas.

Phaser 3.90.0 local (MIT) desenha partículas e efeitos sobre a cena. A simulação,
entrada e reprodução da trilha continuam no jogo original. A análise de graves
modula a camada de efeitos. Oscilação tem asteroides de fundo sem colisão,
o rádio reduz a presença das nuvens, a Meia-lua antecipa o tiro e a Fortaleza
tem clarões e recuo visual na rajada.

Os recortes para importar no Aseprite estão em `art/animation-atlas.json`.
A v53 fornece artes rasterizadas, incluindo corpo/cetro separados. Os PNGs e
WebPs são mantidos como fontes de importação. Não foram produzidos arquivos
editáveis .aseprite nesta etapa. O protótipo conserva o pivô do ombro e o cetro
articulado já existente, sem adicionar o runtime Spine ou deformar as asas.

Relógio do set: rádio 1:11–1:50, Centopeias 1:52, hiperespaço 2:40, drop 2:47,
controle 2:51, fim da aparição 2:53, ataques 2:55, fim da luta 5:04.
A comparação visual e de desempenho deve ser feita no navegador do jogador:
o Chromium do ambiente de montagem não iniciou.
