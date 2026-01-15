# Barans Spillverksted

En morsom spillbygger-app for barn (5-6 år) - lag dine egne spill med dra-og-slipp!

## Funksjoner

- **30 forskjellige spilltyper** på tvers av 6 kategorier
- **Dra-og-slipp byggeverktøy** - enkelt å plassere blokker
- **Frihåndstegning** - tegn dine egne hindringer og dekorasjoner
- **Egne karakterer** - last opp bilde av deg selv som spillkarakter
- **Fungerer offline** - Progressive Web App med Service Worker
- **Berøringsoptimert** - perfekt for iPad/iPhone og desktop

## Spillkategorier

### Action
- Plattformspill
- Billøp
- Kulekjøring
- Labyrint
- Angry Birds
- Fangeren

### Ski (Barans favoritter!)
- Slalåm
- Langrenn
- Hopp
- Skiskyting
- Freestyle

### Kreativt
- Tegning
- Musikkmaskin
- Puslespill
- Romreise

### Læring
- Memory
- Fiskespill
- Sortering
- Tall-eventyr
- Bokstavjakt

### Sport
- Sykkelbane
- Svømming
- Fotball
- Trampoline

### Fantasy
- Drakeflukt
- Undervannsverden
- Eventyr
- Dinosaurverden
- Bybygging
- Robotverksted

## Teknologi

- **Vanilla JavaScript** - ingen rammeverk, rask lasting
- **HTML5 Canvas** - jevn spillgrafikk
- **Web Audio API** - lydeffekter generert i sanntid
- **LocalStorage** - spill lagres lokalt
- **Service Worker** - fungerer uten internett

## Installasjon

1. Åpne nettleseren på mobil eller desktop
2. Gå til appen
3. På iOS: Trykk "Del" -> "Legg til på Hjem-skjerm"
4. På Android: Trykk meny -> "Installer app"

## Bruk

1. **Velg spilltype** - bla gjennom kategoriene
2. **Velg karakter** - eller last opp ditt eget bilde
3. **Bygg banen** - dra blokker fra paletten
4. **Tegn detaljer** - bruk tegneverktøyet
5. **Test spillet** - trykk play-knappen
6. **Lagre** - gi spillet et navn

## Mappestruktur

```
2026-Lag-spill/
├── index.html          # Hovedside
├── manifest.json       # PWA-konfigurasjon
├── sw.js              # Service Worker
├── css/
│   ├── main.css       # Hovedstiler
│   ├── game-selector.css
│   ├── builder.css
│   ├── play-mode.css
│   └── animations.css
├── js/
│   ├── app.js         # Hovedapp
│   ├── game-selector.js
│   ├── character-picker.js
│   ├── data/
│   │   ├── blocks.js
│   │   ├── characters.js
│   │   └── achievements.js
│   ├── utils/
│   │   ├── storage.js
│   │   ├── touch-handler.js
│   │   ├── sound-manager.js
│   │   └── image-utils.js
│   ├── physics/
│   │   ├── physics-engine.js
│   │   ├── collision.js
│   │   └── particles.js
│   ├── builder/
│   │   ├── canvas-manager.js
│   │   ├── block-palette.js
│   │   ├── drag-drop.js
│   │   ├── drawing-tools.js
│   │   └── builder-core.js
│   └── games/
│       ├── platformer.js
│       ├── ski-slalom.js
│       └── ... (28 flere spillmotorer)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## Prestasjoner

Appen har et prestasjonssystem som motiverer barn:
- Førstegangsbragder (første spill, første lagring, etc.)
- Mengdebragder (lag 5/10/25 spill)
- Utforskerbragder (prøv alle kategorier)
- Spesielle skibragder for Baran!

## Oppmuntringer

Appen gir positive tilbakemeldinger på norsk:
- "Fantastisk jobba!"
- "Du er en mester!"
- "Wow, så fint!"
- "Kjempebra bygget!"

## Utviklet for

Denne appen er spesiallaget for **Baran** (5-6 år) som akkurat har begynt med slalåm. Skispillene er derfor ekstra viktige!

## Lisens

MIT License - bruk gjerne koden til egne prosjekter!
