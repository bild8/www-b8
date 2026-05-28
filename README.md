# b8 Assets

## Canonical 8 Asset Source

`bild8/www-b8` is the canonical source and public delivery repository for the
shared `a8` through `z8` brand asset catalog used by current and future
software8/bild8/notariat8-style repositories.

Consumer repositories should reference the published CDN paths instead of
copying the full catalog:

```text
https://bild8.de/assets/8/svg/{id}.svg
https://bild8.de/assets/8/png_32/{id}_32.png
https://bild8.de/assets/8/png_192/{id}_192.png
https://bild8.de/assets/8/png_526/{id}_526.png
```

Local copies are only for offline surfaces or tests. When a repository needs a
local copy, it must document the selected `{id}` and keep that copy aligned with
this repository.

## Repository Style Guide

Dieses Repository dient als Style-Referenz fuer bild8/software8 Repositories,
die mit GitHub Pages veroeffentlicht werden.

Als gemeinsames GitHub-Pages-Theme wird
[pages-themes/cayman](https://github.com/pages-themes/cayman) verwendet. Andere
Repositories sollen dieselbe Basis-Konfiguration nutzen:

```yml
remote_theme: pages-themes/cayman@v0.2.0
plugins:
  - jekyll-remote-theme
show_downloads: false
```

This repository is not open source. All rights are reserved.

The logos, marks, icons, names, and other brand assets in this repository belong
to their respective owners. Their presence here does not grant permission to
copy, reuse, publish, distribute, modify, or otherwise use them.

Any use requires prior written permission from the applicable rights holder. See
[LICENSE.md](LICENSE.md) for the full rights notice.

Customer-facing legal context is summarized in
[KUNDENHINWEIS.md](KUNDENHINWEIS.md).

The `a8` to `z8` brand asset catalog is documented in
[assets/8/brands.json](assets/8/brands.json) and
[assets/8/README.md](assets/8/README.md).

## Hinweis auf Deutsch

Dieses Repository ist nicht Open Source. Alle Rechte bleiben vorbehalten.

Die Logos, Marken, Icons, Namen und sonstigen Brand Assets in diesem Repository
gehoeren ihren jeweiligen Rechteinhabern. Ihre Ablage hier erteilt keine
Erlaubnis zum Kopieren, Wiederverwenden, Veroeffentlichen, Weitergeben,
Veraendern oder anderweitigen Nutzen.

Jede Nutzung erfordert die vorherige schriftliche Zustimmung des jeweiligen
Rechteinhabers. Der vollstaendige Hinweis steht in [LICENSE.md](LICENSE.md).

Eine kurze rechtliche Einschaetzung fuer Kunden steht in
[KUNDENHINWEIS.md](KUNDENHINWEIS.md).

Der Marken- und Asset-Katalog fuer `a8` bis `z8` steht in
[assets/8/brands.json](assets/8/brands.json) und
[assets/8/README.md](assets/8/README.md).
