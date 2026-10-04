# ZED_Tutor Branding Assets

## Logo

Place the official ZED_Tutor logo here:

```
client/public/assets/branding/logo.png
```

### Requirements

- **Filename:** `logo.png` (exact — the app looks for this path)
- **Format:** PNG with transparent background preferred
- **Size:** Minimum 200×200px; square or near-square aspect ratio works best in the nav icon slot (44×44px display)
- **Background:** Transparent PNG recommended so it looks clean on the white navbar and dark footer

### What uses this logo

| Location | Size | Notes |
|---|---|---|
| Navbar (top bar) | 44×44px | `object-contain` — full logo visible |
| Footer | 40×40px | Same treatment |
| Admin login | 48×48px | Added in Checkpoint 4 (admin CMS) |

### Fallback behavior

If `logo.png` is missing or fails to load, the Navbar and Footer automatically
fall back to the existing gradient icon (GraduationCap in a navy→academic-blue box).
No broken image will be shown to visitors.

### How to add your logo

1. Copy your official `logo.png` into this folder
2. Refresh the browser — it loads immediately, no rebuild needed (Vite serves `public/` as static)

### Other branding files (optional, future use)

| File | Purpose |
|---|---|
| `logo-dark.png` | Dark-background variant (for hero/admin dark panels) |
| `favicon.png` | 32×32 or 64×64 favicon replacement |
| `og-image.png` | 1200×630 Open Graph social share image |
