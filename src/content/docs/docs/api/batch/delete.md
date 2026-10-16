---
title: "Batch delete"
description: "Para documentation: Batch delete."
sidebar:
  order: 4
---

**Request:** `DELETE /v1/_batch`

Deletes multiple objects with a single request.

## Parameters

- `ids` - a list of `id`s of existing objects (required).

Example: `DELETE /v1/_batch?ids=1&ids=2` will delete the two objects with an `id` of `1` and `2`, respectively.

## Response

- **status codes** - `200`, `400` (if request maximum number of `ids` is over the limit of ~30)

No content.
