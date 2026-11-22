# Microsoft and Fluent UI Integration

Reviewed against the Microsoft sources below on 2026-11-22.

## Choose the asset by its role

A brand logo identifies a company or application. A functional icon explains
an action or status. The a8-z8 marks are brand identifiers; do not use them as
generic Search, Save, Delete, Warning or Success icons. Use the appropriate
Fluent system icon for those actions and accompany it with an accessible name.

Microsoft does not require third-party brand logos to become Microsoft blue,
Teams purple, or another Microsoft product color. Keep the catalog's brand
identity. For controls, navigation, surfaces and states, use the host theme.
Do not imply that these third-party marks are Microsoft product launch icons.

## Exports and color policy

| Surface | Asset | Color and layout policy |
| --- | --- | --- |
| Brand logo in content/header | `svg/{id}.svg` or `png_*` | Original primary color, white mark and shadow; rounded brand tile |
| Teams/Microsoft 365 app identity | `microsoft/teams/{id}/color.png` | 192 x 192, opaque full-bleed square; no baked-in rounded corners or border; mark inside central 120 x 120 area |
| Teams app bar | `microsoft/teams/{id}/outline.png` | 32 x 32, white ink with transparent background; no colored tile, shadow or decorative padding |
| Inline themeable brand identity | `microsoft/mono/{id}.svg` | Single `currentColor`; no background or shadow |
| Static theme-specific brand identity | `microsoft/mono/light/` or `dark/` | Dark ink for light backgrounds; white ink for dark backgrounds |
| Functional controls/status | Fluent system icons | Semantic host-theme colors and appropriate interaction states |

The Teams color variant retains `primaryColor` and uses a flat black or white
mark, selecting whichever meets at least 4.5:1 contrast. This is an explicit
Microsoft export adaptation; it does not change the canonical brand tile.
The selected ink and measured contrast are recorded per brand in
`microsoft/manifest.json`. Outlines always use white ink, including for brands
whose color icon uses black. Their identifying shape is the same.

The monochrome mark is optically simplified by omitting shadows and the tile.
Small exports require visual review at their actual size; having a 16 px file
does not certify that the full mark is suitable for every 16 px command slot.
Use an established Fluent action symbol when it communicates the action better.

## Teams and Microsoft 365 app packages

Copy the selected brand's `color.png` and `outline.png` into the app package
and reference them with relative filenames in the app manifest:

```json
{
  "icons": { "color": "color.png", "outline": "outline.png" },
  "accentColor": "#F4511E"
}
```

This example is for b8 only. Each brand has a generated
`microsoft/teams/{id}/manifest-fragment.json` with its own accent color.
Merge the fragment into a complete manifest matching the target schema; the
fragment is not an installable Teams app or a Store approval.

The package must contain the icon files. This is an explicit exception to the
normal CDN-first policy, alongside offline apps and tests. Record the brand ID,
upstream Git commit and artifact SHA-256 values in the consuming repository.
Never copy the full catalog or manually edit a package PNG. Refresh from a
reviewed catalog version. Store approval and rights clearance remain separate.

The color source `color.svg` is provided for inspection, not as a replacement
for the PNG required in the package. Microsoft applies corner masking itself.
The outline has a tight square canvas, retaining only the whitespace necessary
to preserve the mark's proportions.

## Fluent UI, SharePoint and SPFx

For a webpart toolbox icon choose either a Fluent icon name in
`officeFabricIconFontName` or your own image in `iconImageUrl`. If both are
present, the Fluent icon name wins. A custom image can be a data URI. Use the
PNG variant when the host image renderer cannot honor the embedded SVG font.

For themeable inline SVG, `currentColor` follows the CSS `color` of the element.
An SVG loaded through `<img src="...">` does not inherit the parent page's
`currentColor`; select the light/dark PNG there or inline the trusted SVG at
build time. Do not inject arbitrary remote SVG markup into the DOM.

Use the Fluent version supported by the consuming project. For Fluent UI v9,
alias tokens such as `colorNeutralForeground1` and `colorBrandForeground1`
express roles; in SPFx/Fluent UI v8, obtain the equivalent semantic values from
the host theme. Do not mix v8 and v9 theme APIs or assume that this asset
repository chooses a component-library version for a consumer.

Theme controls using host values, including hover, pressed, selected, disabled
and focus states. Keep brand identity distinct from semantic success/error
colors. Never use color as the only way to communicate state.

The monochrome PNGs do not automatically adapt to Windows forced colors.
Use theme-aware inline icons and a visible text label where appropriate, and
test real forced-colors mode. Do not disable forced-color adjustments across
the interface merely to preserve the logo palette.

## Office ribbon commands

Office ribbon command icons are a separate asset role. Microsoft describes
simple monoline symbols with a restricted palette and recommends transparent
32-bit PNGs in 16, 20, 24, 32, 40, 48, 64, 80 and 96 px; the 16, 20 and 32 px
sizes are required in that guidance. Orange is excluded from that monoline
palette. This is not a blanket ban on an orange brand logo in app content.

The supplied monochrome brand marks cover those raster sizes for identity
surfaces; they are not automatically approved ribbon command icons. A concrete
command needs an appropriate action metaphor and label. Define and review it
in the consuming add-in rather than relabeling a brand tile as a command.

## Accessibility and host acceptance

Meaningful functional icons need at least 3:1 contrast against adjacent colors;
normal text generally needs 4.5:1. Teams recommends 4.5:1 for app icon contrast.
These have different scopes. Do not infer that every brand tile is a compliant
functional icon. White against the base color is below 3:1 for c8, d8, e8, j8,
o8 and u8; shadows alone are not an accessibility strategy.

Before shipping a consuming integration:

- Check the selected assets at 100% size and high DPI in the actual host.
- Check light, dark and Windows forced-colors themes.
- Give meaningful images useful alternative text. Use empty alternative text
  for a decorative image next to an equivalent visible name.
- Label icon-only buttons by their action, keep a visible keyboard focus and
  use a suitable hit target independently of the glyph size.
- Validate the complete app/add-in package and check the rendered app bar,
  toolbox or ribbon. Asset validation does not replace host acceptance.

## Authoritative references

- [Teams/Microsoft 365 app icon design](https://learn.microsoft.com/en-us/microsoftteams/platform/concepts/design/design-teams-app-icon-store-appbar)
- [Teams Store validation: app icons](https://learn.microsoft.com/en-us/microsoftteams/platform/publishing/office-store-approval#app-icons)
- [Fluent iconography](https://fluent2.microsoft.design/iconography/)
- [Fluent color and design tokens](https://fluent2.microsoft.design/color/)
- [Fluent accessibility](https://fluent2.microsoft.design/accessibility)
- [SPFx toolbox icons](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/basics/configure-web-part-icon)
- [SPFx theme colors](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/use-theme-colors-in-your-customizations)
- [Office ribbon icon guidance](https://learn.microsoft.com/en-us/office/dev/add-ins/design/add-in-icons)
- [Office Add-in design language](https://learn.microsoft.com/en-us/office/dev/add-ins/design/add-in-design-language)
