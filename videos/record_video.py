"""
Records both square (1080x1080) and vertical (1080x1920) marketing videos.

Pipeline (per format):
  1. Playwright headless Chromium opens the HTML
  2. Records the page for ~29 seconds while the slideshow auto-plays
  3. FFmpeg muxes silent video + voiceover.mp3 (100%) + music.mp3 (18%)
  4. Output:
     - causal-ai-digital-marketing-square.mp4    (1080x1080)
     - causal-ai-digital-marketing-vertical.mp4  (1080x1920)

Run:
  python videos/record_video.py            # records both formats
  python videos/record_video.py square     # only square
  python videos/record_video.py vertical   # only vertical
"""

from playwright.sync_api import sync_playwright
import time
import subprocess
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
VOICEOVER = ROOT / "voiceover.mp3"
MUSIC = ROOT / "music.mp3"

# Total slideshow duration:
#   Home (6000) + Productos (8500) + Nosotros (4000) + Contacto (4500) + CTA (5000) = 28000ms
# +2s buffer for final fade
TOTAL_DURATION_SEC = 28 + 2


def _find_ffmpeg() -> str:
    """Auto-detect ffmpeg in this priority:
    1. system PATH (winget/brew/apt install)
    2. imageio-ffmpeg bundled binary (pip install imageio-ffmpeg)
    3. fallback to "ffmpeg" string (will fail with clear error)
    """
    found = shutil.which("ffmpeg")
    if found:
        return found
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        pass
    return "ffmpeg"


FFMPEG_PATH = _find_ffmpeg()


# Format definitions
FORMATS = {
    "square": {
        "html": "video-marketing-services.html",
        "raw_webm": "marketing-raw-square.webm",
        "final_mp4": "causal-ai-digital-marketing-square.mp4",
        "width": 1080,
        "height": 1080,
    },
    "vertical": {
        "html": "video-marketing-services-vertical.html",
        "raw_webm": "marketing-raw-vertical.webm",
        "final_mp4": "causal-ai-digital-marketing-vertical.mp4",
        "width": 1080,
        "height": 1920,
    },
}


def record_format(fmt_name: str, fmt: dict) -> bool:
    """Record one format end-to-end (Playwright capture + FFmpeg mux)."""
    html_path = ROOT / fmt["html"]
    raw_webm = ROOT / fmt["raw_webm"]
    final_mp4 = ROOT / fmt["final_mp4"]
    width = fmt["width"]
    height = fmt["height"]

    if not html_path.exists():
        print(f"  ERROR: {html_path.name} not found")
        return False

    print(f"\n=== {fmt_name.upper()} ({width}x{height}) ===")
    print(f"Recording for {TOTAL_DURATION_SEC} seconds...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": width, "height": height},
            record_video_dir=str(ROOT),
            record_video_size={"width": width, "height": height},
            device_scale_factor=1,
        )
        page = context.new_page()
        # Playwright starts recording as soon as the context is created (above), not at
        # goto. So recording_start is measured BEFORE goto for accurate trim alignment.
        recording_start = time.time()
        page.goto(f"file:///{html_path.as_posix()}")

        # Wait for the demo iframe (page-1) to fully load before triggering the slideshow.
        # The HTML's iframe has onload="window.iframe1Loaded=true" — this is reliable
        # because the attribute registers when the HTML parses, before the iframe's
        # network request begins (avoiding the addEventListener race condition).
        try:
            page.wait_for_function(
                "() => window.iframe1Loaded === true",
                timeout=10000,
            )
        except Exception as e:
            print(f"  WARNING: iframe load wait timed out: {e}. Continuing anyway.")

        # Extra grace period for fonts, images, lazy-loaded images, and deferred scripts
        time.sleep(2.0)

        # Capture when the slideshow actually starts — used to trim the iframe-loading
        # warm-up frames out of the final mp4 (-ss flag in FFmpeg below).
        slideshow_start_offset = time.time() - recording_start
        page.evaluate("window.startSlideshow && window.startSlideshow()")
        print(f"  Slideshow started at recording offset = {slideshow_start_offset:.2f}s")

        # Let the slideshow play to the end
        time.sleep(TOTAL_DURATION_SEC)

        page.close()
        context.close()
        browser.close()

        # Find the most recent webm and rename it.
        # Windows holds the .webm file briefly after browser.close() — retry on PermissionError.
        webm_files = list(ROOT.glob("*.webm"))
        latest = max(webm_files, key=lambda f: f.stat().st_mtime)
        if latest != raw_webm:
            if raw_webm.exists():
                raw_webm.unlink()
            for attempt in range(10):
                try:
                    latest.rename(raw_webm)
                    break
                except PermissionError:
                    time.sleep(0.5)
            else:
                raise PermissionError(f"Could not rename {latest} after 10 attempts")
        print(f"  Raw video: {raw_webm.name}")

    # Mux audio
    print("  Muxing audio (voice 100% + music 18%)...")
    if not VOICEOVER.exists():
        print(f"  ERROR: {VOICEOVER.name} not found.")
        return False

    # -ss <offset> trims the iframe-loading warm-up frames from the recording.
    # Applied ONLY to the video input — voice and music still start at 0, so the
    # voice off aligns with the slideshow's internal t=0.
    trim_value = f"{slideshow_start_offset:.3f}"
    print(f"  Trimming first {trim_value}s of video (load warm-up)")
    if not MUSIC.exists():
        print(f"  WARNING: {MUSIC.name} not found. Output will have voice only.")
        cmd = [
            FFMPEG_PATH, "-y",
            "-ss", trim_value, "-i", str(raw_webm),
            "-i", str(VOICEOVER),
            "-c:v", "libx264",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            str(final_mp4),
        ]
    else:
        cmd = [
            FFMPEG_PATH, "-y",
            "-ss", trim_value, "-i", str(raw_webm),
            "-i", str(VOICEOVER),
            "-i", str(MUSIC),
            "-filter_complex",
            "[1:a]volume=1.0[voice];"
            "[2:a]volume=0.18[bgm];"
            "[voice][bgm]amix=inputs=2:duration=longest:dropout_transition=2[mixed]",
            "-map", "0:v", "-map", "[mixed]",
            "-c:v", "libx264",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-shortest",
            str(final_mp4),
        ]

    result = subprocess.run(cmd, check=False)
    if result.returncode != 0:
        print(f"  ERROR: FFmpeg failed for {fmt_name}.")
        return False
    print(f"  [OK] {final_mp4.name}")
    return True


def main():
    # Parse CLI: "square" / "vertical" / nothing (= both)
    args = sys.argv[1:]
    if args and args[0] in FORMATS:
        formats_to_record = [args[0]]
    else:
        formats_to_record = ["square", "vertical"]

    results = {}
    for fmt_name in formats_to_record:
        results[fmt_name] = record_format(fmt_name, FORMATS[fmt_name])

    print("\n" + "=" * 50)
    print("SUMMARY")
    print("=" * 50)
    for fmt_name, ok in results.items():
        status = "[OK]" if ok else "[FAIL]"
        print(f"  {status}  {fmt_name}: {FORMATS[fmt_name]['final_mp4']}")


if __name__ == "__main__":
    main()
