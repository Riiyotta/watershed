#!/usr/bin/env python3
"""Derive the source-identity registry that PageSpec `mode: "generated"` must not contain.

Writes
  assets/asset-roles.json        -> "sourceBrand"   (brand / CTA / URL / customer / person / rating / third-party patterns,
                                                     each with evidence, mustMatch and mustNotMatch samples)
  assets/source-copy-hashes.json                    (SHA-256 prefixes of 5-word shingles of the source copy)

Nothing here is invented. Every entry is read from the project the design-repo was extracted from:
  src/**/*.js|jsx      string literals (copy, CTA labels), brand tokens
  src/routes.json      the route slugs: real customer names (/customers/<slug>), people (profile, joins, Q&A slugs), analyst and competitor names
  CLONE_SPEC.md, PAGES_SPEC.md, ASSET_MANIFEST.md   hosts and handles the source links to, brand tokens, quoted copy
Copy is stored as HASHES, never as text, so this repository does not become a second copy of the source's marketing copy
(the three short `canaries` are the only plain-text fragments; each is checked to hash into the set).

The source in this project has two identities, both blocked: the REAL brand (Watershed, watershed.com) whose copy, photography,
logos and customers the clone deliberately omits, and the CLONE brand (Northwind, northwind.example), the fictional stand-in whose
placeholder copy fills the clone. A generated page is a third brand and carries neither.

NO HUMAN HAS REVIEWED THE DERIVED LISTS. They are heuristics over the project's data (see each category's `derivation`),
pinned in extraction/verify_all.py (minimum content, mustMatch / mustNotMatch samples) and re-derived by `--check` whenever the sibling
source tree exists. Detection is string and regex based: a paraphrase, translation or homoglyph spelling that survives NFKC passes.

Run:  python3 extraction/build_source_brand.py [--check]
Without the sibling src/ tree (a standalone copy) it prints a notice and exits 0; verify_all.py then checks the committed registry only.
"""
import hashlib
import json
import os
import re
import sys
import unicodedata

DR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT = os.path.dirname(DR)
SRC = os.path.join(PROJECT, "src")
ROLES = os.path.join(DR, "assets", "asset-roles.json")
HASHES = os.path.join(DR, "assets", "source-copy-hashes.json")
DOCS = ("CLONE_SPEC.md", "PAGES_SPEC.md", "ASSET_MANIFEST.md")
SHINGLE_N = 5
MIN_STRING_WORDS = 5
DICT = "/usr/share/dict/words"

ZERO_WIDTH = re.compile("[​‌‍‎‏⁠⁡⁢⁣⁤﻿­]")
STR_RE = re.compile(r"""(?P<q>['"`])(?P<t>(?:\\.|(?!(?P=q)).)*)(?P=q)""", re.S)
JSX_TEXT_RE = re.compile(r">([^<>{}]+)<")
LOREM = re.compile(r"\b(lorem|ipsum|dolor|consectetur|adipiscing|eiusmod|tempor|incididunt)\b", re.I)
HOST_RE = re.compile(r"\b((?:[a-z0-9-]+\.)+(?:com|io|org|net|co|ai|studio|dev|app|uk|cx|news))\b(/[A-Za-z0-9_./-]*)?", re.I)
# hosts that belong to the clone's own credits / tooling, not to the source's links
NOT_SOURCE_HOSTS = {"creativecommons.org", "stocksnap.io", "www.rawpixel.com", "rawpixel.com", "openverse.org", "www.w3.org", "fonts.googleapis.com",
                    "fonts.gstatic.com", "policies.google.com", "tools.google.com", "p.org"}
STORY_STOP = {"cdp", "earth-day-2021", "fortune-500-media-company", "global-technology-company"}
GENERIC_TOKENS = {"climate", "sustainability", "carbon", "action", "leaders", "profiling", "journey", "program", "mission", "world", "class", "months",
                  "making", "shopping", "sustainable", "millions", "building", "transparency", "banking", "remote", "insights", "protect", "future",
                  "gathering", "invests", "ambition", "rewards", "story", "recap", "customer", "summit", "profile", "leads"}
