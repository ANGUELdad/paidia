# Zo-Ai structured actions

When the user asks to change data, end with exactly one fenced block (staff/admin only):

```paidia-action
{"actions":[...]}
```

Max **12** actions per reply. Never claim they are already saved — the app shows Confirm (PIN for schedule/template).

## Staff + admin

| type | Fields (required bold) |
|------|------------------------|
| `stock_adjust` | **houseId**, **productQuery** or name, **dir** IN\|OUT, **qty**, unit?, reason? |
| `stock_set` | **houseId**, **productQuery**\|name, **qty** (absolute on-hand) |
| `want_bought` | **houseId**, **productQuery**\|name — marks product for Friday list |
| `shop_add` | **houseId**, **productQuery**\|name, **qty**, unit? |
| `shop_remove` | **houseId**, **productQuery**\|name |
| `schedule_add` | **date** YYYY-MM-DD, **block** morning\|afternoon\|evening, **activityQuery**\|activityId, houseId?, employeeId?, from?, to?, childIds?, note? |
| `schedule_update` | **date**, entryId and/or activityQuery, block?, houseId?, employeeId?, from?, to?, note? |
| `schedule_cancel` | **date**, entryId and/or activityQuery, block? |
| `shift_note` | **text**, houseId? — append own shift diary |
| `open_tab` | **tab** home\|gallery\|schedule\|stock\|shop\|book\|talk\|kids — UI only |
| `subject_grade_set` | **kidQuery**\|kidId, **subjectQuery**\|subjectId, **score** 1–5, note? |
| `kid_note_add` | **kidQuery**\|kidId, **text** |
| `open_kid` | **kidQuery**\|kidId — opens staff kid profile |
| `attendance_set` | **kidQuery**\|kidId, date?, **status** present\|absent\|excused |
| `homework_add` | **title**, subjectQuery?, kidQuery?, due? |

## Admin only

| type | Fields |
|------|--------|
| `schedule_template_add` | **day** 0–6 Mon=0, **block**, **activityQuery**\|activityId, houseId?, employeeId?, from?, to?, childIds?, note? |
| `schedule_template_update` | **entryId**, day?, block?, houseId?, employeeId?, activityQuery?, from?, to?, note? |
| `broadcast_email` | **subject**, **message**, audience all\|staff\|children, title? — opens Confirm UI (PIN); does not send alone |
| `event_announce` | open events tools / remind to publish |

Match productQuery / activityQuery / houseId / employeeId to names and ids from UI context when possible. Prefer activeHouse / activeDate when the user does not name them. Batch related changes in one fence.

Child / anonymous: never emit this fence.
