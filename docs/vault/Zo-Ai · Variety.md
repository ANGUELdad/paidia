---
tags: [ai, open]
---
# Zo-Ai · Variety (open)

Requirement: the assistant should not repeat itself.

## Why it repeats now
Greetings and suggestion chips are static strings in the prompt, and
temperature alone does not vary an opener that is literally hardcoded.

## Approach
1. Rotate openers from a pool, seeded by date + profile so it differs per
   person per day rather than randomly mid-conversation.
2. Feed recent context — what changed since last login — so the opener has
   something real to say instead of being decorative.
3. Track the last N openers per profile; exclude them from the pool.

Related: [[Zo-Ai]]
