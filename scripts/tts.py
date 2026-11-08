"""Erzeugt die deutsche Sprecherstimme (Piper, Stimme 'Thorsten') und die Timing-Datei.

Aufruf:  python3 scripts/tts.py
Ergebnis: public/audio/<video>_<segment>.wav  +  src/timings.json
"""
import json, re, subprocess, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL = ROOT / "voice" / "de-thorsten-low.onnx"
OUT = ROOT / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

LEAD = 0.5   # Sekunden Stille am Anfang
GAP = 0.32   # Pause zwischen Sätzen
TAIL = 1.6   # Abspann nach letztem Satz

# Leichte Studio-Kette: Höhen öffnen, Nahbesprechung, Kompressor, Lautheit
FX = ("aresample=44100,highpass=f=80,equalizer=f=180:t=q:w=1:g=2,"
      "equalizer=f=3500:t=q:w=1.2:g=3,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,"
      "loudnorm=I=-15:TP=-1.5:LRA=7")


def dur(p):
    return float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)]).decode())


def word_times(cap, start, length):
    """Verteilt die Wörter der Untertitel proportional zur Länge (inkl. Satzpausen)."""
    words = cap.split()
    weights = []
    for w in words:
        wt = len(re.sub(r"[^\wäöüÄÖÜß%]", "", w)) + 2.2
        if re.search(r"\d", w):
            wt += 6  # Zahlen werden ausgeschrieben gesprochen
        if w.endswith((".", "!", "?", ":")):
            wt += 3.5
        elif w.endswith(","):
            wt += 1.5
        weights.append(wt)
    total = sum(weights)
    t, res = start, []
    for w, wt in zip(words, weights):
        d = length * wt / total
        res.append({"w": w, "t": round(t, 3), "d": round(d, 3)})
        t += d
    return res


def main():
    script = json.loads((ROOT / "scripts" / "script.json").read_text())
    timings = {}
    for vid, v in script.items():
        cursor, segs = LEAD, {}
        order = []
        for s in v["segments"]:
            raw = OUT / f"_{vid}_{s['id']}_raw.wav"
            fin = OUT / f"{vid}_{s['id']}.wav"
            subprocess.run(["python3", "-m", "piper", "-m", str(MODEL), "-f", str(raw),
                            "--length-scale", "1.02", "--sentence-silence", "0.18",
                            "--noise-scale", "0.6"],
                           input=s["say"].encode(), check=True, capture_output=True)
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(raw), "-af", FX,
                            "-ar", "44100", str(fin)], check=True)
            raw.unlink()
            d = dur(fin)
            segs[s["id"]] = {"start": round(cursor, 3), "dur": round(d, 3), "end": round(cursor + d, 3),
                            "words": word_times(s["cap"], cursor, d)}
            order.append(s["id"])
            cursor += d + GAP + s.get("gapAfter", 0)
        total = round(cursor - GAP + TAIL, 3)
        timings[vid] = {"title": v["title"], "duration": total, "order": order, "segs": segs}
        print(f"{vid}: {total:.1f}s")
    (ROOT / "src" / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
