# Marketing Video Pipeline — From a Website URL to a Polished Vertical/Square MP4

> **Author:** Alexander Quispe — Causal AI Digital
> **Last updated:** May 2026
> **Purpose:** Complete reference for turning **any website** into a 30-second marketing video with cinematic camera tour, professional voice off, word-level synced subtitles, and a CTA outro — using only a browser, Python, FFmpeg and whisper.cpp.

This pipeline is a fusion of two experiments:

1. **The original browser-as-renderer pipeline** (Playwright + FFmpeg + self-playing HTML).
2. **The whisper.cpp word-level transcription technique** carried over from the HyperFrames experiment — which gave us subtitle timing accurate to the millisecond instead of guesswork.

The output is a per-client marketing piece you can deliver as **square (1080×1080)** for LinkedIn/feed, **vertical (1080×1920)** for Reels/TikTok/Shorts, or **horizontal (1920×1080)** for YouTube/web — all from one HTML template.

---

## 1. What this produces

**Inputs you provide:**

| Input | Format | Example |
|---|---|---|
| Target website URL | live, public URL | `https://example.com` |
| Brand logo | PNG with transparency | `client-logo.png` |
| Phone / contact | string | `+51 972 571 826` |
| Voice script | plaintext (any language) | "Hay webs que se ven..." |
| Background music | royalty-free MP3 | YouTube Audio Library, etc. |

**Outputs you get:**

| File | Resolution | Use case |
|---|---|---|
| `<client>-marketing-square.mp4` | 1080×1080 | LinkedIn, Twitter, Instagram feed, Facebook |
| `<client>-marketing-vertical.mp4` | 1080×1920 | Reels, TikTok, Shorts, IG Stories |
| `<client>-marketing.mp4` (optional) | 1920×1080 | YouTube, web hero, landing page |

All renders are **deterministic** — re-run the pipeline and you get the exact same pixels.

---

## 2. Why this approach

We tried HyperFrames (HTML compositions → MP4 via Puppeteer + GSAP timelines) for the same job. It is brilliant for animated infographics, kinetic typography, audio-reactive visuals, and shader transitions. But for a **cinematic tour of a real website**, the live `<iframe>` approach **beats screenshots with crossfades** every time:

- Real DOM rendering at 1920×1080 → looks crisp, not pixelated.
- The browser does the scroll, so motion is natively smooth.
- No screenshot fragmentation — viewers see continuous content.

**What we kept from HyperFrames:** word-level subtitle timing. Whisper.cpp transcribes the actual voice off into JSON with per-word `start`/`end` timestamps, and we use those values to drive the burned-in CSS subtitle animations. No more eyeballing FFmpeg `silencedetect` output.

---

## 3. Architecture at a glance

```
┌──────────────┐    ┌─────────────┐    ┌───────────────┐    ┌──────────────────┐
│ Voice script │ ─▶ │  ElevenLabs │ ─▶ │ voiceover.mp3 │ ─▶ │   whisper.cpp    │
│  (text)      │    │  (TTS web)  │    └───────┬───────┘    │  (transcribe)    │
└──────────────┘    └─────────────┘            │            └────────┬─────────┘
                                               │                     │
                                               ▼                     ▼
                                       ┌───────────────┐    ┌───────────────────┐
                                       │  music.mp3    │    │  transcript.json  │
                                       │ (background)  │    │  word-level       │
                                       └───────┬───────┘    │  timestamps       │
                                               │            └─────────┬─────────┘
                                               │                      │
                                               ▼                      ▼
┌────────────────┐    ┌───────────────────────────────────────────────────┐
│  Website URL   │ ─▶ │  video-marketing-services.html (self-playing)     │
│  (live iframe) │    │  - cinematic tour CSS keyframes                   │
│  Brand logo    │ ─▶ │  - CTA outro slide                                │
│  Phone number  │ ─▶ │  - burned-in subtitles synced to whisper          │
└────────────────┘    └─────────────────────────┬─────────────────────────┘
                                                │
                                                ▼
                                      ┌───────────────────┐
                                      │ Playwright headless│
                                      │ Chromium records   │
                                      │ at viewport size   │
                                      └─────────┬──────────┘
                                                │
                                                ▼
                                      ┌───────────────────┐
                                      │  silent .webm     │
                                      └─────────┬─────────┘
                                                │
                                                ▼
                                      ┌──────────────────────────────────┐
                                      │  FFmpeg                          │
                                      │  - amix voice 100% + music 18%   │
                                      │  - -ss 0.3 trim Chromium flash   │
                                      │  - H.264 / AAC / yuv420p         │
                                      └─────────────┬────────────────────┘
                                                    │
                                                    ▼
                                      ┌──────────────────────────────────┐
                                      │  Final MP4(s)                    │
                                      │  square + vertical (+ horizontal)│
                                      └──────────────────────────────────┘
```

