# 8 Brand Assets

This folder contains the `a8` to `z8` brand tiles. Each tile and color is meant
to represent one brand, company, website, or reserved brand slot.

Use [brands.json](brands.json) as the canonical machine-readable manifest for
templates, static-site builds, and GitHub Pages projects.

Use [icon-spec.v1.json](icon-spec.v1.json) as the canonical machine-readable
asset prompt for regenerating and verifying the icon set. Use
[VISUAL-CONTROL.md](VISUAL-CONTROL.md) for manual visual checks.

## Repository Integration

Current and future `*8` repositories should treat this folder as the single
source of truth. Web-facing repositories should reference the CDN paths below.
Local copies are reserved for offline apps and tests, and those copies must be
kept in sync with this catalog.

## CDN Paths

Replace `{id}` with `a8`, `b8`, ..., `z8`.

```text
https://bild8.de/assets/8/svg/{id}.svg
https://bild8.de/assets/8/png_32/{id}_32.png
https://bild8.de/assets/8/png_192/{id}_192.png
https://bild8.de/assets/8/png_526/{id}_526.png
```

Known mappings currently documented in the manifest:

| ID | Name | Domain | Color |
| --- | --- | --- | --- |
| `b8` | Bild8 | `bild8.de` | `#F4511E` |
| `f8` | Funktion8 | `funktion8.de` | `#5A6469` |
| `n8` | Notariat8 | `notariat8.de` | `#5E35B1` |

All other IDs are recorded as reserved slots until a name, domain, and rights
agreement are documented.

## Rights

These assets are not open source. They may only be used when software8 and the
applicable rights holder have an agreement that permits storage, publication,
and delivery through this public repository and GitHub Pages.

See [../../LICENSE.md](../../LICENSE.md) and
[../../KUNDENHINWEIS.md](../../KUNDENHINWEIS.md).
