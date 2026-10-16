---
title: "Health check (public)"
description: "Para documentation: Health check (public)."
sidebar:
  order: 1
---

**Request:** `GET /v1/_health`

**This resource is publicly accessible without authentication.**

Displays the health status of the server. Status is updated about once every minute.

## Request

**No parameters**.

## Response

- **status codes** - `200`, `500`

Example responses:

```
{
  "message" : "healthy"
}
```

```
{
	"code": 500,
  "message" : "unhealthy"
}
```
