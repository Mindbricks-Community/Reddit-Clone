# Service Design Specification - Object Design for moderationAuditLog

**redditclone-moderation-service** documentation

## Document Overview

This document outlines the object design for the `moderationAuditLog` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## moderationAuditLog Data Object

### Object Overview

**Description:** Complete audit log of all moderation and automod events, including manual actions, automated actions, and source context.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property                   | Type | Required | Description                                                                          |
| -------------------------- | ---- | -------- | ------------------------------------------------------------------------------------ |
| `logEntryType`             | Enum | Yes      | Type of log entry: 0=moderationAction, 1=automodEvent, 2=reportLinked, 3=bulkAction. |
| `communityId`              | ID   | Yes      | Community context of the log entry.                                                  |
| `entityType`               | Enum | No       | Entity type the log references: 0=post, 1=comment, 2=user, 3=other.                  |
| `entityId`                 | ID   | No       | ID of the referenced post/comment/user/object.                                       |
| `actionUserId`             | ID   | No       | ID of the actor (moderator/admin/user/automod).                                      |
| `linkedModerationActionId` | ID   | No       | If this log is tied to a specific moderationAction entry.                            |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **entityType**: 3

### Constant Properties

`logEntryType` `communityId` `entityType` `entityId` `actionUserId` `linkedModerationActionId`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`logEntryType` `communityId` `entityType` `entityId` `actionUserId` `linkedModerationActionId`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **logEntryType**: [moderationAction, automodEvent, reportLinked, bulkAction]

- **entityType**: [post, comment, user, other]

### Elastic Search Indexing

`logEntryType` `communityId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`communityId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Relation Properties

`communityId` `actionUserId` `linkedModerationActionId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **communityId**: ID
  Relation to `community`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **actionUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **linkedModerationActionId**: ID
  Relation to `moderationAction`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`logEntryType` `communityId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **logEntryType**: Enum has a filter named `logEntryType`

- **communityId**: ID has a filter named `communityId`
