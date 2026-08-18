# German Vocabulary App — Design Spec

Date: 2026-08-17

## Purpose

A personal, read-only web app for tracking German words learned, in an
Anki-like (but non-interactive) format, plus a separate reference module of
German↔English etymology/cognate patterns. Deployed statically to Vercel.

There is no in-app create/edit UI. New words and rules are added by editing
JSON files directly (typically: the user pastes a new word into chat, Claude
looks up the translation/details and appends a well-formed entry to the JSON,
then the user commits/pushes and Vercel redeploys).

## Architecture

- **Framework:** Next.js (App Router), deployed to Vercel.
- **Data:** Two JSON files under `/data`, read at build/render time
  (no database, no API routes needed for reads).
- **No auth, no backend, no write path from the UI.**

```
/data
  words.json
  etymology-rules.json
/app
  page.tsx          -> Word List page ("/")
  etymology/page.tsx -> Etymology Rules page ("/etymology")
```

## Data Model

### `words.json`

Array of word entries:

```json
{
  "id": "zeit-001",
  "german": "die Zeit",
  "english": "time",
  "partOfSpeech": "noun",
  "gender": "die",
  "plural": "Zeiten",
  "category": "abstract",
  "difficulty": "beginner",
  "exampleSentence": "Ich habe keine Zeit.",
  "exampleTranslation": "I have no time.",
  "dateLearned": "2026-08-17",
  "needsReview": false,
  "highlight": { "german": [0], "english": [0] }
}
```

Field notes:

- `id`: stable slug, unique per entry.
- `german`: full form including article for nouns (e.g. `"die Zeit"`).
- `partOfSpeech`: `noun | verb | adjective | adverb | preposition | pronoun | conjunction | interjection | other`.
- `gender` / `plural`: only meaningful for nouns; `null` otherwise.
- `category`: free-form but drawn from a small, consistent vocabulary
  (e.g. `home`, `food`, `travel`, `abstract`, `grammar`, `people`, `time`, `work`) —
  used for stats breakdown and table filtering.
- `difficulty`: `beginner | intermediate | advanced`.
- `exampleSentence` / `exampleTranslation`: optional but encouraged.
- `dateLearned`: ISO date string — when the word was first added.
- `needsReview`: boolean. There is no automatic in-app scheduling
  algorithm — the frontend never computes this at render time, it only
  ever reads whatever boolean is currently stored in the JSON. The flag is
  set by Claude in chat, on request, per the **Date-Based Review
  Recompute** below.
- `highlight`: optional. Character index arrays into the **bare word**
  (article stripped, e.g. indices into `"Zeit"` not `"die Zeit"`) marking
  the letters that visually correspond between German and English, for
  words with a clear shared root/pattern. Omitted when no clean
  correspondence exists.

#### Grammar Correctness Rules

Every entry in `words.json` must follow real German grammar — this is a
learning tool, so incorrect grammar in the data actively teaches the
wrong thing. Claude checks these whenever adding or reviewing words:

- **Capitalization is not a style choice.** German nouns are always
  capitalized (`Zeit`, `Herz`, `Apfel`, `Katze`); every other part of
  speech (verbs, adjectives, pronouns, adverbs, prepositions,
  conjunctions) stays lowercase (`sprechen`, `hart`, `ich`, `aus`,
  `mit`, `oder`). Do not force uniform casing across entries — mixed
  casing that follows this rule is correct, not inconsistent.
- **Headwords are singular**, not plural. Store the singular noun with
  its `gender` and `plural` field set separately (e.g. `"der Keks"` /
  `plural: "Kekse"`, not `"die Kekse"` as the headword) — matches how
  every other noun entry is recorded.
- **Gender must be verified**, not guessed from pattern-matching or
  assumed from the English translation. When uncertain, look it up
  rather than defaulting to a common gender.
- **Plural forms must be the real irregular plural** (e.g. `Apfel` →
  `Äpfel`, not `Apfels`), not a regularized guess. Uncountable nouns
  (`Wasser`, `Milch`, `Zucker`, `Eis`, `Silber`) correctly have
  `plural: null`.
- **Highlight indices must stay in bounds** of the bare word (German
  with article stripped) and the English word — verify index count
  against actual string length before committing.

When the user asks Claude to "review the list" or similar, Claude
re-audits existing entries against these rules (not just spot-checks
new ones) and fixes anything found, rather than assuming past entries
are already correct.

#### Date-Based Review Recompute

The user can, at any time, ask Claude to flag words for review by age —
e.g. "flag anything I learned in the last 20 days," "show me words older
than 30 days," "mark everything from the last week." The number of days
is whatever the user specifies **in that request** — there is no fixed
default threshold baked into the app or this spec.

