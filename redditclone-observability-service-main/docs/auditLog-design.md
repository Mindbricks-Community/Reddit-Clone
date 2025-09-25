# Service Design Specification - Object Design for auditLog

**redditclone-observability-service** documentation

## Document Overview

This document outlines the object design for the `auditLog` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## auditLog Data Object

### Object Overview

**Description:** General-purpose compliance and operational audit log for system events such as config changes, admin activities, permission grants, etc.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **auditlog_time_type_idx**: [timestamp, eventType]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property     | Type   | Required | Description                                                                         |
| ------------ | ------ | -------- | ----------------------------------------------------------------------------------- |
| `timestamp`  | Date   | Yes      | Time of audit event.                                                                |
| `eventType`  | String | Yes      | Audit event type (adminAction, configChange, permissionGrant, authentication, etc). |
| `userId`     | ID     | No       | Actor (admin or user) performing the event (if any).                                |
| `message`    | Text   | Yes      | Human-readable or system summary of audit log event.                                |
| `targetType` | String | No       | Entity/subject affected (user, service, permission, etc).                           |
| `targetId`   | ID     | No       | ID of target/subject (e.g. affected user, object).                                  |
| `details`    | Object | No       | Additional audit context: JSON blob (fields vary by event).                         |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`timestamp` `eventType` `userId` `message` `targetType` `targetId` `details`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Elastic Search Indexing

`timestamp` `eventType` `userId` `message` `targetType` `targetId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`timestamp` `eventType` `userId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`userId`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Relation Properties

`userId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **userId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`timestamp` `eventType` `userId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **timestamp**: Date has a filter named `timestamp`

- **eventType**: String has a filter named `eventType`

- **userId**: ID has a filter named `userId`
