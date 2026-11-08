"""Mischt Stimme, Musikbett und Sound-Effekte zu einer Tonspur pro Video.

Musik und SFX werden komplett mit ffmpeg synthetisiert (keine Lizenzfragen).
Aufruf: python3 scripts/mix.py            -> public/audio/<vid>_mix.m4a + build/<vid>_mix.wav
"""
import json, subprocess, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUD = ROOT / "public" / "audio"
BUILD = ROOT / "build"
SFX = BUILD / "sfx"
SFX.mkdir(parents=True, exist_ok=True)


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-v", "error", *args], check=True)


def make_sfx():
    gen = {
        "whoosh": ("anoisesrc=color=pink:d=0.5:a=0.6", "highpass=f=500,lowpass=f=7000,afade=t=in:d=0.22,afade=t=out:st=0.22:d=0.28,volume=0.32"),
        "pop": ("aevalsrc='sin(2*PI*(520+900*exp(-30*t))*t)*exp(-22*t)':d=0.2", "volume=0.55"),
        "tick": ("aevalsrc='sin(2*PI*1800*t)*exp(-90*t)':d=0.08", "volume=0.7"),
        "ding": ("aevalsrc='(sin(2*PI*1318*t)+0.6*sin(2*PI*1975*t))*exp(-5*t)':d=0.9", "volume=0.35"),
        "boom": ("aevalsrc='sin(2*PI*(38+90*exp(-14*t))*t)*exp(-4.5*t)':d=0.9", "volume=0.9"),
        "key": ("aevalsrc='(random(0)*2-1)*exp(-120*t)+0.4*sin(2*PI*2400*t)*exp(-150*t)':d=0.05", "highpass=f=1200,volume=0.5"),
    }
    for name, (src, fx) in gen.items():
        ff("-f", "lavfi", "-i", src, "-af", fx + ",aresample=44100", "-ac", "1", str(SFX / f"{name}.wav"))


def bed(path, dur):
    # 100 BPM: weiche Kick, Hi-Hat, Pad wechselt Am <-> F alle 2,4 s
    b = 0.6
    kick = f"0.55*sin(2*PI*(46+70*exp(-28*mod(t,{b})))*mod(t,{b}))*exp(-8*mod(t,{b}))"
    hat = f"0.05*(random(0)*2-1)*exp(-70*mod(t+{b/2},{b}))"
    am = "sin(2*PI*110*t)+sin(2*PI*164.8*t)+sin(2*PI*220*t)+0.7*sin(2*PI*261.6*t)"
    fm = "sin(2*PI*87.3*t)+sin(2*PI*130.8*t)+sin(2*PI*174.6*t)+0.7*sin(2*PI*220*t)"
    pad = f"0.05*if(lt(mod(t,4.8),2.4),{am},{fm})*(0.75+0.25*sin(2*PI*0.4*t))"
    expr = f"{kick}+{hat}+{pad}"
    ff("-f", "lavfi", "-i", f"aevalsrc='{expr}':d={dur}:s=44100",
       "-af", f"lowpass=f=3200,afade=t=in:d=0.8,afade=t=out:st={dur-1.4}:d=1.4,volume=0.55", "-ac", "1", str(path))


def cues(vid, s):
    c = []
    order = list(s.keys())
    for k in order[1:]:
        c.append(("whoosh", s[k]["start"] - 0.25))
    S = lambda k: s[k]["start"]
    E = lambda k: s[k]["end"]
    D = lambda k: s[k]["dur"]
    if vid == "v1":
        c += [("boom", 0.05), ("pop", 1.3)]
        cd = E("quiz") + 0.05
        c += [("tick", cd), ("tick", cd + 1), ("tick", cd + 2), ("ding", S("reveal")), ("pop", S("reveal") - 0.15), ("pop", S("cta") + 3.55)]
    if vid == "v2":
        c += [("pop", S("hook") + 0.4 + i * 0.22) for i in range(7)]
        c += [("ding", S("hook") + 3.0), ("pop", S("legal") + 1.75), ("pop", S("cta") + 2.4)]
    if vid == "v3":
        c += [("ding", S("hook") + 1.5), ("ding", S("action") + D("action") * 0.62 + 2.2), ("pop", S("cta") + 3.4)]
    if vid == "v4":
        a, stamp = S("hook") + 0.3, S("hook") + D("hook") * 0.62
        t = a
        while t < stamp:
            c.append(("key", t)); t += 0.15
        c += [("boom", stamp), ("ding", S("crm") + 2.6), ("pop", S("cta") + 3.6)]
    if vid == "v5":
        c += [("boom", S("hook") + 0.3)] + [("pop", S("hook") + D("hook") * 0.55 + i * 0.18) for i in range(4)]
        c += [("ding", S(k) + 0.05) for k in ("s1", "s2", "s3", "s4")] + [("pop", S("save") + 1.6)]
    return [(n, max(0, t)) for n, t in c]


def main():
    make_sfx()
    tm = json.loads((ROOT / "src" / "timings.json").read_text())
    for vid, v in tm.items():
        dur, segs = v["duration"], v["segs"]
        bed_p = BUILD / f"{vid}_bed.wav"
        bed(bed_p, dur)
        inputs, chains, vo_labels, fx_labels = ["-i", str(bed_p)], [], [], []
        idx = 1
        for k in v["order"]:
            inputs += ["-i", str(AUD / f"{vid}_{k}.wav")]
            ms = int(segs[k]["start"] * 1000)
            chains.append(f"[{idx}:a]adelay={ms}|{ms}[vo{idx}]"); vo_labels.append(f"[vo{idx}]"); idx += 1
        for name, t in cues(vid, segs):
            inputs += ["-i", str(SFX / f"{name}.wav")]
            ms = int(t * 1000)
            chains.append(f"[{idx}:a]adelay={ms}|{ms}[fx{idx}]"); fx_labels.append(f"[fx{idx}]"); idx += 1
        graph = ";".join(chains)
        graph += f";{''.join(vo_labels)}amix=inputs={len(vo_labels)}:normalize=0,asplit=2[vo][sc]"
        graph += f";[0:a][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[duck]"
        graph += f";{''.join(fx_labels)}amix=inputs={len(fx_labels)}:normalize=0[fx]"
        graph += f";[vo][duck][fx]amix=inputs=3:normalize=0:weights=1 0.9 0.8,atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=9,aresample=44100[out]"
        wav = BUILD / f"{vid}_mix.wav"
        ff(*inputs, "-filter_complex", graph, "-map", "[out]", "-ac", "2", str(wav))
        ff("-i", str(wav), "-c:a", "aac", "-b:a", "192k", str(AUD / f"{vid}_mix.m4a"))
        print(vid, "mix ok", len(fx_labels), "sfx")


if __name__ == "__main__":
    main()
