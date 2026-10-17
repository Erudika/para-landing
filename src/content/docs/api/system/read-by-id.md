---
title: "Read by id"
description: "Para documentation: Read by id."
sidebar:
  order: 2
---

**Request:** `GET /v1/_id/{id}`

Returns the object for the given `{id}`.

## Request

- `{id}` - the `id`

## Response

Returns a JSON object.

- **status codes** - `200`, `404`

Example response:
```js
{
	"id" : "417283630780387328",
  "timestamp" : 1409572755025,
  "type" : "user",
	"name" : "Gordon Freeman"
	...
}
```
