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

Required Microsoft app-package assets are also permitted local copies. Include
only the selected brand's files, record source commit and SHA-256, and refresh
them from this catalog. See [MICROSOFT-INTEGRATION.md](MICROSOFT-INTEGRATION.md).

## Microsoft Variants

The existing `svg` and `png_*` paths are colored brand tiles. They are not
interchangeable with functional Fluent UI icons or Teams outline icons.

| Variant | Path relative to this folder | Purpose |
| --- | --- | --- |
| Teams color | `microsoft/teams/{id}/color.png` | 192 px, full-bleed square, safe-area brand mark |
| Teams outline | `microsoft/teams/{id}/outline.png` | 32 px, white mark on transparent background |
| Themeable brand mark | `microsoft/mono/{id}.svg` | Inline SVG with `currentColor`, no tile or shadow |
| Static monochrome | `microsoft/mono/{light,dark}/{id}_{size}.png` | Brand identification on light/dark surfaces |

The monochrome PNG sizes are 16, 20, 24, 32, 40, 48, 64, 80 and 96 pixels.
`light` means dark ink for a light surface; `dark` means white ink for a dark
surface. These are brand marks, not generic action icons or a guarantee of
Office ribbon acceptance. Use Fluent system icons for actions.

[microsoft/manifest.json](microsoft/manifest.json) records each export and hash.
[microsoft/preview.png](microsoft/preview.png) shows all Teams color icons with
32 px monochrome examples on light and dark surfaces below each icon, in a8-z8
order. SVGs embed Hanken Grotesk; use PNG when embedded fonts are unsupported.

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

Hanken Grotesk is an unmodified third-party font under the SIL Open Font
License 1.1. Copyright and the full license accompany the vendored TTF and
the font embedded in each generated SVG. Its license permits commercial logo
design and bundling with proprietary software; it does not change the license
of the resulting artwork. See [fonts/OFL.txt](fonts/OFL.txt),
[the exact source and hashes](fonts/source.json), and the
[official OFL FAQ, sections 1.1, 1.3 and 1.13](https://openfontlicense.org/ofl-faq/).
This exception applies to the font software only.

These assets are not open source. They may only be used when software8 and the
applicable rights holder have an agreement that permits storage, publication,
and delivery through this public repository and GitHub Pages.

See [../../LICENSE.md](../../LICENSE.md) and
[../../KUNDENHINWEIS.md](../../KUNDENHINWEIS.md).
