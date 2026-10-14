# Type

Type is a quiet, one-page writing room built around a working Three.js typewriter. Its black enamel body, glass-topped keys, chrome hardware, and connected ribbon mechanism take inspiration from vintage Underwood machines.

Live at https://thealanlu.github.io/type/.

## Run Locally

Serve this static website from a local server. Its JavaScript modules cannot be loaded directly with `file://`:

```sh
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Features

- Live paper rendering from a real text input
- Detailed 3D typewriter with visible ribbon spools, platen, keys, and typebars
- Rigid typebars rotating from fixed pivots to a shared printing point
- Ribbon lift, impact, escapement, and carriage return animations
- Horizontal platen rotation when feeding paper
- PDF export preserving the selected typewriter font, ink color, and paper tone
- Ink and paper tone controls
- Margins, tab stops, correction ribbon, and new sheet controls
- Realistic backspace (move without erasing) or modern backspace
- Paper focus mode, locally saved pages, and collapsible clickable shortcuts
- First-visit hint and optional mobile keyboard
- Sound on/off with key, return, delete, and bell effects
- One-page responsive WebGL typewriter workspace

## Checks

```sh
node tests/mechanism.mjs
node --input-type=module --check < script.js
```

The geometry checks cover rigid bar length, contact alignment, slug orientation,
and the platen axle. Interaction, responsive layout, rendered motion, and PDF
downloads should also be tested in a WebGL-capable browser before publishing.

This is a mechanical simulation, not a rigid-body physics engine. The modern
toolbar, optional erasing backspace, and PDF export are deliberate conveniences.