PERSON_SLUG_RES = [
    (r"^profiling-leaders-in-climate-action-([a-z]+)-([a-z]+)$", 2),
    (r"^climate-leads-profile-([a-z]+)-([a-z]+)-[a-z]+$", 2),
    (r"^([a-z]+)-([a-z]+)-joins-watershed$", 2),
    (r"^profiling-leaders-in-climate-action-([a-z]+)-([a-z]+)$", 2),
    (r"^[a-z0-9-]*-qa-with-([a-z]+)-([a-z]+)-([a-z]+)$", 3),
    (r"^[a-z0-9-]*-a-conversation-with-dr-([a-z]+)-([a-z]+)$", 2),
]
CTA_VERBS = ("get", "try", "book", "request", "explore", "take", "meet", "read", "see", "download", "subscribe", "join", "start", "watch", "register")
CTA_GENERIC = {"read more", "learn more", "see more", "get started", "subscribe", "see all", "read the report"}
ANALYST_KEYWORDS = ("wave", "quadrant", "matrix", "smart-innovators", "research", "report")


def h16(s):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:16]


def norm(s):
    """The one normalisation every matcher shares (kept identical in schema/semantic_validate.py)."""
    s = unicodedata.normalize("NFKC", str(s))
    s = ZERO_WIDTH.sub("", s)
    s = s.replace("‘", "'").replace("’", "'").replace("‚", "'").replace("‛", "'")
    s = s.replace("“", '"').replace("”", '"').replace("„", '"').replace("″", '"').replace("′", "'")
    s = s.replace("‐", "-").replace("‑", "-").replace("‒", "-").replace("–", "-").replace("—", "-")
    return re.sub(r"\s+", " ", s).strip()


def norm_words(s):
    s = norm(s).lower()
    s = re.sub(r"\*|_|`", " ", s)
    return re.findall(r"[a-z0-9]+(?:'[a-z]+)?", s)


def unesc(s):
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\").replace("\\n", " ")


def read(p):
    return open(p, encoding="utf-8", errors="replace").read()


def source_files():
    out = []
    for root, _, fs in os.walk(SRC):
        for fn in sorted(fs):
            if fn.endswith((".js", ".jsx")):
                out.append(os.path.join(root, fn))
    return sorted(out)


def doc_texts():
    return [(d, read(os.path.join(PROJECT, d))) for d in DOCS if os.path.exists(os.path.join(PROJECT, d))]


def english_words():
    return {w.strip().lower() for w in open(DICT, encoding="utf-8", errors="ignore")} if os.path.exists(DICT) else set()


def segment(word, words):
    """Split a concatenated slug (albanyinternational) into dictionary words, fewest parts first; None when it does not split."""
    n = len(word)
    best = [None] * (n + 1)
    best[0] = []
    for i in range(1, n + 1):
        for j in range(0, i - 2):
            if best[j] is not None and word[j:i] in words and len(word[j:i]) >= 3:
                cand = best[j] + [word[j:i]]
                if best[i] is None or len(cand) < len(best[i]):
                    best[i] = cand
    if best[n] and len(best[n]) > 1:
        return best[n]
    # fallback: a dictionary word of 5+ letters at the end, with a 2+ letter head (smithsgroup -> smiths group, aresmanagement -> ares management)
    if n >= 9:
        for k in range(2, n - 4):
            if word[k:] in words:
                head = word[:k]
                return (segment(head, words) or [head]) + [word[k:]]
    return None


def sep_pattern(parts):
    return r"(?<![A-Za-z0-9])" + r"[\s\-_.]*".join(re.escape(p) for p in parts) + r"(?![A-Za-z0-9])"


def name_pattern(parts):
    """Unspaced form in any case; the spaced form only in its capitalised spelling (so 'world market' as plain words is not a customer)."""
    if len(parts) == 1:
        return sep_pattern(parts)
    cap = [p.capitalize() for p in parts]
    return r"(?<![A-Za-z0-9])(?:" + re.escape("".join(parts)) + r"|(?-i:" + r"[\s\-_.]*".join(re.escape(p) for p in cap) + r"))(?![A-Za-z0-9])"


def routes():
    return json.load(open(os.path.join(SRC, "routes.json"), encoding="utf-8"))["templates"]


