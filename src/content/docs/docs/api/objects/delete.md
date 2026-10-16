---
title: "Delete object"
description: "Para documentation: Delete object."
sidebar:
  order: 5
---

**Request:** `DELETE /v1/{type}/{id}`

Deletes an existing object of type `{type}`. Returns code `200` regardless of the success of the request.

## Request

- `{type}` - the plural form of the object's type, e.g. "users"
- `{id}` - the `id`

## Response

- **status codes** - `200`, `400`

No content.
