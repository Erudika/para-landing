---
title: "List custom settings"
description: "Para documentation: List custom settings."
sidebar:
  order: 1
---

**Request:** `GET /v1/_settings`

Lists all custom app settings. These can be user-defined key-value pairs and are stored withing the app object.

## Request

**No parameters**.

## Response

Returns an map of keys and values.

- **status codes** - `200`

Example response:

```js
{
	"fb_app_id": "123U3VTNifLPqnZ1W2",
	"fb_secret": "YXBwOnBhcmE11234151667",
	"signin_success": "/dashboard",
	"signin_failure": "/signin?error"
}
```
