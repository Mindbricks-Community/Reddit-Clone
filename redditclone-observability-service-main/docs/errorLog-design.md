# Service Design Specification - Object Design for errorLog

**redditclone-observability-service** documentation

## Document Overview

This document outlines the object design for the `errorLog` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## errorLog Data Object

### Object Overview

**Description:** Captures application/system/business errors and warnings reported by all services. Includes context, severity, stack trace, and source metadata for audit/search/compliance.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **err_time_service_type_idx**: [timestamp, serviceName, errorType]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property      | Type   | Required | Description                                                                         |
| ------------- | ------ | -------- | ----------------------------------------------------------------------------------- |
| `timestamp`   | Date   | Yes      | When the error was recorded.                                                        |
| `serviceName` | String | Yes      | Name of service/component reporting error.                                          |
| `errorType`   | String | Yes      | Error or exception type/class.                                                      |
| `message`     | Text   | Yes      | Error message or summary.                                                           |
| `severity`    | Enum   | Yes      | Severity/level (fatal, error, warn, info, debug).                                   |
| `stackTrace`  | Text   | No       | Error stack trace, if any (as string).                                              |
| `context`     | Object | No       | Flexible JSON: additional error context (route, params, user agent, custom fields). |
| `userId`      | ID     | No       | User ID if the error context involved a user action.                                |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **severity**: 2

### Constant Properties

`timestamp` `serviceName` `errorType` `message` `severity` `stackTrace` `context` `userId`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **severity**: [fatal, error, warn, info, debug]

### Elastic Search Indexing

`timestamp` `serviceName` `errorType` `message` `severity` `stackTrace` `userId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`timestamp` `serviceName` `errorType` `severity`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`errorType`

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

`timestamp` `serviceName` `errorType` `message` `severity` `userId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **timestamp**: Date has a filter named `timestamp`

- **serviceName**: String has a filter named `serviceName`

- **errorType**: String has a filter named `errorType`

- **message**: Text has a filter named `message`

- **severity**: Enum has a filter named `severity`

- **userId**: ID has a filter named `userId`