Five components:

1. **A voice script** (you write it).
2. **ElevenLabs TTS** to generate `voiceover.mp3`.
3. **whisper.cpp** to transcribe the voice off into word-level timestamps.
4. **A self-playing HTML file** that iframes the target website, animates a cinematic camera tour, and burns in the subtitles using whisper-derived CSS keyframes.
5. **`record_video.py`** — Playwright + FFmpeg orchestrator that records each format and muxes audio.

---

## 4. Folder structure

```
videos/
├── PIPELINE.md                              ← THIS document
├── README.md                                ← project-specific quick-start (per-client)
├── record_video.py                          ← recording orchestrator
│
├── video-marketing-services.html            ← square (1080×1080) template
├── video-marketing-services-vertical.html   ← vertical (1080×1920) template
│
├── voiceover.mp3                            ← generated by ElevenLabs (per project)
├── music.mp3                                ← background music (per project)
├── transcript.json                          ← whisper.cpp word-level (per project)
├── <client>-logo.png                        ← brand logo (per project)
│
├── marketing-raw-square.webm                ← silent intermediate (auto)
├── marketing-raw-vertical.webm              ← silent intermediate (auto)
│
├── <client>-marketing-square.mp4            ← final output
└── <client>-marketing-vertical.mp4          ← final output
```

---

## 5. Prerequisites — one-time setup

### 5.1 Python + Playwright

```bash
pip install playwright
python -m playwright install chromium    # ~150 MB one-time download
```

### 5.2 FFmpeg

| OS | Install |
|---|---|
| Windows | Download from https://www.gyan.dev/ffmpeg/builds/ → extract → add `bin/` to `PATH` |
| macOS | `brew install ffmpeg` |
| Linux | `apt install ffmpeg` |

The Python script also falls back to the `imageio-ffmpeg` Python package if no system FFmpeg is found:

```bash
pip install imageio-ffmpeg
```

### 5.3 whisper.cpp (the HyperFrames gain)

This is what gives us word-level subtitle timing. Pre-built Windows binary:

```powershell
# Download v1.8.4 BLAS x64 (CPU-optimized) — ~16 MB
curl -L -o whisper.zip "https://github.com/ggml-org/whisper.cpp/releases/download/v1.8.4/whisper-blas-bin-x64.zip"
# Extract to C:\whisper\
# Add C:\whisper to user PATH
```

For macOS / Linux, build from source:

```bash
git clone https://depth.1 https://github.com/ggml-org/whisper.cpp
cd whisper.cpp && make
# Resulting `whisper-cli` ends up in build/bin/
```

Then download a model. For Spanish or other non-English languages, **always use the multilingual variant** (`small`, NOT `small.en`):

```bash
# ~466 MB — best balance of accuracy and speed for short marketing scripts
curl -L -o C:\whisper\models\ggml-small.bin "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin"
```

