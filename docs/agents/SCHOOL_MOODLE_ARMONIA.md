# School Moodle Armonia

**Status:** v1 vertical shipped in-app (`#school`) + `/school/` shell. Not a full Moodle LMS.

## Goals

Care facility school tracking that feels like a subject-first “Moodle lite”:
- What we did per subject / day (lesson notes)
- Continuity with existing Kids panes (homework, attendance, materials, timetable)
- Staff write, children later read their subjects

## Information architecture

| Surface | Audience | Content |
|---------|----------|---------|
| `#school` / `/school/` | Staff | Lesson notes by subject, subject picker, deep-link to Kids |
| `#kids/*` | Staff | Existing care-ops school tools |
| Child portal | Kids | Existing school snapshot; lesson notes feed later |

## Data

- `DB.schoolLessonNotes[]`: `{id, subjectId, date, body, by, byName, ts}`
- Reuses `DB.subjects`, homework, attendance, materials, timetable, `schoolActivity`

## Out of scope (later)

Quizzes, forums, SCORM, parent portal, multi-tenant courses, file submissions.

## Hosting

Same Vercel deploy. Path `/school/` mirrors `/desk/` / `/m/` via `scripts/build-shell-sites.py`. Real DNS subdomain is optional later.
