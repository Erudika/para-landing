# Para Site

The landing and documentation site for Para, an open-source backend service. Language here covers both the product concepts the docs describe and, later, the site's own concepts.

## Language

### Product

**Para**:
An open-source, stateless, schemaless backend service with a REST API in front of a 3-layer stack. Alternative to Supabase, Parse, and Firebase.
_Avoid_: backend server, platform

**BaaS (Backend as a Service)**:
The category Para competes in: hosted-style backends offering persistence, search, and auth out of the box.
_Avoid_: platform-as-a-service

**Three layers (database → search index → cache)**:
Para's stack: every object is persisted to a database, indexed for search, and cached on top.
_Avoid_: storage tiers, components

**Persistence layer**:
The first layer of Para: pluggable databases (RDBMS, NoSQL, in-memory) that store Para objects.
_Avoid_: storage

**Search layer**:
The second layer of Para: a pluggable index used for querying Para objects.
_Avoid_: search index (when speaking of the layer)

**Cache layer**:
The third layer of Para: short-lived storage placed in front of the persistence layer.
_Avoid_: k/v store

**Schemaless**:
Para stores plain JSON objects with no required schema; the data model is key-value oriented, but works with traditional databases.
_Avoid_: schema-free, unstructured

**Stateless**:
Each request to the API carries everything needed; no sticky session, so Para scales out horizontally.
_Avoid_: serverless

**App**:
The multitenant unit of Para: each app gets its own table, search index, and cache; child apps are created from a root app.
_Avoid_: project, workspace, instance

**ParaObject**:
The base type of every object stored in Para; objects are plain JSON, tagged by type.
_Avoid_: entity, model, model type

**DAO**:
Para's pluggable persistence interface; concrete implementations exist for SQL, MongoDB, Cassandra, and DynamoDB.
_Avoid_: repository, datastore(if referring to the layer)

**Para Cloud**:
Erudika's managed hosting of Para. The public product page is `/cloud-hosting/` on the new site; the service and sign-in stay at paraio.com. The self-hosted alternative is the executable JAR/Docker image.
_Avoid_: SaaS, hosted version, cloud version

**ParaIO.com**:
The service domain for Para Cloud and the legal name used in the Terms and Privacy Policy. Do not use it as the product name in marketing copy.
_Avoid_: ParaIO (as a product name)

**ParaIO.org**:
The public marketing and documentation site. It is not the service domain; sign-in and billing remain at paraio.com.
_Avoid_: using it for the app console or sign-in

**Agent-ready docs**:
Documentation structured so LLM agents and AI coding tools can consume it directly: clean markdown sources, markdown file availability, and `llms.txt` at the site root.
_Avoid_: llms integration, AI docs
