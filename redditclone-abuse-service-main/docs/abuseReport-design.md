# Service Design Specification - Object Design for abuseReport

**redditclone-abuse-service** documentation

## Document Overview

This document outlines the object design for the `abuseReport` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## abuseReport Data Object

### Object Overview

**Description:** Tracks each instance where a user or automated system reports abuse, spam, policy violation, or problematic behavior on a post, comment, or user. Includes reporter, reason, target links, status, result, and moderation review info.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **reportTargetUser**: [reportedUserId, postId, commentId, reporterUserId]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property           | Type   | Required | Description                                                                                                  |
| ------------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------ |
| `reportType`       | Enum   | Yes      | Type of abuse being reported: spam, harassment, rules, nsfw, other.                                          |
| `reportStatus`     | Enum   | Yes      | Current status: new/queued, under_review, forwarded, resolved, dismissed, invalid.                           |
| `reasonText`       | Text   | No       | User-provided or system-generated explanation for report.                                                    |
| `reporterUserId`   | ID     | Yes      | User who initiated the report.                                                                               |
| `reportedUserId`   | ID     | No       | User being reported (directly or as post/comment author).                                                    |
| `postId`           | ID     | No       | ID of the reported post (if applicable).                                                                     |
| `commentId`        | ID     | No       | ID of the reported comment (if applicable).                                                                  |
| `origin`           | Enum   | Yes      | Was report user-initiated/manual, automod, or external integration?                                          |
| `resolutionResult` | Enum   | No       | Outcome: content actioned (removed...), dismissed, after mod/admin review. Null if unresolved.               |
| `resolvedByUserId` | ID     | No       | Moderator/admin/automod (user)ID who resolved the report.                                                    |
| `extraData`        | Object | No       | Flexible JSON for custom keys: browser, source IP, additional evidence, or attachment refs for mod workflow. |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`reportType` `reporterUserId` `reportedUserId` `postId` `commentId` `origin`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`reportType` `reportStatus` `reasonText` `resolutionResult` `resolvedByUserId` `extraData`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **reportType**: [spam, harassment, ruleViolation, nsfw, malware, selfHarm, impersonation, other]

- **reportStatus**: [new, underReview, forwarded, resolved, dismissed, invalid]

- **origin**: [user, automod, external]

- **resolutionResult**: [none, contentRemoved, userRestricted, noAction, invalid, banned, other]

### Elastic Search Indexing

`reportType` `reportStatus` `reasonText` `reporterUserId` `reportedUserId` `postId` `commentId` `origin` `resolutionResult`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`reporterUserId` `reportedUserId` `postId` `commentId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`reporterUserId` `reportedUserId` `postId` `commentId`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Relation Properties

`reporterUserId` `reportedUserId` `postId` `commentId` `resolvedByUserId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **reporterUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **reportedUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **postId**: ID
  Relation to `post`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **commentId**: ID
  Relation to `comment`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **resolvedByUserId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Session Data Properties

`reporterUserId`

Session data properties are used to store data that is specific to the user session, allowing for personalized experiences and temporary data storage.
If a property is configured as session data, it will be automatically mapped to the related field in the user session during CRUD operations.
Note that session data properties can not be mutated by the user, but only by the system.

- **reporterUserId**: ID property will be mapped to the session parameter `userId`.

This property is also used to store the owner of the session data, allowing for ownership checks and access control.

### Filter Properties

`reportType` `reportStatus` `reporterUserId` `reportedUserId` `postId` `commentId` `origin` `resolutionResult`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **reportType**: Enum has a filter named `reportType`

- **reportStatus**: Enum has a filter named `reportStatus`

- **reporterUserId**: ID has a filter named `reporterUserId`

- **reportedUserId**: ID has a filter named `reportedUserId`

- **postId**: ID has a filter named `postId`

- **commentId**: ID has a filter named `commentId`

- **origin**: Enum has a filter named `origin`

- **resolutionResult**: Enum has a filter named `resolutionResult`
