# Viking Theme Documentation

## Concept
Brutal, violent Vikings in a desperate world at the edge of Ragnarok. The UI should feel dark, gritty, and stark — no playful or colorful elements.

## Color Palette

| Token       | Value                      | Usage                                      |
|-------------|----------------------------|---------------------------------------------|
| primary     | `#dc2626` (blood red)      | Buttons, progress bars, focus rings, accents |
| secondary   | `#525252` (iron grey)      | Structural/muted elements                   |
| background  | `#0a0a0a` (near-black)     | Page background                             |
| foreground  | `#e0e0e0` (light grey)     | Default text                                |
| content1    | `#141414`                  | Card backgrounds                            |
| content2    | `#1c1c1c`                  | Progress bar tracks, secondary surfaces     |
| content3    | `#262626`                  | Borders, dividers, progress tracks          |
| content4    | `#303030`                  | Subtle highlights                           |
| focus       | `#dc2626`                  | Focus rings (matches primary)               |
| divider     | `rgba(220, 38, 38, 0.15)` | Subtle red-tinted dividers                  |
| success     | `#22c55e`                  | Positive states (e.g., 0 points remaining)  |
| warning     | `#f59e0b`                  | Warning states                              |
| danger      | `#ef4444`                  | Negative states, low rank chips             |

## Typography
- Font: **Inter** — sober, no decorative fonts
- Titles: uppercase, bold/black weight, wide tracking, white (`text-white`)
- Labels: uppercase, small, semibold, wide tracking
- Body text: `text-gray-400` to `text-gray-500` (muted)
- Numbers: always use `tabular-nums` for alignment

## Layout Principles
- **Reduced border radii**: 4px/6px/8px (sharper = more brutal, less playful)
- **No shadows on cards**: `shadow="none"` with visible borders (`border-content3`)
- **No ripple effects**: `disableRipple` on HeroUIProvider (fits austere theme)
- **Dark surfaces only**: cards use `bg-content1`, never white or light backgrounds

## HeroUI Components in Use
- **Button**: `variant="bordered"` for +/- controls (with hover: `hover:border-primary hover:text-white`), `variant="solid" color="primary"` for CTAs, `variant="light"` for navigation
- **Card/CardBody**: dark bordered cards for characteristic rows
- **Progress**: budget bar (top-level) and per-characteristic rank gauge
- **Chip**: color-coded rank labels (Feeble/Poor/Average/Good/Great/Heroic)
- **Tooltip**: cost/refund info on +/- buttons (`delay={400}`)
- **Divider**: section separators, decorative accent under title (`bg-primary`)

## Rank Label & Color Mapping
| Rank   | Label   | Chip Color |
|--------|---------|------------|
| -3, -2 | Feeble  | danger     |
| -1     | Poor    | warning    |
| 0      | Average | default    |
| 1, 2   | Good/Great | primary |
| 3      | Heroic  | success    |

## Theme File
Configured in `app/hero.ts` via `heroui({ defaultTheme: "dark", themes: { dark: { ... } } })`.

## Key Decisions & Rationale
1. **Forced dark mode** — a Viking/Ragnarok world has no place for light mode
2. **Blood red as primary** — evokes violence, urgency, Ragnarok fire
3. **No ripple** — material design ripples feel too playful for this setting
4. **Sharp corners** — rounded = friendly; sharp = brutal
5. **Muted text hierarchy** — white for emphasis, grey-400/500 for secondary info, creates depth without color
6. **Bordered buttons over flat** — visible edges feel more tactile and weapon-like
