# Pulse Impact v71 — Ataques do Serafim ascendido

Base: v70. Música, modo de vida infinita e primeira forma preservados.

## Padrões e atalhos

| Atalho | Padrão |
|---|---|
| 03:30 | Início da transformação sem ataques |
| 03:45 | Transformação em andamento |
| 04:00 | Forma ascendida |
| 04:00,39 | Coroa de penas: duas salvas em leque, corredor central e trajetórias fixas |
| 04:13,19 | Julgamento duplo: duas miras independentes; aviso trava antes do disparo |
| 04:25,99 | Relicários: quatro drones orbitais, carga e disparos sequenciais |
| 04:38,79 | Pulso: carga no peito e anel com abertura à esquerda |
| 04:51,59 | Repetição da coroa |
| 05:04 | Fim do chefe |

Cada padrão ocupa 32 batidas de 0,4 s e inclui recuperação. Os disparos antigos não são usados a partir de 04:00. A nave continua controlável.

## Assets

Quatro spritesheets RGBA em `art/serafim/ascended/`: coroa, julgamento, pulso e relicários. Cada sheet tem oito quadros em 4 colunas × 2 linhas. `frames.json` documenta os recortes, etapas, âncoras e tempos. As imagens foram geradas usando a forma ascendida como referência. Os projéteis de penas reutilizam a textura do projeto com corpo e rastro reforçados; raios e anel são efeitos desenhados em Canvas para alinhar desenho e colisão.

Os drones aparecem à frente das asas. A inversão é aplicada uma vez nessa camada, preservando o Serafim sem inversão. Tiros têm núcleo branco, corpo violeta e contorno escuro na imagem final.

## Verificações executadas

- Sintaxe de todos os scripts.
- Onze testes de comportamento: ausência de ataques na transformação e após o fim; ordem dos quatro padrões; penas com direção fixa; duas janelas de raio e trava da mira; origem do raio na âncora do cetro; drones orbitais destruídos com três acertos; animação de destruição; abertura do pulso sem dano; ausência de duplicação no mesmo tempo; limpeza ao retroceder a timeline; vida infinita; varredura da segunda forma a 60 avaliações/s com coordenadas finitas e quantidade limitada de objetos.
- Renderização do jogo em Canvas com sprites carregados e composição de inversão, incluindo estados de transformação e dos quatro ataques.
- Simulação de rotas em grade de 20 px a cada 0,1 s, com movimento de até 200 px/s e mira registrada fixa: encontrou caminhos durante toda a segunda forma.

Os resultados automatizados estão em `validation/`. A simulação de rotas é uma checagem geométrica; não substitui o ajuste de dificuldade durante uma partida. Não foi possível executar o navegador neste ambiente; a validação visual usou o renderizador Canvas.
