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
