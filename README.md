# Pulse Impact v60

Jogo de nave em HTML, CSS e JavaScript, com música e artes incluídas.

## Rodar localmente

Na pasta extraída, execute `py -m http.server 8000` no Windows ou `python3 -m http.server 8000` no macOS/Linux. Abra http://localhost:8000 no navegador. O servidor local permite que a análise de áudio funcione com a trilha separada.

## GitHub Desktop

Extraia o ZIP. Para um repositório existente, copie o conteúdo da pasta Pulse_Impact para a pasta local do repositório, revise as mudanças, faça o commit e use Push origin. Para um projeto novo, crie um repositório no GitHub Desktop e copie os arquivos para a pasta criada antes de fazer o commit e publicar.

## v66 — mortes conforme o impacto

Ao perder o último ponto de casco, a nave reproduz uma animação específica: projétil, asteroide, raio do Serafim, pena ou colisão com nave/Centopeia. São dois segundos de reprodução antes de “Sinal perdido”. Comandos e disparos ficam bloqueados; cenário e objetos continuam em movimento sem pontuar ou causar novos danos.

Abra `death-preview.html` para comparar as cinco mortes no tamanho de partida ou ampliadas. As spritesheets, metadados e GIFs ficam em `art/deaths/`. A nave original é usada no instante inicial. Algumas sequências possuem poses de sustentação, documentadas nos JSON.

A v66 mantém a seleção de fases e a saída natural dos asteroides da v65. Vida, dano, cadência e colisões de tiros permanecem como na base.

Validação: testes de lógica para as cinco causas, oito caminhos reais de colisão, duração, bloqueio de novos danos e retorno após reinício; inspeção dos PNG RGBA e duração dos GIFs. A renderização completa no navegador precisa de conferência local: o Chromium deste ambiente não conseguiu iniciar.

## v68 — Serafim: penas direcionais, drones e onda de entrada

Parâmetros em `serafim-attacks.js`, objeto `FEATHERS`: 70% precisão com ±6°, 30% dispersão entre8° e18°, preparação0,28s, intervalo0,085s, aceleração0,20s, velocidade275px/s, oscilação3px, cinco penas por rajada. A posição do jogador fica capturada na preparação. Cada pena guarda o sorteio e a origem, sem perseguição após lançamento. Os pontos de emissão acompanham a posição do chefe. Colisão varrida com raio4px e orientação pela tangente do voo. Arte original da pena preservada.

Drones: novo `art/drone-needle.png`, PNG RGBA32×16, desenhado20×8 incluindo margens e rastro, orientação original direita. Arte gerada com a ferramenta de imagens integrada: agulha gótica, losango alongado, núcleo marfim, vinho/violeta, dourado envelhecido, rastro à esquerda e transparência. Mantidos dano, velocidade205px/s e raio5px. Pool de seis vozes reutiliza `art/crescent-shot.mp3`, volume14% do geral; pausa/reinício e mute respeitados.

Entrada2:53: onda circular completa de1,1s, alcance calculado pelo canto mais distante+40px, duas frentes, interior transparente e clarão inicial curto. Renderiza na camada não invertida do Serafim; HUD redesenhada acima. Pulso permanece visual, sem novo dano. Som anterior preservado.

Verificado: sintaxe JavaScript, cinco mortes e oito rotas de colisão, antecipação, captura e fixação da mira, caminho determinístico consultado a20/30/60/120FPS, colisão varrida e limpeza dos caches. Não foi possível validar visualmente/escutar no navegador neste ambiente. Fazer conferência local do ritmo das rajadas, alinhamento com asas, equilíbrio do som e abertura completa antes de publicar.


## v69 — teste com vida infinita
Impactos mantêm casco em5/5, com recuo e piscar preservados. Base v68, sem transformação ou segunda fase. Use o seletor COMBATE · SERAFIM (2:55) para testar.
