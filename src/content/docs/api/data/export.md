---
title: "Data Export"
description: "Para documentation: Data Export."
sidebar:
  order: 2
---

**Request:** `GET /v1/_export`

Exports a ZIP backup archive of all the data in a Para app. The archive contains multiple JSON files
containing the Para objects.

## Response

Returns `application/zip` response - the ZIP backup file.

- **status codes** - `200`
