# Service Design Specification - Object Design for abuseInvestigation

**redditclone-abuse-service** documentation

## Document Overview

This document outlines the object design for the `abuseInvestigation` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## abuseInvestigation Data Object

### Object Overview

**Description:** Tracks ongoing investigations performed by mods/admins on potential abuse cases (spam rings, coordinated attacks, large-scale harassment, etc) for documentation and escalation.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **investigatorAndStatus**: [openedByUserId, investigationStatus]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property              | Type   | Required | Description                                                                         |
| --------------------- | ------ | -------- | ----------------------------------------------------------------------------------- |
| `investigationStatus` | Enum   | Yes      | Status of investigation (open, inProgress, closed, escalated, dismissed, duplicate) |
| `title`               | String | Yes      | Short title or summary describing the investigation topic.                          |
| `openedByUserId`      | ID     | Yes      | Moderator/admin user who opened the investigation.                                  |
| `assignedToUserIds`   | ID     | No       | Array of IDs of mods/admins currently active on the investigation.                  |
| `relatedReportIds`    | ID     | No       | Array of abuseReport ids this investigation covers.                                 |
| `relatedFlagIds`      | ID     | No       | Array of abuseFlag ids handled in this investigation.                               |
| `details`             | Object | No       | Flexible details/log field (timeline, findings, next actions, etc).                 |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Array Properties

`assignedToUserIds` `relatedReportIds` `relatedFlagIds`

Array properties can hold multiple values and are indicated by the `[]` suffix in their type. Avoid using arrays in properties that are used for relations, as they will not work correctly.
Note that using connection objects instead of arrays is recommended for relations, as they provide better performance and flexibility.

### Constant Properties

`openedByUserId`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`investigationStatus` `title` `assignedToUserIds` `relatedReportIds` `relatedFlagIds` `details`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **investigationStatus**: [open, inProgress, closed, escalated, dismissed, duplicate]

### Elastic Search Indexing

`investigationStatus` `title` `openedByUserId`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Relation Properties

`openedByUserId` `assignedToUserIds` `relatedReportIds` `relatedFlagIds`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **openedByUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **assignedToUserIds**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **relatedReportIds**: ID
  Relation to `abuseReport`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **relatedFlagIds**: ID
  Relation to `abuseFlag`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`investigationStatus` `title` `openedByUserId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **investigationStatus**: Enum has a filter named `investigationStatus`

- **title**: String has a filter named `title`

- **openedByUserId**: ID has a filter named `openedByUserId`