def slug(p):
    return p.rstrip("/").split("/")[-1]


# ------------------------------------------------------------------ copy
def copy_strings():
    out = []
    texts = [read(p) for p in source_files()] + [t for _, t in doc_texts()]
    for t in texts:
        cands = [m.group("t") for m in STR_RE.finditer(t)] + [m.group(1) for m in JSX_TEXT_RE.finditer(t)] + re.findall(r"“([^”]{20,})”", t)
        for c in cands:
            c = unesc(c).strip()
            if re.search(r"[{}=;<>\\]|=>|\$\{|https?://|\.(png|svg|webp|jpg|jpeg|mp4|css|jsx?)\b", c):
                continue
            w = norm_words(c)
            if len(w) < MIN_STRING_WORDS or LOREM.search(c):
                continue
            if sum(1 for x in w if re.fullmatch(r"[a-z']+", x)) / len(w) < 0.7:
                continue
            if sum(1 for x in w if x in ("flex", "items", "center", "px", "rounded", "text", "bg", "grid", "gap", "mt", "mb")) >= 3:
                continue
            out.append(w)
    return out


def shingles(strings):
    s = set()
    for w in strings:
        for i in range(len(w) - SHINGLE_N + 1):
            s.add(h16(" ".join(w[i:i + SHINGLE_N])))
    return sorted(s)


def canaries(strings):
    """Three 6-word runs of the source copy used by verify_all to prove the validator still rejects source copy (plain text, on purpose)."""
    picks = []
    for w in sorted(strings, key=lambda x: (-len(x), x)):
        if len(w) >= 8 and all(len(x) > 2 for x in w[:6]):
            picks.append(" ".join(w[:6]))
        if len(picks) == 3:
            break
    return picks


# ------------------------------------------------------------------ entities
def brand_tokens():
    seen = {}
    pool = [(os.path.relpath(p, PROJECT), read(p)) for p in source_files()] + doc_texts() + [("src/routes.json", read(os.path.join(SRC, "routes.json")))]
    for f, t in pool:
        for m in re.finditer(r"(watershed\w*|northwind\w*)", t, re.I):
            seen.setdefault(m.group(1).lower(), (f, t[:m.start()].count("\n") + 1))
    return seen


def people_and_customers(words):
    r = routes()
    people, customers = {}, {}
    all_slugs = [slug(p) for k in ("customer-story", "blog-post") for p in r.get(k, [])]
    for s in all_slugs:
        for rx, n in PERSON_SLUG_RES:
            m = re.search(rx, s)
            if m:
                people[" ".join(x.capitalize() for x in m.groups()[:n])] = s
    person_tokens = {t.lower() for name in people for t in name.split()}
    for p in r.get("customer-story", []):
        s = slug(p)
        if s in STORY_STOP:
            continue
        toks = s.split("-")
        if len(toks) == 1 or (len(toks) == 2 and s not in ("climate-leads",)):
            base = re.sub(r"\d+$", "", s.replace("-", "")) if len(toks) == 1 else s
            parts = [re.sub(r"\d+$", "", x) for x in toks] if len(toks) == 2 else (segment(base, words) or [base])
            customers[" ".join(parts)] = (p, parts)
            continue
        if any(re.search(rx, s) for rx, _ in PERSON_SLUG_RES) and not s.startswith("climate-leads-profile"):
            continue
        for t in toks:
            tt = re.sub(r"\d+$", "", t)
            if len(tt) >= 4 and tt not in GENERIC_TOKENS and tt not in person_tokens and tt not in words and tt not in ("does", "okta1"):
                customers.setdefault(tt, (p, [tt]))
        if s.startswith("climate-leads-profile"):
            customers.setdefault(toks[-1], (p, [toks[-1]]))
        if s.startswith("profiling-leaders-in-climate-action-") and len(toks) == 6:
            customers.setdefault(toks[-1], (p, [toks[-1]]))
    return people, customers


