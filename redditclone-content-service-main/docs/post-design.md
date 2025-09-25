# Service Design Specification - Object Design for post

**redditclone-content-service** documentation

## Document Overview

This document outlines the object design for the `post` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## post Data Object

### Object Overview

**Description:** A user-created content submission to a community. Supports formats: text, link, image, video, gallery, poll. Includes metadata, status, voting tallies, filtering, and media references.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** Yes — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Redis Entity Caching

This data object is configured for Redis entity caching, which improves data retrieval performance by storing frequently accessed data in Redis.
Each time a new instance is created, updated or deleted, the cache is updated accordingly. Any get requests by id will first check the cache before querying the database.
If you want to use the cache by other select criteria, you can configure any data property as a Redis cluster.

- **Cache Criteria:**

```js
{"status":0}
```

This object is only cached if this criteria is met.

The criteria is only checked during create and update operations, not during read operations.
So if you want the criteria to be checked during read operations because it has checks about reading time context, you should deactivate the `checkCriteriaOnlyInCreateAndUpdates` option.

### Composite Indexes

- **community_post_status_idx**: [communityId, status]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property      | Type    | Required | Description                                                             |
| ------------- | ------- | -------- | ----------------------------------------------------------------------- |
| `communityId` | ID      | Yes      | Community to which the post belongs.                                    |
| `userId`      | ID      | Yes      | User who created this post.                                             |
| `title`       | String  | No       | Title of the post. Required except for image/gallery-only posts.        |
| `bodyText`    | Text    | No       | Text content of the post. Required for text posts; optional for others. |
| `externalUrl` | String  | No       | Target URL for link posts (YouTube, news, etc).                         |
| `postType`    | Enum    | Yes      | Type of post: text, link, image, video, gallery, poll.                  |
| `status`      | Enum    | Yes      | Post status: active (0), deleted (1), locked (2), removed(3).           |
| `isNsfw`      | Boolean | Yes      | Whether the post is marked NSFW.                                        |
| `upVotes`     | Integer | Yes      | Cached number of upvotes for the post.                                  |
| `downVotes`   | Integer | Yes      | Cached number of downvotes for the post.                                |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`communityId` `userId` `upVotes` `downVotes`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`title` `bodyText` `externalUrl` `postType` `status` `isNsfw`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **postType**: [text, link, image, video, gallery, poll]

- **status**: [active, deleted, locked, removed]

### Elastic Search Indexing

`communityId` `userId` `title` `bodyText` `externalUrl` `postType` `status` `isNsfw` `upVotes` `downVotes`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`communityId` `userId` `status`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`communityId` `userId` `status` `isNsfw`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Relation Properties

`communityId` `userId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **communityId**: ID
  Relation to `community`.id

The target object is a parent object, meaning that the relation is a one-to-many relationship from target to this object.

On Delete: Set Null
Required: Yes

- **userId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: Yes

### Session Data Properties

`userId`

Session data properties are used to store data that is specific to the user session, allowing for personalized experiences and temporary data storage.
If a property is configured as session data, it will be automatically mapped to the related field in the user session during CRUD operations.
Note that session data properties can not be mutated by the user, but only by the system.

- **userId**: ID property will be mapped to the session parameter `userId`.

This property is also used to store the owner of the session data, allowing for ownership checks and access control.

### Filter Properties

`communityId` `userId` `title` `postType` `status` `isNsfw`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **communityId**: ID has a filter named `communityId`

- **userId**: ID has a filter named `userId`

- **title**: String has a filter named `title`

- **postType**: Enum has a filter named `postType`

- **status**: Enum has a filter named `status`

- **isNsfw**: Boolean has a filter named `isNsfw`
