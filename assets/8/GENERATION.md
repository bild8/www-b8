# 8 Asset Generation

The canonical prompt for these icons is machine-readable:

- [icon-spec.v1.json](icon-spec.v1.json) describes the icon geometry, font
  rules, output dimensions, file paths, and SHA-256 checksums for every icon and
  every generated resolution.
- [icon-spec.schema.json](icon-spec.schema.json) defines the JSON shape.
- [VISUAL-CONTROL.md](VISUAL-CONTROL.md) embeds the current SVG and PNG outputs
  for visual review.

The text below is only a human-readable summary of the machine prompt.

## Rebuild Prompt

```text
Rebuild the `assets/8` brand icon set for `a8` through `z8`.

Use the uploaded original references in `assets/8` as the visual source:
- `f8_grau_groß.png`
- `f8_grau.png`
- `f8_grau_192x192.png`
- `o_klein.png`
- `p_klein.png`
- `s_klein.png`
- `a8Color.svg`
- `a8Color@192.png`

Keep the current corporate layout:
- square tile with rounded corners
- brand color from `assets/8/brands.json`
- white monoline f-shaped divider
- the horizontal divider line must not be visible inside the belly/counter of
  the `8`; split the line into left and right segments around the `8`
- large white `8` on the right, with the dark offset shadow behind it
- small lowercase brand letter on the left, with the dark offset shadow behind it
- the small letter must sit below the horizontal white line like the originals;
  it must not sit inside or collide with the line

Use `Hanken Grotesk` for all text glyphs. In SVG, keep glyphs as text elements,
not converted/vectorized font paths. Use this font stack:
`'Hanken Grotesk', 'Helvetica Neue', Arial, Helvetica, 'Liberation Sans',
'Nimbus Sans', sans-serif`.

Generate all static outputs:
- `assets/8/svg/{a8..z8}.svg`
- `assets/8/png_32/{id}_32.png`
- `assets/8/png_192/{id}_192.png`
- `assets/8/png_526/{id}_526.png`
- `assets/8/preview_a-z8_colored.png`

Render the PNGs from the SVG source using Hanken Grotesk 900. Do not hand-edit
individual PNGs.
```

## Current Geometry

The current SVGs use a `192 x 192` viewBox.

- Background: `<rect x="1" y="1" width="190" height="190" rx="18" ry="18">`
- Left horizontal line: `M0 76 H94`
- Vertical/curve divider: `M94 160 C94 115 94 82 94 76 C94 54 101 31 124 25`
- Right horizontal line: `M143 76 H166`
- Large `8` shadow: `x=134.5`, `y=126`, `font-size=98`, `font-weight=900`,
  `opacity=0.70`, transform `translate(134.5 87) scale(0.92 1.18) translate(-134.5 -87)`
- Large `8` foreground: `x=126.5`, `y=121`, `font-size=98`,
  `font-weight=900`, transform `translate(126.5 84) scale(0.92 1.18) translate(-126.5 -84)`
- Small letter shadow: foreground `x + 7`, foreground `y + 5`,
  `opacity=0.70`

Small letter categories:

| Letters | Font size | Foreground `y` |
| --- | ---: | ---: |
| `b d f h i j k l` | 76 | 146 |
| `g p q y` | 76 | 132 |
| `t` | 76 | 141 |
| all other lowercase letters | 70 | 130 |

## Verification Checklist

Before publishing regenerated assets:

- All SVGs contain `Hanken Grotesk`.
- No SVG contains `Roboto`, `Arial Rounded`, `opentype`, or vectorized glyph
  path markers from old font conversion.
- The line paths are split as `M0 76 H94` and `M143 76 H166`.
- `preview_a-z8_colored.png` is `1540 x 880`.
- PNG folders render at `32 x 32`, `192 x 192`, and `526 x 526`.
- Compare `o8`, `p8`, `s8`, and `f8` against their reference PNGs:
  the small letters start below the horizontal line, and the `8` does not show
  the divider line through its counters.