def analyst_and_competitors():
    r = routes()
    analysts, competitors = {}, {}
    cnt = {}
    for k in r:
        for p in r[k]:
            s = slug(p)
            if any(w in s for w in ANALYST_KEYWORDS):
                for t in s.split("-"):
                    if len(t) >= 6 and not t.isdigit():
                        cnt.setdefault(t, set()).add(p)
    for t, ps in cnt.items():
        if len(ps) >= 3 and t in ("forrester", "verdantix"):
            analysts[t] = sorted(ps)[0]
    for p in r.get("compare", []):
        s = slug(p)
        if s != "compare":
            competitors[s] = p
    return analysts, competitors


def urls():
    hosts, handles = {}, {}
    for f, t in doc_texts():
        for m in HOST_RE.finditer(t):
            h = m.group(1).lower()
            if h in NOT_SOURCE_HOSTS or h.endswith(".example") or "northwind" in h:
                continue
            hosts.setdefault(h, f)
        for m in re.finditer(r"linkedin\.com/(company|in)/([A-Za-z0-9_-]+)", t):
            handles.setdefault("linkedin.com/%s/%s" % (m.group(1), m.group(2).lower()), f)
    return hosts, handles


def cta_labels():
    found = {}
    rx = re.compile(r"""\b(?:label|cta|button|primary|demoLabel)\s*:\s*(?P<q>['"])(?P<t>(?:\\.|(?!(?P=q)).)*)(?P=q)""")
    for p in source_files():
        for m in rx.finditer(read(p)):
            t = unesc(m.group("t")).strip()
            w = norm_words(t)
            if 2 <= len(w) <= 5 and w[0] in CTA_VERBS and " ".join(w) not in CTA_GENERIC and "northwind" not in w:
                found.setdefault(" ".join(w), (os.path.relpath(p, PROJECT), t))
    return found


def first_line(path, needle):
    for i, line in enumerate(read(path).split("\n"), 1):
        if needle.lower() in line.lower():
            return i
    return 1


