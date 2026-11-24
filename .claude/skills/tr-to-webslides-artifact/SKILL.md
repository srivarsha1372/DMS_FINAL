---
name: tr-to-webslides-artifact
description: Turn a TR doc (PDF, DOCX, Markdown or text) into a NxtWave WebSlides deck, with the TR's content drawn as the kit's visualisations (flows, layers, status lists, code builds, terminals, figures), and publish it as a claude.ai Artifact, a private link that opens the deck in the browser with the presenter's annotation marker (pen, highlighter, shapes, eraser, undo) working. Use when the user gives a TR doc and asks for web slides, a webslides artifact, a deck link, "make slides from this TR", "publish the deck as an artifact", asks to share a built deck as an artifact, or asks whether a deck can be annotated / drawn on. Runs the repo's own pipeline end to end (TR intake, concept map, slide-wise plan with a visual per slide, sign-off gate, generation with the slide-kit, annotation gate, single-file build, verification), converts the dist-single HTML into an artifact page, checks it in a sandboxed frame, and publishes it.
---
<!-- cSpell:ignore webslides NxtWave devPort pdftotext pypdf -->

# TR doc → WebSlides → Artifact

This skill is the **front door and the last mile**. The middle (planning and
generating the deck) belongs to the skills this repo already has, and this file
does not restate them: it says when to hand over to them and what to do with
their output.

```
TR doc ──▶ A. intake ──▶ B. plan + a visual per slide ──▶ ✋ sign-off
                                                              │
                         C. generate + build + verify (generate-slides)
                                                              │
                         C2. annotation gate (marker present, marker-check CLEAN)
                                                              │
         E. publish ◀── D. convert + artifact-check (sandboxed frame)
```

Helper scripts, all in `.claude/skills/tr-to-webslides-artifact/scripts/`:

| Script | Does |
|---|---|
| `read-tr.py <tr> <out.md>` | PDF / DOCX / MD / TXT → text, one `--- page N ---` block per PDF page; flags pages with no text layer |
| `to-artifact.mjs <built.html> [out.html] [--title "…"]` | `dist-single/<htmlName>.html` → a page the Artifact tool can publish; checks the 16 MB limit and external URLs |
| `artifact-check.mjs <dist-artifact/page.html> [--session <dir>]` | loads the converted page the way the viewer does (tool skeleton, sandboxed opaque-origin iframe, strict CSP) and checks render, navigation and the annotation marker; exits 1 on any failure |

---

## A. Intake: settle the names, read the whole TR

1. **Names.** You need `<course>` (a folder under `Outputs/`) and
   `<session>` (snake_case, e.g. `17_authorization`). Take them from the user's
   message or the TR's title and the existing course folders. Ask with
   `AskUserQuestion` only if the course is genuinely unclear; never ask for the
   session name if the TR has a title.
2. **Copy the TR in** to `Outputs/<course>/session_plans/<session>/` (keep the
   original filename), so the plan and its source sit together, per CLAUDE.md.
3. **Extract it:**

   ```bash
   python -I .claude/skills/tr-to-webslides-artifact/scripts/read-tr.py \
     "Outputs/<course>/session_plans/<session>/<tr file>" \
     Outputs/<course>/session_plans/<session>/tr.md
   ```

   PDF needs `pdftotext` (poppler) or `pip install pypdf`. Then **read all of
   `tr.md`**, not the first screenful. Any page reported "no text layer" is a
   screenshot or diagram: open the PDF at that page with the Read tool
   (`pages: "N"`) and look at it. A TR's screenshots are often the very thing a
   slide must show.
4. If the user already has a signed-off `plan.md` for this session, skip to C.
   If they only want an existing built deck published, skip to D.

## B. Plan, then stop at the gate

Hand over to the repo's procedure. Read and follow, in order:

1. `slide-kit/workflow/SLIDE_WORKFLOW.md`, stages 1 and 2 (concept map of at most
   four concepts; the fixed frame; one named framework per concept; the term
   ledger; the per-slide fields).
2. `.claude/skills/slide-content-rules/SKILL.md` (hard rules on every line of
   copy) and `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` sections 2, 2b, 3.
3. Use `Rules_beta/session_plans/authorization/plan.md` as the worked example of
   a plan made from a TR PDF: its header table (Source, Deck project,
   Deliverable, `devPort`, `slideCount`) is the shape to copy, plus one extra
   row, `Artifact | (filled in at stage E)`.

### B1. Every content slide names its visual

The TR is source material, not a script: a TR page of prose or a pasted
Postman capture almost never becomes a slide of prose or a screenshot. For each
planned content slide, add a **Visual** field naming the kit form that draws
the slide's argument, and the TR page it comes from. Pick the form from what the
content *argues* (`slide-kit/workflow/STYLE_GUIDE.md` §8), from the slide types
and building blocks in generate-slides §2, and from the existing figures in
generate-slides §3. The usual mapping from what a TR page holds:

| The TR page holds | Draw it as | Not |
|---|---|---|
| an ordered procedure, setup steps | `ProceduralStepsSlide` / `StepList` | a bullet list |
| a request, decision or pipeline with branches | `FlowChartSlide` / `FlowChart` (or `@/ui/flowchart/*`) | prose describing arrows |
| parts of one system at different depths | `LayerStack` | a grid of cards |
| rows that each carry a verdict (allowed / denied, works / fails) | `StatusPointsSlide` / `StatusList` | stacked `Callout`s |
| request → response pairs, status codes | outcome cards: method, status, message (`StatusList`, `DataTable`) | the raw Postman screenshot |
| one idea reaching many places | `RadialSpread` | equal cards |
| a comparison of two approaches | `SplitCompare` (not on the barrel: `@/ui/features/SplitCompare`) | two paragraphs |
| an analogy the TR leans on (office building, ticket gate …) | `AnalogyMap`, `Illustration`, `Nova` | stock decoration |
| code that is the lesson, built up | `CodeBuildSlide` (one reveal step per rule) | one slide per TR page of it |
| the shape of a construct or command | `CodeSyntaxSlide` / `CommandSyntaxSlide` | `CodeBuildSlide` |
| a command actually run | `ContentSlide` + `Terminal` (real output only, hard rule 3) | invented output |
| a screenshot that IS the point (no text layer in `tr.md`) | `Shot` from `public/shots/`, cropped (hard rule 11) | full-window capture |

`Rules_beta/session_plans/authorization/plan.md` §1 is the worked example of
this cut: 22 code or Postman pages of a 64-page TR became five code slides and
a set of visuals, keeping every idea in the source's order. If no kit form fits
a slide's argument, say so in the plan; a new component goes into the kit by
PR (generate-slides §6), never into the session alone.

Write it to `Outputs/<course>/session_plans/<session>/plan.md` with
`**STATUS: AWAITING SIGN-OFF**` as the first bold line, give the user a short
summary (concepts, framework per concept, slide count) and **stop**. Never
write `SIGNED OFF` yourself.

If the user says to skip sign-off, say once that reordering after generation
means rebuilding steps and captures, then do as they ask (generate-slides §0).

## C. Generate, build, verify

When the plan is signed off, follow `.claude/skills/generate-slides/SKILL.md`
**in full**. That skill owns scaffolding (CLAUDE.md "Starting a new course",
steps 2 to 4, unique `devPort`), composing kit components, the carry-forward
standard, motion, and the verification sweep. Nothing here overrides it.

It ends with:

```bash
cd Outputs/<course>/<session>
npm install            # first time only
npm run typecheck
npm run build:html     # → dist-single/<htmlName>.html
```

plus the sweeps generate-slides §7 lists. Report what passed, what failed and
what was not run **before** publishing; an artifact link to a deck that failed
`qa.mjs` is still a broken deck.