> ⚠ **Critical:** `.en` models *translate* non-English audio into English instead of transcribing it. For Spanish voice off, use `small` not `small.en`.

### 5.4 ElevenLabs account

Free tier covers ~10k characters/month — plenty for a 30-second script. Register at https://elevenlabs.io. No card needed for free tier.

---

## 6. Workflow — building a marketing video for a new client

The full process takes **20–40 minutes** per client. Most of that is creative time (writing the script, choosing the tone), not technical work.

### Step 1 — Gather inputs

You need:

- **Live website URL.** Must be publicly accessible (no login walls, no localhost).
- **Brand logo as PNG with transparent background.** Ideally ~1500×500 px or square. Saved to `videos/<client>-logo.png`.
- **Contact info** — phone, WhatsApp, or email — to display on the CTA slide.
- **Brand colors** if you want to override the defaults.

### Step 2 — Write the voice-off script

Aim for **45–55 words for a 25-second voice off**. Keep it punchy:

```
Hay webs que se ven.
Hay webs que se sienten.
Y hay webs que venden por ti.

Aprenden de cada visita.
De cada clic.

Cada web que diseñamos viene con un chatbot
que conoce todos tus productos
y atiende a tu cliente
siempre.

Diseño que enamora.
Inteligencia que vende.

Causal AI Digital.
```

**Tone tips for marketing scripts:**

- Open with a hook — a contrast or a surprise (`Hay webs que se ven. / Hay webs que se sienten.`).
- Repeat structure for memorability (`Diseño que enamora. / Inteligencia que vende.`).
- End with the brand name **clearly enunciated** — that's the only mention you get.
- Avoid feature lists. Sell outcomes.

### Step 3 — Generate the voice off (ElevenLabs)