def build():
    strings = copy_strings()
    words = english_words()
    bt = brand_tokens()
    assert set(re.sub(r"(watershed|northwind).*", r"\1", t) for t in bt) == {"watershed", "northwind"}, sorted(bt)
    people, customers = people_and_customers(words)
    analysts, competitors = analyst_and_competitors()
    hosts, handles = urls()
    ctas = cta_labels()

    def ev(f, quote):
        return {"ref": f, "quote": quote}

    def src_line(token):
        for p in source_files():
            if token in read(p).lower():
                rel = os.path.relpath(p, PROJECT)
                return "%s:%d" % (rel, first_line(p, token))
        return "CLONE_SPEC.md:1"

    brand = [
        {"id": "brand-watershed", "pattern": r"water[\s\-_.]{0,2}shed", "flags": "i",
         "description": "The real company name in any spelling or compound: Watershed, watershed.com, watershedclimate, watershedcom, 'Water shed'. Substring match on purpose: the word is the brand.",
         "mustMatch": ["Watershed", "Why Watershed", "watershed.com", "watershedclimate", "W​ATERSHED", "ｗａｔｅｒｓｈｅｄ"],
         "evidence": [ev("CLONE_SPEC.md:1", "Source: https://watershed.com/en-GB"), ev(src_line("watershed"), "never surface the source brand")]},
        {"id": "brand-northwind", "pattern": r"north[\-_]?wind", "flags": "i",
         "description": "The clone's fictional stand-in brand (Northwind, northwind.example, NORTHWIND): the identity of the extracted clone itself. A generated page is a third brand.",
         "mustMatch": ["Northwind", "NORTHWIND", "northwind.example", "Try Northwind"],
         "evidence": [ev(src_line("northwind"), "Northwind")]},
    ]
    program = [
        {"id": "program-climate-leads", "pattern": r"(?<![A-Za-z])climate[\s\-]+leads(?![A-Za-z])", "flags": "i",
         "description": "A named programme of the source (route /climate-leads, template.climate-leads).", "mustMatch": ["Climate Leads", "climate-leads"],
         "evidence": [ev("src/routes.json", "/climate-leads")]},
        {"id": "program-ai-fellowship", "pattern": r"(?<![A-Za-z])ai[\s\-]+fellow(?:ship|s)?(?![A-Za-z])", "flags": "i",
         "description": "A named programme of the source (route /ai-fellowship).", "mustMatch": ["AI Fellowship", "AI fellows"],
         "evidence": [ev("src/routes.json", "/ai-fellowship")]},
    ]
    cta = [{"id": "cta-verb-brand", "pattern": r"\b(?:get|try|meet|book|request|download|join|start|explore|choose|see|why)\s+(?:the\s+|a\s+|an\s+|your\s+)?(?:water[\s\-_.]{0,2}shed|north[\-_]?wind)\b", "flags": "i",
            "description": "Brand-verb call-to-action labels: Try Northwind, Meet Northwind, Book a Watershed demo.",
            "mustMatch": ["Try Northwind", "Meet Northwind.", "Why Watershed", "Book a Watershed demo", "Get Watershed"],
            "evidence": [ev(src_line("try northwind"), "label: 'Try Northwind'")]}]
    for lab, (f, quote) in sorted(ctas.items()):
        cta.append({"id": "cta-" + re.sub(r"[^a-z0-9]+", "-", lab).strip("-"), "pattern": r"(?<![A-Za-z0-9])" + r"\s+".join(re.escape(x) for x in lab.split()) + r"(?![A-Za-z0-9])", "flags": "i",
                    "description": "Exact call-to-action label used by the source clone's own content.", "mustMatch": [quote], "evidence": [ev("%s:%d" % (f, first_line(os.path.join(PROJECT, f), quote)), quote)]})
    url = []
    for h, f in sorted(hosts.items()):
        host_rx = (r"(?:www\.)?" + re.escape(h[4:])) if h.startswith("www.") else re.escape(h)
        url.append({"id": "url-" + re.sub(r"[^a-z0-9]+", "-", h), "pattern": r"(?<![A-Za-z0-9.-])" + host_rx + r"(?![A-Za-z0-9-])", "flags": "i",
                    "description": "A host the source documents link to or embed (the source's own domains, customer sites, press outlets, embeds, form and CDN hosts).", "mustMatch": [h, "https://" + h + "/x"],
                    "evidence": [ev(f, h)]})
    for hd, f in sorted(handles.items()):
        url.append({"id": "url-" + re.sub(r"[^a-z0-9]+", "-", hd), "pattern": re.escape(hd).replace(r"linkedin\.com", r"linkedin\.com"), "flags": "i",
                    "description": "A social profile the source's footer links to.", "mustMatch": ["https://www." + hd], "evidence": [ev(f, hd)]})
    customer = []
    ambiguous = []
    for label, (p, parts) in sorted(customers.items()):
        single = len(parts) == 1
        if single and (parts[0] in words) and not parts[0].isupper():
            ambiguous.append(label)
            continue
        customer.append({"id": "customer-" + re.sub(r"[^a-z0-9]+", "-", label), "pattern": name_pattern(parts), "flags": "i",
                         "description": "A real company the source features (its /customers/<slug> route slug%s)." % (", split into words with the system word list" if len(parts) > 1 and len(parts) != len(label.split("-")) else ""),
                         "mustMatch": ["".join(parts).title() if len(parts) == 1 else " ".join(x.capitalize() for x in parts), "".join(parts)], "evidence": [ev("src/routes.json", p)]})
    person = []
    for name, s in sorted(people.items()):
        person.append({"id": "person-" + re.sub(r"[^a-z0-9]+", "-", name.lower()), "pattern": sep_pattern(name.lower().split()), "flags": "i",
                       "description": "A real person named in a source route slug (profile, joins, Q&A or conversation page); first names alone are not matched.", "mustMatch": [name],
                       "evidence": [ev("src/routes.json", s)]})
    rating = [
        {"id": "rating-star-glyph", "pattern": "[★☆⭐]", "flags": "",
         "description": "Star glyphs used for ratings and review badges.", "mustMatch": ["★★★★★", "⭐ 4.8"], "evidence": [ev("CLONE_SPEC.md:90", "Award badge shadow (award and review badge slots, section home.awards)")]},
        {"id": "rating-score", "pattern": r"(?<![\d.])[0-5](?:\.\d)?\s*(?:/\s*5|out\s+of\s+5)\b|\b[0-5](?:\.\d)?\s*stars?\b", "flags": "i",
         "description": "A numeric review score (4.8/5, 4.8 out of 5, 5 stars).", "mustMatch": ["4.8/5", "4.8 out of 5", "5 stars"], "evidence": [ev("CLONE_SPEC.md:90", "Award badge shadow (award and review badge slots, section home.awards)")]},
        {"id": "rating-review-platform", "pattern": r"(?<![A-Za-z0-9])g2(?![A-Za-z0-9])", "flags": "i",
         "description": "A review platform the source links to (g2.com), used to cite ratings.", "mustMatch": ["G2", "rated on G2"], "evidence": [ev("PAGES_SPEC.md:1", "g2.com")]},
    ]
    for a, p in sorted(analysts.items()):
        rating.append({"id": "rating-analyst-" + a, "pattern": sep_pattern([a]), "flags": "i",
                       "description": "An analyst firm whose ranking, wave or quadrant the source cites as an award.", "mustMatch": [a.title()], "evidence": [ev("src/routes.json", p)]})
    third = []
    for c, p in sorted(competitors.items()):
        third.append({"id": "third-" + c, "pattern": sep_pattern([c]), "flags": "i", "description": "A competitor the source compares itself with (/compare/<slug>). Real company, not the source's customer: a match warns.",
                      "mustMatch": [c.title()], "evidence": [ev("src/routes.json", p)]})
    for t in ("storylane", "hubspot", "sanity", "unicorn studio"):
        if any(t in tx.lower() for _, tx in doc_texts()):
            third.append({"id": "third-" + re.sub(r"[^a-z0-9]+", "-", t), "pattern": sep_pattern(t.split()), "flags": "i",
                          "description": "A third-party service the source stack uses (CLONE_SPEC / PAGES_SPEC); a match warns.", "mustMatch": [t.title()], "evidence": [ev("CLONE_SPEC.md:9", t)]})
    for pats in (brand, program, cta, url, customer, person, rating, third):
        for p in pats:
            re.compile(p["pattern"], re.I if "i" in p["flags"] else 0)
    cats = {
        "brand": {"code": "GENERATED_MODE_BRAND", "severity": "error", "patterns": brand,
                  "mustNotMatch": ["Larkwell", "waterfall", "water supply", "northern winds", "north wind blows", "Quenby"]},
        "program": {"code": "GENERATED_MODE_THIRD_PARTY", "severity": "warn", "patterns": program, "mustNotMatch": ["climate lead", "fellow travellers"]},
        "cta": {"code": "GENERATED_MODE_CTA", "severity": "error", "patterns": cta, "mustNotMatch": ["Start a free trial", "Talk to our team", "Try Larkwell"]},
        "url": {"code": "GENERATED_MODE_URL", "severity": "error", "patterns": url, "mustNotMatch": ["https://larkwell.example/start", "docs.larkwell.invalid"]},
        "customer": {"code": "GENERATED_MODE_CUSTOMER", "severity": "error", "patterns": customer, "mustNotMatch": ["Larkwell Foods", "Acme Logistics"]},
        "person": {"code": "GENERATED_MODE_PERSON", "severity": "error", "patterns": person, "mustNotMatch": ["Ines Calloway", "Tomas Verhoeven"]},
        "rating": {"code": "GENERATED_MODE_RATING", "severity": "error", "patterns": rating, "mustNotMatch": ["Rated by our pilot customers", "Version 4.8.2"]},
        "thirdParty": {"code": "GENERATED_MODE_THIRD_PARTY", "severity": "warn", "patterns": third, "mustNotMatch": ["Larkwell"]},
    }
    reg = {
        "$comment": "GENERATED by extraction/build_source_brand.py from the project's src/, routes and specs. Not human-reviewed. Do not hand-edit; re-run the script.",
        "reviewStatus": "UNREVIEWED. Every pattern was derived by a script (heuristics named in each category's derivation) from literals found in the source project; no human has reviewed the set. It is exact-text and regex matching on NFKC-normalised text: a paraphrase, a translation or a spelling that survives normalisation passes, ordinary words inside the brand (the substring 'watershed') are blocked on purpose, and ambiguous English-word customer names are not matched in text.",
        "normalization": "Before matching, every string is NFKC-normalised, zero-width and soft-hyphen characters are removed, curly quotes become straight quotes, dashes become hyphens and runs of whitespace collapse to one space. Patterns are matched with re.search (flags per pattern).",
        "scope": "Matched against every human-readable string of a `mode: generated` PageSpec (route, headings, body, labels, items, alt text, hrefs). Structural vocabulary (template and section ids, variant names, assetRole, tone, motion ids) is exempt: it is the contract's own vocabulary.",
        "derivation": {
            "brand": "Brand tokens found in src/, routes and the specs: %s. 'watershed' is the real company, 'northwind' the clone's stand-in (src/content/seed.js maps the former to the latter)." % ", ".join(sorted(bt)),
            "program": "Programme names of the source read from its routes (/climate-leads, /ai-fellowship). Warns only: both are plain phrases.",
            "cta": "Brand-verb labels plus every verb-led 2 to 5 word label found in a label/cta/button/primary field of src/ (generic labels such as 'Read more' excluded).",
            "url": "Every host named in CLONE_SPEC.md, PAGES_SPEC.md and ASSET_MANIFEST.md except the clone's own image-credit hosts, plus social profile handles.",
            "customer": "/customers/<slug> route slugs: single or two-word slugs, concatenated slugs split with the system word list, and non-dictionary tokens of sentence-style slugs. %d single-word names that are English words are NOT matched in text (listed in ambiguousEnglishWordNames); they are still blocked as logos (asset role)." % len(ambiguous),
            "person": "Names parsed from route slugs of profile, joins, Q&A and conversation pages.",
            "rating": "Star glyphs, numeric scores, the review platform g2.com and the analyst firms whose ranking slugs recur in the routes.",
            "thirdParty": "Competitors from /compare/<slug> routes and third-party services named in the specs: real companies a generated page may mention, so a match only warns.",
        },
        "ambiguousEnglishWordNames": sorted(ambiguous),
        "categories": cats,
        "copy": {
            "code": "GENERATED_MODE_COPY",
            "file": "assets/source-copy-hashes.json",
            "shingleWords": SHINGLE_N,
            "minStringWords": MIN_STRING_WORDS,
            "sourceStrings": len(strings),
            "canaries": canaries(strings),
            "note": "A text field is rejected when any run of 5 consecutive normalised words (lower-case, punctuation stripped) hashes to a source shingle. Source strings shorter than 5 words (labels, short headings) are not checked: too generic to attribute. The source strings are the clone's own placeholder copy (string literals of src/) and any quoted copy in the specs; the real company's copy is not in the project.",
        },
    }
    hashes = {"$comment": "GENERATED by extraction/build_source_brand.py. SHA-256 prefixes (16 hex) of 5-word shingles only; no source text is stored here.", "copyShingles": shingles(strings)}
    reg["counts"] = {"patterns": sum(len(c["patterns"]) for c in cats.values()), "byCategory": {k: len(v["patterns"]) for k, v in cats.items()},
                     "ambiguousCustomerNames": len(ambiguous), "copyShingles": len(hashes["copyShingles"]), "sourceStrings": len(strings)}
    return reg, hashes


def dump(d):
    return json.dumps(d, indent=2, ensure_ascii=False) + "\n"


def main():
    if not os.path.isdir(SRC) or not os.path.exists(os.path.join(SRC, "routes.json")):
        print("src/ is not beside design-repo/: source brand registry NOT rebuilt (standalone copy)")
        return 0
    reg, hashes = build()
    roles = json.load(open(ROLES, encoding="utf-8"))
    if "--check" in sys.argv:
        ok = roles.get("sourceBrand") == reg and read(HASHES) == dump(hashes)
        print("source brand registry up to date" if ok else "source brand registry OUT OF DATE (run extraction/build_source_brand.py)")
        return 0 if ok else 1
    roles["sourceBrand"] = reg
    open(ROLES, "w", encoding="utf-8").write(dump(roles))
    open(HASHES, "w", encoding="utf-8").write(dump(hashes))
    print("wrote sourceBrand", reg["counts"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
