---
title: "Maven"
description: "Para documentation: Maven."
sidebar:
  order: 3
---

Para is hosted on Maven Central. To add it to your project just include this into your `pom.xml`:

```xml
<dependency>
  <groupId>com.erudika</groupId>
  <artifactId>para-server</artifactId>
  <version>{VERSION}</version>
</dependency>
```

For building lightweight client-only applications connecting to Para, include only the client module:
```xml
<dependency>
  <groupId>com.erudika</groupId>
  <artifactId>para-client</artifactId>
  <version>{VERSION}</version>
</dependency>
```

By building your JVM app on top of Para, you have full control over persistence, caching and indexing operations.
Here's a simple diagram of this architecture:

<pre>
+----------+ +----------+ +-----------+
| Web SPA  | |API Client| | Mobile app|
+----+-----+ +-----+----+ +----+------+
     |             |           |
+----+-------------+-----------+------+
|        REST API over HTTPS          |
+------------------+------------------+
|       Cluster Load Balancer         |
+------------------+------------------+
                   |
     +------------------ ... ----+
     |             |             |
+----+----+   +----+----+   +----+----+
| Your app|   | Your app|   | Your app|
+---------+   +---------+   +---------+
| Cache   |   | Cache   |   | Cache   |  \
+---------+   +---------+   +---------+   \
| Search  |   | Search  |   | Search  |    } Para
+---------+   +---------+   +---------+   /
| Database|   | Database|   | Database|  /
+---------+   +---------+   +---------+

  Node 1        Node 2   ...  Node N

</pre>

## Java API artifacts

Generated JavaDocs are not hosted on this site. Find the Para server artifact and its published metadata on [Maven Central](https://central.sonatype.com/artifact/com.erudika/para-server).
