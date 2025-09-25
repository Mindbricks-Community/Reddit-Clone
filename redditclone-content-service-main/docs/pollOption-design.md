# Service Design Specification - Object Design for pollOption

**redditclone-content-service** documentation

## Document Overview

This document outlines the object design for the `pollOption` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## pollOption Data Object

### Object Overview

**Description:** Option available to vote on for a poll-type post. Each poll-type post may have multiple poll options.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** Yes — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **poll_post_option_idx**: [postId, optionIndex]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property      | Type    | Required | Description                                           |
| ------------- | ------- | -------- | ----------------------------------------------------- |
| `postId`      | ID      | Yes      | Post (of type &#39;poll&#39;) this option belongs to. |
| `optionIndex` | Integer | Yes      | Index of this poll option (0-based).                  |
| `optionText`  | String  | Yes      | Text/label for this poll option.                      |
| `voteCount`   | Integer | Yes      | Cached number of votes for this option.               |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`postId` `voteCount`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`optionIndex` `optionText`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Database Indexing

`postId` `optionIndex`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`postId`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Relation Properties

`postId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **postId**: ID
  Relation to `post`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

### Filter Properties

`postId`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **postId**: ID has a filter named `postId`