1. Go to https://elevenlabs.io → **Voice Library**.
2. For Spanish LATAM, search **"Mateo Aragon"** — conversational masculine, persuasive-educational tone. For other languages, try the most-popular voice in that locale.
3. **Text-to-Speech** → paste the script.
4. **Voice settings:**
   - Stability: 50 (don't go higher — voice gets robotic)
   - Similarity: 75
   - Style: 30–40 (gives some emotion without overdoing it)
   - Speaker Boost: ON
5. **Speed:** 0.9–0.95 (slightly slower than default — sounds more cinematic).
6. **Generate** → preview → if you like it, **Download MP3**.
7. Save as `videos/voiceover.mp3` (overwrite the existing one).

### Step 4 — Transcribe with whisper.cpp

This is the HyperFrames gain. From `videos/`:

```powershell
C:\whisper\whisper-cli.exe `
  -m C:\whisper\models\ggml-small.bin `
  -l es `
  -oj `
  -of transcript `
  voiceover.mp3
```

Flags explained:
- **`-m`** — path to model file
- **`-l es`** — language code (use `en`, `pt`, `fr`, `de`, `it`, etc.)
- **`-oj`** — output JSON
- **`-of transcript`** — output filename prefix (writes `transcript.json`)

**Convert the whisper.cpp JSON to the simple word-level array we use** (the framework writes a fuller schema with segments; we just need words). One-liner with `node`:

```bash
node -e "
const data = require('./transcript.json');
const words = [];
for (const seg of data.transcription) {
  for (const w of seg.tokens || []) {
    if (!w.text || w.text.startsWith('[')) continue;
    words.push({ text: w.text.trim(), start: w.offsets.from / 1000, end: w.offsets.to / 1000 });
  }
}
require('fs').writeFileSync('transcript.json', JSON.stringify(words, null, 2));
"
```

> **Tip:** if you generated the JSON via `npx hyperframes transcribe` (when HyperFrames was still around), the format was already this flat shape. The conversion above handles either.

You should now have something like:

```json
[
  { "text": "Hay",  "start": 0.13, "end": 0.27 },
  { "text": "webs", "start": 0.27, "end": 0.58 },
  { "text": "que",  "start": 0.64, "end": 0.91 },
  ...
]
```

### Step 5 — Pick the background music

**YouTube Audio Library** (https://studio.youtube.com/.../music) is the safest source. Filters to use:

- Genre: Cinematic / Corporate / Ambient
- Mood: Inspirational / Hopeful
- Length: 1+ minute (we'll trim — but having extra is good)
- License: **Free for any use, no attribution required**

Save as `videos/music.mp3`.

### Step 6 — Customize the HTML template

Open `videos/video-marketing-services.html`. The pieces you change per client:

| What to change | Where (line range) | Notes |
|---|---|---|
| Iframe URL | `<iframe src="...">` | The target website |
| Iframe wrapper height | `.demo-frame-wrapper { height: 5800px; }` | Should match the target site's full scroll length |
| CSS keyframe `@scroll-tour` | the `@keyframes` block | Hand-tuned camera tour — see Section 7 |
| CTA logo | `<img src="<client>-logo.png">` | The brand logo |
| CTA phone | `+51 972 571 826` | Replace with the client's number |
| Subtitle text | the `.sub` divs at the bottom | Match the actual voice off |
| Subtitle CSS timings | the `.sub-1` ... `.sub-N` rules | Use whisper word timestamps — see Section 8 |

Repeat for `video-marketing-services-vertical.html` (same edits, different layout).

### Step 7 — Run the pipeline

```bash
cd videos
python record_video.py            # renders both square + vertical
python record_video.py square     # only square
python record_video.py vertical   # only vertical
```

Watch the output. Each format takes about **video-duration + 8 seconds**. Total for both formats: ~80 seconds.

### Step 8 — QA the output

Open the MP4s. Check:

1. **Subtitle sync** — every phrase should appear as it's spoken, disappear when it ends.
2. **Subtitle text matches voice** — easy to drift if you tweaked the script after recording.
3. **No white flash at start** — `-ss 0.3` should have trimmed it.
4. **Music doesn't cut off prematurely** — `amix=duration=longest` keeps it past the voice end.
5. **Logo + phone visible on the CTA slide** for the full ~5 seconds.
6. **CTA fully replaces the iframe** — no peek-through.

If something is off, adjust the HTML and re-run. Each render is non-destructive.

---

## 7. The cinematic camera tour explained

The "camera" is a CSS animation on a tall, top-anchored `<iframe>` inside a fixed-size wrapper. We don't actually scroll the page — we **translate the iframe upward** while the wrapper acts as a viewport.

### 7.1 The wrapper + iframe pattern

```css
.demo-frame-wrapper {
  width: 1080px;
  height: 1080px;          /* the visible window into the iframe */
  overflow: hidden;
  position: relative;
}
.demo-frame-wrapper iframe {
  position: absolute;
  top: 0; left: 0;
  width: 1920px;           /* render the site at desktop width even on a square viewport */
  height: 5800px;          /* tall enough to show the full page in one transform pass */
  transform-origin: top center;
  animation: scroll-tour 22s linear forwards;
}
```

The iframe is rendered at **desktop width (1920px)** so the site looks correct, but only the central **1080px** is visible through the wrapper. This is also why the cinematic effect feels more "natural" than zooming a screenshot — the browser is rendering the actual site at its design width.

### 7.2 The `@keyframes scroll-tour`

The tour itself is a hand-tuned multi-stop animation. Each `%` is a moment in the tour:

```css
@keyframes scroll-tour {
  /* DRONE LANDING — start zoomed-in then settle */
  0%   { transform: translateY(0)      scale(1.15); }
  9%   { transform: translateY(0)      scale(1.0);  }   /* land at hero */

  /* HOLD on hero */
  18%  { transform: translateY(0)      scale(1.0);  }

  /* SCROLL to category grid */
  30%  { transform: translateY(-900px) scale(1.0);  }

  /* ZOOM-IN on a featured product */
  45%  { transform: translateY(-2200px) scale(1.06);}

  /* SCROLL through pillars */
  65%  { transform: translateY(-3600px) scale(1.0); }

  /* FINAL SCROLL to footer */
  100% { transform: translateY(-4720px) scale(1.0); }
}
```

**Tuning rules:**

- **First 9% should be the drone landing** — open zoomed-in (1.10–1.20) and settle to 1.0.
- **Use `linear` easing for scroll transitions, not `ease-in-out`** — gives the smoothest perceived motion. The CSS `cubic-bezier` defaults look like an old PowerPoint.
- **Hold longer on visually-important sections** (hero, featured products, CTAs).
- **End on something brand-positive** — footer, contact section, testimonials.
- **Total animation duration** should match the voice-off duration so the tour ends as the voice transitions to the CTA outro.

### 7.3 The CTA slide

A second `<div class="slide cta-slide">` sits stacked over the iframe. It activates after the tour:

```html
<div class="slide demo-slide active" data-duration="22000">
  <iframe ...></iframe>
</div>
<div class="slide cta-slide" data-duration="5000">
  <img class="cta-logo" src="<client>-logo.png" />
  <div class="cta-phone">+51 972 571 826</div>
</div>
```

Same `setTimeout` scheduler from the original pipeline — see Section 5.4 of the prior version of this doc, which is preserved as-is in `record_video.py`'s sister templates.

---

## 8. Subtitle synchronization (the HyperFrames technique)

This is the biggest quality jump from the earlier hand-timed FFmpeg approach. Instead of estimating phrase boundaries, we read them from `transcript.json` with millisecond accuracy.

### 8.1 The pattern: two animations per subtitle

Each subtitle has **two CSS animations stacked** — one for fade-in, one for fade-out — with absolute delays computed from word timestamps:

```css
@keyframes subFadeIn {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes subFadeOut {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(-4px); }
}

/* phrase.start = 0.13s, phrase.end = 1.60s */
.sub-1 {
  animation:
    subFadeIn  0.18s ease-out forwards 0.13s,    /* fade in AT phrase start */
    subFadeOut 0.22s ease-in  forwards 1.60s;    /* fade out AT phrase end */
}
```

**Why this beats the previous `subFade` single-animation pattern:**

The old pattern used a single keyframe with `0%/15%/85%/100%` opacity stops — which forces fade times to be a *percentage* of the animation duration. Short phrases get unrealistically fast fades; long phrases get sluggish ones. The two-animation approach gives you **fixed 0.18s fade-in and 0.22s fade-out regardless of phrase length**, plus exact start/end alignment.

### 8.2 Phrase grouping rules

Don't put every word on screen as its own subtitle — that's a karaoke effect, not a subtitle. Group words into reading-paced phrases:

- **2–3 words** for high-energy / hype scripts
- **3–5 words** for conversational scripts (this is the default)
- **4–6 words** for measured / educational scripts

Break on:

- Sentence boundaries (periods, ?, !).
- Commas with ≥150 ms pause after them.
- Natural rhetorical groupings — `"Y hay webs que / venden por ti"` reads as one breath.

For the Causal AI Digital example, the grouping was:

| Sub | Text | start | end | Source words (whisper indices) |
|---|---|---|---|---|
| 1 | Hay webs que se ven. | 0.13 | 1.60 | 0–4 |
| 2 | Hay webs que se sienten. | 1.72 | 3.15 | 5–9 |
| 3 | Y hay webs que venden por ti. | 3.15 | 5.58 | 10–16 |
| 4 | Aprenden de cada visita. | 6.14 | 8.08 | 17–20 |
| 5 | De cada clic. | 8.08 | 9.68 | 21–23 |
| 6 | Cada web que diseñamos | 9.68 | 10.99 | 24–27 |
| 7 | viene con un chatbot | 10.99 | 12.16 | 28–31 |
| 8 | que conoce todos tus productos | 12.16 | 14.21 | 32–36 |
| 9 | y atiende a tu cliente | 14.21 | 15.98 | 37–41 |
| 10 | siempre. | 15.98 | 16.94 | 42 |
| 11 | Diseño que enamora. | 17.19 | 18.67 | 43–45 |
| 12 | Inteligencia que vende. | 18.67 | 21.04 | 46–48 |

### 8.3 Generating the subtitle CSS programmatically

You can compute the CSS rules from `transcript.json` instead of typing them by hand. Quick generator script (drop in `videos/`):

```javascript
// videos/build-subtitles.js
const words = require('./transcript.json');

// Edit this list to match how you want to group words into phrases.
// Each entry is [phrase text, first word index, last word index].
const phrases = [
  ["Hay webs que se ven.",            0, 4],
  ["Hay webs que se sienten.",        5, 9],
  ["Y hay webs que venden por ti.",  10, 16],
  // ... add more ...
];

console.log("/* generated from transcript.json */");
phrases.forEach(([text, s, e], i) => {
  const start = words[s].start.toFixed(2);
  const end   = words[e].end.toFixed(2);
  const n = i + 1;
  console.log(
    `.sub-${n} { animation: ` +
    `subFadeIn 0.18s ease-out forwards ${start}s, ` +
    `subFadeOut 0.22s ease-in forwards ${end}s; }`
  );
});
console.log("\n<!-- HTML -->");
phrases.forEach(([text], i) => {
  console.log(`<div class="sub sub-${i + 1}">${text}</div>`);
});
```

Run with `node build-subtitles.js > subtitles.css`, then paste the result into the HTML template.

### 8.4 Hide subtitles during the CTA slide

```css
body.cta-active .subtitles { opacity: 0; transition: opacity 0.6s ease; }
```

The slideshow scheduler (in the inline `<script>` at the bottom of the HTML) flips this class when the CTA slide becomes active.

---

## 9. Voice off generation — ElevenLabs deep dive

### 9.1 Voice selection by language

| Language | Recommended voice | Tone |
|---|---|---|
| Spanish (LATAM) | Mateo Aragon | Conversational, persuasive-educational |
| Spanish (Spain) | Bea | Crisp, professional |
| English (US) | Adam | Deep, cinematic |
| English (UK) | Dorothy | Warm, narrator |
| Portuguese (BR) | Antoni | Friendly, approachable |
| French | Charlotte | Smooth, premium |

Always preview 2–3 voices with the same script before committing. The voice choice has more impact on perceived quality than any visual polish.

### 9.2 Tone presets

| Use case | Style | Speed | Stability |
|---|---|---|---|
| Cinematic / luxury | 50–60 | 0.9 | 50 |
| Educational / corporate | 30–40 | 0.95 | 60 |
| Hype / launch | 60–80 | 1.0 | 35 |
| News / journalistic | 20–30 | 1.0 | 70 |

### 9.3 Common gotchas

- **Numbers and dates:** ElevenLabs sometimes pronounces `+51 972 571 826` as "fifty-one nine hundred seventy-two...". Write it phonetically: `más cincuenta y uno, nueve siete dos, cinco siete uno, ocho dos seis`.
- **Brand names:** spell out tricky brands. `Causal AI Digital` works; if it mispronounces, try `Cau-sal A-I Digital` or write a phonetic respelling.
- **Pauses:** ElevenLabs respects `...` (three dots) as a slight pause and double line breaks as a longer pause. Use them.

---

## 10. Multi-format rendering

### 10.1 Format definitions (in `record_video.py`)

```python
FORMATS = {
    "square": {
        "html":      "video-marketing-services.html",
        "raw_webm":  "marketing-raw-square.webm",
        "final_mp4": "<client>-marketing-square.mp4",
        "width":     1080,
        "height":    1080,
    },
    "vertical": {
        "html":      "video-marketing-services-vertical.html",
        "raw_webm":  "marketing-raw-vertical.webm",
        "final_mp4": "<client>-marketing-vertical.mp4",
        "width":     1080,
        "height":    1920,
    },
}
```

Add a `horizontal` entry the same way (1920×1080, with a corresponding `*-horizontal.html`) if you need a YouTube/web cut.

### 10.2 Why two HTML files instead of CSS media queries?

The vertical layout is **not just a width change** — it requires:

- Larger subtitle font (76px vs 1.7rem) so the text reads on a 1080-wide canvas.
- Subtitles positioned higher (480px from bottom vs 90px) to clear native UI bars in Reels/TikTok.
- Stacked CTA layout (logo above tagline above phone, all centered) instead of a horizontal pill.
- A different iframe wrapper height to match a vertical visual rhythm.

A single responsive HTML would muddy the rules. Two clear files are easier to tune.

### 10.3 Windows file-lock retry

A subtle Windows-only bug we hit during the HyperFrames experiment: Playwright closes the browser, but the temp `.webm` file is still held by the OS for a few hundred ms. Renaming it immediately throws `PermissionError 32`.

The fix in `record_video.py`:

```python
# Windows holds the .webm briefly after browser.close() — retry on PermissionError.
for attempt in range(10):
    try:
        latest.rename(raw_webm)
        break
    except PermissionError:
        time.sleep(0.5)
else:
    raise PermissionError(f"Could not rename {latest} after 10 attempts")
```

---

## 11. Audio muxing — FFmpeg flags that matter

The default `record_video.py` mux command is:

```python
cmd = [
    FFMPEG_PATH, "-y",
    "-ss", "0.3", "-i", str(raw_webm),                     # video, trim 0.3s flash
    "-i", str(VOICEOVER),                                   # input #1: voice
    "-i", str(MUSIC),                                       # input #2: music
    "-filter_complex",
    "[1:a]volume=1.0[a1];"                                  # voice 100%
    "[2:a]volume=0.18[a2];"                                 # music 18%
    "[a1][a2]amix=inputs=2:duration=longest[a]",            # mix, keep music past voice
    "-map", "0:v", "-map", "[a]",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "20",
    "-c:a", "aac",
    "-b:a", "192k",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    str(final_mp4),
]
```

| Flag | Why it's there |
|---|---|
| `-ss 0.3` | Trims the first 0.3 s of the recording — Chromium briefly shows a white frame on launch before the page renders. This kills the flash. **Applied to the video input only**, so audio still starts at 0. |
| `volume=0.18` on music | -15 dB ducking. Anywhere from 0.12 to 0.22 sounds right; 0.18 is the safe default. |
| `amix duration=longest` | Without this (or with `-shortest`), the music cuts at the voice's end, which feels abrupt. `longest` lets the music continue past the voice into the CTA slide. |
| `+faststart` | Moves the MP4 metadata to the start of the file so the video begins playing on social platforms before fully downloading. |
| `crf 20` | Visually lossless for source-rendered web content. Drop to 18 if you want even more crispness; bump to 22 if you need smaller files. |
| `yuv420p` | Required for compatibility with social media players. `yuv444p` is rejected by most. |

---

## 12. Output specifications

| Property | Square | Vertical | Horizontal (optional) |
|---|---|---|---|
| **Resolution** | 1080×1080 | 1080×1920 | 1920×1080 |
| **Frame rate** | 25 fps (Playwright default) | 25 fps | 25 fps |
| **Video codec** | H.264 (libx264, CRF 20) | H.264 | H.264 |
| **Audio codec** | AAC, 192 kbps | AAC | AAC |
| **Pixel format** | yuv420p | yuv420p | yuv420p |
| **Container** | MP4 | MP4 | MP4 |
| **Final size** | ~5 MB | ~9 MB | ~15 MB |
| **Native fit** | LinkedIn, IG feed, FB, X | Reels, TikTok, Shorts, IG Stories | YouTube, web hero |

---

## 13. Cost & performance summary

| Item | Cost | Notes |
|---|---|---|
| ElevenLabs (TTS) | $0 (free tier) | 10k chars/mo. A 30-second script is ~250 chars. |
| YouTube Audio Library | $0 | Royalty-free. |
| Playwright + Chromium | $0 | One-time ~150 MB install. |
| FFmpeg | $0 | One-time install. |
| whisper.cpp + small model | $0 | One-time ~482 MB. |
| **Authoring time per client** | 20–40 min | Mostly script writing + tuning the camera tour. |
| **Render time per format** | ~30 s for 25 fps × 28 s output | Both formats: ~80 s. |
| **Storage per client** | ~30 MB | Video assets + final MP4s. |

There is **no recurring cost** to regenerate a video. If the client tweaks their copy, their site, or their phone number, you re-run and ship a fresh deliverable in a minute.

---

## 14. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Subtitle off by ~200 ms | You're using the old `subFade` single-animation pattern | Switch to `subFadeIn`/`subFadeOut` two-animation pattern (Section 8.1) |
| Whisper transcribes Spanish into English | You used a `.en` model | Re-run with `-m ggml-small.bin` (no `.en`) |
| White flash at video start | `-ss 0.3` got removed | Re-add to the video input in the FFmpeg call |
| Music cuts off early | `-shortest` instead of `amix duration=longest` | Switch to `amix=inputs=2:duration=longest` |
| Iframe shows mobile layout | iframe `width` is too narrow | Force `width: 1920px` on the iframe — the wrapper crops it |
| Iframe blank on render | Site blocks iframe embedding (`X-Frame-Options: DENY`) | Capture full-page screenshots and Ken-Burns them instead. Or ask the client to allow your origin. |
| `PermissionError 32` on Windows | Playwright still finalizing `.webm` | The retry loop should handle it. If it persists, increase the loop iterations. |
| FFmpeg not found | Not in `PATH` | Install `imageio-ffmpeg` Python package as fallback (the script auto-detects it). |
| Voice sounds robotic | ElevenLabs Stability too high | Drop to 50, raise Style to 30–40 |
| Subtitle appears AFTER the word | `phrase.start` based on the *whole* word's start time | Subtract 0.05–0.10 s from the start delay if you want a slight lead-in |

---

## 15. Quick reference card

| Task | Command / file |
|---|---|
| Generate voice | https://elevenlabs.io → Mateo Aragon → download as `videos/voiceover.mp3` |
| Transcribe | `C:\whisper\whisper-cli.exe -m C:\whisper\models\ggml-small.bin -l es -oj -of transcript voiceover.mp3` |
| Customize HTML | Edit iframe URL, logo, phone, subtitle text, subtitle CSS in `video-marketing-services.html` (+ `-vertical.html`) |
| Render both formats | `python videos/record_video.py` |
| Render one format | `python videos/record_video.py square` or `... vertical` |
| Output location | `videos/<client>-marketing-{square,vertical}.mp4` |
| Re-render after tweak | Just re-run; no need to clean intermediates — they get overwritten |

---

## 16. Reusing this for a brand-new product

Three things change per client:

1. **Inputs** — new URL, new logo, new phone, new script.
2. **The cinematic tour `@keyframes`** — every site has different visual rhythms. Spend 10–15 minutes per client tuning the percentages so the camera lands on the right sections at the right time.
3. **The CTA outro** — logo, tagline, phone.

Everything else — the slideshow scheduler, the subtitle CSS pattern, the recording loop, the FFmpeg mux command, the multi-format orchestration — is product-agnostic and can be lifted as-is into the next project.

The whisper.cpp + word-level subtitle technique alone is worth standardizing across every video you produce going forward. It eliminates the single biggest quality complaint that ever shipped from this pipeline ("subtitles don't match the voice").