Practical notes (seen on Windows, 2026-11-20): `npm install` prints an
`allow-scripts` warning for esbuild's postinstall; the build works without it.
`qa.mjs` and `video-safe.mjs` drive the **dev server** on the port in
`deck.config.json`, so start `npx vite --port <devPort> --strictPort` first;
`marker-check.mjs` reads the built file and needs no server. On Windows set
`CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"` (or Edge
at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`).

## C2. Annotation gate: the marker must be in the deck, and must work

Presenters draw on slides with the kit's **marker** (`src/deck/annotate/`):
`M` opens it; pen, marker pen, highlighter, line, arrow, rectangle, ellipse,
eraser, undo/redo, hide, per-slide or deck-wide ink (full key table in
`slide-kit/slide-template/README.md`, "The marker"). It is kit code, so a deck
has it **only if its `src/deck/` is on a kit that has it.** Decks built from an
older kit snapshot do not (the Authorization deck in `Rules_beta/Output/` did
not, 2026-11-20). Never hand-write a drawing layer into a session.

1. **Is it there?**

   ```bash
   ls Outputs/<course>/<session>/src/deck/annotate/useAnnotate.ts
   ```

2. **If it is missing, bring the session onto the current kit**:

   ```bash
   cd slide-kit/slide-template
   node sync-kit.mjs --check ../../Outputs/<course>/<session>     # what is behind
   node sync-kit.mjs --apply ../../Outputs/<course>/<session>
   ```

   - `--apply` overwrites kit files and backs nothing up. Run it on a clean,
     committed tree, on a branch (`branch-from-main`).
   - If the plan is **SIGNED OFF**, a sync changes the rendered deck, not just
     adds the marker. Tell the user that before applying, and re-run every sweep
     after it.
   - **`sync-kit` does not copy `public/`.** The current `FeedbackSlide`
     loads `/assets/feedback-qr.png`; a session synced from an older kit has
     no such file and the build prints `Missing files: /assets/feedback-qr.png`
     (the QR then renders as a broken image). Compare and copy what is missing:

     ```bash
     cp -n slide-kit/slide-template/public/assets/* Outputs/<course>/<session>/public/assets/
     ```

     The build must say `Inlined N/N assets`, with no `Missing files` line.
   - Then `npm run typecheck && npm run build:html` and the C sweeps again.

3. **Prove it works in the built file:**

   ```bash
   node marker-check.mjs      # 48 checks, must print CLEAN
   ```

## D. Convert the build into an artifact page

## D. Convert the build into an artifact page

The Artifact tool wraps a page in its own `<!doctype><head><body>`, so the
build's own wrappers must go, and its `<title>` must sit in the first 8 KB
(the inlined favicon otherwise pushes it out). The script does both and keeps
every inlined style, font and script verbatim:

```bash
node .claude/skills/tr-to-webslides-artifact/scripts/to-artifact.mjs \
  Outputs/<course>/<session>/dist-single/<htmlName>.html \
  Outputs/<course>/<session>/dist-artifact/<htmlName>.html \
  --title "<Session name>"
```

- Write it to `dist-artifact/` inside the session, never over `dist-single/`
  (that file is the instructor deliverable and is committed).
  `dist-artifact/` is a build product; if git starts tracking it, add
  `**/dist-artifact/` to the root `.gitignore`, in the `**/`-prefixed style the
  repo requires.
- Exit 1 means the page would break inside an artifact: over 16 MB (shrink the
  images in `public/shots/`), or an external `src`/`href` the artifact sandbox
  blocks (inline it). Fix, rebuild, convert again.
- `--title` is the session name as the deck shows it, not "Session N" and not
  the `htmlName` slug.

Then prove the converted page in the conditions the viewer imposes:

```bash
node .claude/skills/tr-to-webslides-artifact/scripts/artifact-check.mjs \
  Outputs/<course>/<session>/dist-artifact/<htmlName>.html     # must print CLEAN
```

It wraps the page in the tool's skeleton, loads it in a sandboxed opaque-origin
iframe under a strict CSP (so `localStorage` throws, as in the viewer), and
checks: renders, arrow keys navigate, `M` opens the marker, pen and highlighter
strokes commit, `Ctrl+Z` undoes, ink stays with its slide across navigation,
`H` hides and restores, and no uncaught errors. `marker-check` CLEAN on
`dist-single/` does **not** imply this: storage, focus and CSP differ.

## E. Publish

Publish the converted file with the **Artifact** tool:

- `file_path`: the `dist-artifact/<htmlName>.html` above.
- First publish: `icon: "slides"`, and `description`: one sentence, e.g.
  "NxtWave session deck: <Session name>, <N> slides, built from the TR doc."
- This deck is already a finished, fully designed page from the repo's own
  kit. Do **not** start from the generic "Slides" Artifact type and do not
  redesign anything; the kit's design system is the design. (If the host
  requires a quickstart call before a first publish, make it, then publish this
  file as a plain page.)
- **Republishing after a fix:** publish the same `file_path` again in this
  conversation; from a later conversation pass the URL from the plan header as
  `url` (read it first with `action: "read"`). A publish without `url` makes a
  second artifact and a second link.

Then write the link into the plan header's `Artifact` row and append
` · PUBLISHED <date>` to the STATUS line.

Tell the user, in one short block: the link; that it is **private** until they
share it from the page's Share menu; slide count; verification results
(including `marker-check` and `artifact-check`); the three marker keys a
presenter needs first (`M` to draw, `1`/`2`/`3` pen / marker / highlighter,
`Esc` to put the pen down); and that `dist-single/<htmlName>.html` is still the
offline file for the classroom.

### What behaves differently inside an artifact

Say these when they apply; do not discover them in front of a class.

| In the artifact | Why | Use instead |
|---|---|---|
| The feedback slide's embedded Google Form does not load | the viewer blocks framed external sites | the QR code and link on the same slide still show; present from `dist-single/` when the form is needed live |
| Deep links like `#/12` are dropped from a shared URL | only a plain `#anchor` reaches the page | navigate with arrows / swipe after opening |
| Fullscreen and print may be refused | viewer sandbox | present from `dist-single/` for a live class |
| Keys (arrows, `M`, `1`-`7`, `H` …) do nothing at first | the viewer frame does not have keyboard focus yet | click once on the slide, then use keys |
| Annotations are gone after a reload, and nobody else sees them | ink is held in memory only, per viewer (by design: `useAnnotate.ts`; nothing is written anywhere) | draw live; for ink that must be kept, present from `dist-single/` and screenshot |
| The arrow-key mode (slides ⇄ steps) and autoplay choice are not remembered | `localStorage` is blocked in the sandbox; the deck catches it and falls back to defaults | press `S` again after opening |

Keyboard, trackpad and touch navigation, autoplay, reveal steps, fonts and the
annotation marker all work, because the build is fully inlined
(`artifact-check.mjs` proves it).

## Feedback

Feedback on the deck's content or look goes through generate-slides §8 (ask
whether to record it, name the file). Feedback about the TR intake, conversion
or publishing steps belongs in this file: ask before adding it, and write the
reason with the rule.
