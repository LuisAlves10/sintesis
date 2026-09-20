# Assets

| Asset | Origem | Autor/crédito | Ano | Direitos/licença | Uso | Status |
|---|---|---|---:|---|---|---|
| `assets/images/sintesis-primer-line-up-1976.jpg` | [Magazine AM:PM](https://magazineampm.com/carlos-alfonso-un-neutron-libre-de-la-musica-cubana/) | Foto cortesia de Carlos Alfonso; publicação por AM:PM | foto atribuída à primeira formação, 1976 | Licença não indicada; uso editorial/educacional com crédito, sem alteração documental | Slide 02 | incluído |
| `assets/images/lucia-huergo-roberto-chile.jpg` | [Granma](https://www.granma.cu/cultura/2015-05-01/murio-lucia-huergo-figura-esencial-de-nuestra-musica) | Roberto Chile | não indicado na página | Licença não indicada; uso editorial/educacional com crédito | Slide 04 | incluído |
| `assets/images/prologo-jose-rei-dos-exus.webp` | imagem conceitual fornecida pelo grupo em 19/09/2026 | autoria não informada | 2026 | uso autorizado pelo grupo; não é documento histórico | Slide 01, estado 0 | prólogo conceitual |
| `assets/images/prologo-grupo-retrato.webp` | imagem conceitual fornecida pelo grupo em 19/09/2026 | autoria não informada | 2026 | uso autorizado pelo grupo; não é documento histórico | Slide 01, estado 1 | prólogo conceitual |
| `assets/icons/favicon.svg` | criação original do projeto | projeto Síntesis | 2026 | original | interface | incluído |
| `assets/images/world-natural-earth-110m.svg` | [Natural Earth — Land 110m](https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/), [arquivo oficial](https://naciscdn.org/naturalearth/110m/physical/ne_110m_land.zip) | Natural Earth; Tom Patterson, Nathaniel Vaughn Kelso e colaboradores | versão 4.1.0; conversão em 2026 | [Domínio público](https://www.naturalearthdata.com/about/terms-of-use/) | Slide 10 | SVG local, 58.348 bytes; substitui os polígonos esquemáticos |

Todos os arquivos usados pela apresentação são servidos localmente. As fotografias conservam os créditos disponíveis; uso educacional não equivale a uma licença aberta.

## Conversão cartográfica do Slide 10

O mapa foi convertido do shapefile Natural Earth 110m pelo script `scripts/build-world-map.mjs`. Ele usa projeção equiretangular, também usada em `js/map-projection.js` para posicionar Havana e os destinos.

SHA-256 do `.shp`: `8689e6932b8e370e2ca4587cf3ba21e460b1235db37b6ed3c172c35b4a6088de`.

Havana usa longitude −82,3666 e latitude 23,1136. As linhas do mapa indicam conexões visuais, não rotas reais.
