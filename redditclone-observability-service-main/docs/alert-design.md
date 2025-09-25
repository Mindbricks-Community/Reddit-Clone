# Service Design Specification - Object Design for alert

**redditclone-observability-service** documentation

## Document Overview

This document outlines the object design for the `alert` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## alert Data Object

### Object Overview

**Description:** Tracks active or resolved alerts about incidents impacting reliability, SLO/SLA, or other central system signals. Alerts link to sloEvents and errorLogs as needed.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **alert_time_stat_idx**: [createdAt, status, severity]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property           | Type   | Required | Description                                                                 |
| ------------------ | ------ | -------- | --------------------------------------------------------------------------- |
| `title`            | String | Yes      | Short summary/title of the alert.                                           |
| `affectedServices` | String | No       | Array of service names affected by this alert/incident.                     |
| `status`           | Enum   | Yes      | Current status of alert (open, acknowledged, resolved, closed, suppressed). |
| `severity`         | Enum   | Yes      | Severity level (critical, high, medium, low, info).                         |
| `sloEventIds`      | ID     | No       | Array of sloEvent ids linked to this alert.                                 |
| `errorLogIds`      | ID     | No       | Array of errorLog ids linked to this alert.                                 |
| `resolvedByUserId` | ID     | No       | User that acknowledged/resolved/closed this alert.                          |
| `notes`            | Text   | No       | Alert notes, resolution, or response timeline.                              |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Array Properties

`affectedServices` `sloEventIds` `errorLogIds`

Array properties can hold multiple values and are indicated by the `[]` suffix in their type. Avoid using arrays in properties that are used for relations, as they will not work correctly.
Note that using connection objects instead of arrays is recommended for relations, as they provide better performance and flexibility.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **affectedServices**: []
- **severity**: 1
- **sloEventIds**: []
- **errorLogIds**: []

### Auto Update Properties

`title` `affectedServices` `status` `severity` `sloEventIds` `errorLogIds` `resolvedByUserId` `notes`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **status**: [open, acknowledged, resolved, closed, suppressed]

- **severity**: [critical, high, medium, low, info]

### Elastic Search Indexing

`title` `affectedServices` `status` `severity` `resolvedByUserId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`title` `status` `severity`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`status` `severity`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Relation Properties

`sloEventIds` `errorLogIds` `resolvedByUserId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **sloEventIds**: ID
  Relation to `sloEvent`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **errorLogIds**: ID
  Relation to `errorLog`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **resolvedByUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`title` `affectedServices` `status` `severity` `resolvedByUserId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **title**: String has a filter named `title`

- **affectedServices**: String has a filter named `affectedServices`

- **status**: Enum has a filter named `status`

- **severity**: Enum has a filter named `severity`

- **resolvedByUserId**: ID has a filter named `resolvedByUserId`
