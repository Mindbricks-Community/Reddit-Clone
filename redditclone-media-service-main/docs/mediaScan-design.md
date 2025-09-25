# Service Design Specification - Object Design for mediaScan

**redditclone-media-service** documentation

## Document Overview

This document outlines the object design for the `mediaScan` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## mediaScan Data Object

### Object Overview

**Description:** Represents a scan operation performed on a specific mediaObject (e.g., at upload or on-demand re-scan). Records type, results, and details for audit/history.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property        | Type   | Required | Description                                                                                                                                                     |
| --------------- | ------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mediaObjectId` | ID     | Yes      | Reference to the mediaObject scanned.                                                                                                                           |
| `scanType`      | Enum   | Yes      | Type of scan performed: 0=nsfw, 1=malware, 2=other, 3=combined.                                                                                                 |
| `result`        | Object | Yes      | JSON-formatted scan result details: e.g., {nsfwScore:0.98, categories:[&#39;drawing&#39;,&#39;hentai&#39;]}, or malware: {clean:true,signature:&#39;EICAR&#39;} |
| `scanStatus`    | Enum   | Yes      | Scan record status: 0=pending, 1=success, 2=failed.                                                                                                             |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`mediaObjectId` `scanType` `result` `scanStatus`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **scanType**: [nsfw, malware, other, combined]

- **scanStatus**: [pending, success, failed]

### Elastic Search Indexing

`mediaObjectId` `scanType` `result` `scanStatus`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`mediaObjectId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Relation Properties

`mediaObjectId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **mediaObjectId**: ID
  Relation to `mediaObject`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

### Filter Properties

`mediaObjectId` `scanType`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **mediaObjectId**: ID has a filter named `mediaObjectId`

- **scanType**: Enum has a filter named `scanType`