When asked, Claude:

1. Takes the day count (N) the user gave that time.
2. Compares each entry's `dateLearned` to the current date.
3. Sets `needsReview` across `words.json` according to what the user asked
   for that time (e.g. "flag words newer than N days" → `dateLearned`
   within the last N days gets `needsReview: true`, everything else
   `false`; the user may also ask for the opposite direction, e.g. "flag
   words I haven't touched in over N days").
4. Writes the updated file; the user commits/pushes to redeploy.

This is a one-off recompute run each time the user asks, using whatever
N and direction they specify at that moment — not a stored rule the app
reapplies automatically. The user can also ask Claude to flag/unflag a
single specific word directly, independent of any date math.

### `etymology-rules.json`

Array of rule entries:

```json
{
  "id": "rule-consonant-shift-t-z",
  "title": "English 't' → German 'z'",
  "description": "High German consonant shift: English 't' often corresponds to German 'z', especially at the start of a word.",
  "type": "sound-shift",
  "examples": [
    { "german": "Zeit", "english": "time", "highlight": { "german": [0], "english": [0] } },
    { "german": "Zunge", "english": "tongue", "highlight": { "german": [0], "english": [0] } },
    { "german": "Zwei", "english": "two", "highlight": { "german": [0], "english": [0] } },
    { "german": "Herz", "english": "heart", "highlight": { "german": [3], "english": [4] } },
    { "german": "Salz", "english": "salt", "highlight": { "german": [3], "english": [3] } }
  ]
}
```

Field notes:

- `type`: `sound-shift` (general phonetic/spelling correspondence pattern)
  or `cognate-pair` (direct lookalike vocabulary, less about a systematic
  rule and more a curated pairing).
- `examples`: **5–8 entries per rule**, each with its own `highlight`
  (position can shift per word, e.g. `Herz`/`heart` marks index 3/4 not 0).
- This module is fully independent of `words.json` — no cross-referencing
  or shared IDs.

## Pages

### Word List (`/`)

- Header: total learned-word count, plus a stats breakdown (counts per
  category and per part-of-speech).
- Tabs: **Study** ↔ **Table** ↔ **Etymology** (see below).
  - **Study tab:** one large flashcard at a time (German word only; click/tap
    flips to reveal English translation, gender/plural if noun, category,
    example sentence), with Prev/Next navigation through the filtered set.
    Highlighted letters (per `highlight`) render in both German and English
    text wherever present.
  - **Table tab:** all fields visible in a searchable, filterable table.
    Highlighted letters render inline here too.
  - Both Study and Table share the same filter bar: **part of speech**
    (noun/verb/adjective/etc.), **category**, **difficulty**, and a
    **"needs review"** toggle — filtering applies consistently whichever
    tab is active, so switching tabs keeps the same filtered word set.

### Etymology Rules (`/etymology`)

- List of rule cards grouped by `type` (sound-shift patterns vs. cognate
  pairs).
- Each card shows title, description, and its 5–8 example pairs with
  highlighted corresponding letters.
- No interactivity required beyond optional expand/collapse per rule.

## Highlighting Behavior

Wherever a German/English pair is displayed (word list cards, word list
table, etymology examples), if a `highlight` object is present on that
entry, the indexed letters are rendered in a visually distinct style
(e.g. bold + accent color) in both the German and English text. Entries
without `highlight` render as plain text — no highlighting is inferred
automatically (e.g. no auto-bolding of first letters).

## Out of Scope

- No create/edit/delete UI, no forms, no database.
- No user accounts or auth.
- No spaced-repetition/scheduling algorithm running **in the app** — the
  frontend only reads the stored `needsReview` boolean, never computes it.
  The Date-Based Review Recompute (see Data Model) is applied by Claude in
  chat, on request, not by any client-side or build-time logic.
- No cross-linking between the word list and etymology rules module.

## Workflow for Adding Content

1. User provides a new German word (or a batch) in chat.
2. Claude looks up translation, part of speech, gender/plural (if noun),
   picks a category, drafts an example sentence, sets `dateLearned` to
   today, sets `needsReview: true` by default for a newly added word, and
   determines a `highlight` mapping if a clear cognate pattern exists —
   all following the **Grammar Correctness Rules** above (verified
   gender/plural, correct capitalization, singular headword).
3. Claude appends the entry to `data/words.json`.
4. Whenever the user asks (per the Date-Based Review Recompute above),
   Claude re-sweeps entries and updates `needsReview` using whatever day
   count/direction the user specifies at that time.
5. User reviews, commits, and pushes; Vercel redeploys automatically.
6. Etymology rules are added/extended the same way when a new pattern or
   cognate pair is identified — Claude adds 5–8 examples per new rule.
