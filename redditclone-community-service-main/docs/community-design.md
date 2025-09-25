# Service Design Specification - Object Design for community

**redditclone-community-service** documentation

## Document Overview

This document outlines the object design for the `community` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## community Data Object

### Object Overview

**Description:** A top-level user-created group for discussions, featuring configuration for privacy, allowed post types, appearance, rules, and trending/popularity tracking.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** Yes — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Redis Entity Caching

This data object is configured for Redis entity caching, which improves data retrieval performance by storing frequently accessed data in Redis.
Each time a new instance is created, updated or deleted, the cache is updated accordingly. Any get requests by id will first check the cache before querying the database.
If you want to use the cache by other select criteria, you can configure any data property as a Redis cluster.

- **Smart Caching is activated:**
  A data object instance will only be cached when it is accessed for the first time.
  TTL (time-to-live) is dynamically calculated based on access frequency, which is useful for large datasets with volatile usage patterns.
  Each data instance has 15 minutes of TTL and in each access, the TTL is extended by 15 minutes.
  If the data is not accessed for 15 minutes, it will be removed from the cache.

- **Cache Criteria:**

```js
{"isActive": true}
```

This object is only cached if this criteria is met.

The criteria is only checked during create and update operations, not during read operations.
So if you want the criteria to be checked during read operations because it has checks about reading time context, you should deactivate the `checkCriteriaOnlyInCreateAndUpdates` option.

### Composite Indexes

- **uniqueCommunitySlug**: [slug]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property           | Type    | Required | Description                                                                            |
| ------------------ | ------- | -------- | -------------------------------------------------------------------------------------- |
| `name`             | String  | Yes      | Community display name (must be unique and human readable).                            |
| `slug`             | String  | Yes      | Unique identifier for URLs (e.g., r/mycommunity).                                      |
| `description`      | Text    | Yes      | Detailed description of the community&#39;s purpose and content.                       |
| `creatorId`        | ID      | Yes      | ID of the user who created the community.                                              |
| `bannerUrl`        | String  | No       | Banner image URL for top of the community page.                                        |
| `avatarUrl`        | String  | No       | Logo or avatar image URL of the community.                                             |
| `colorScheme`      | String  | No       | Customizable color theme (e.g., for branding the community page).                      |
| `privacyLevel`     | Enum    | Yes      | Privacy type: 0=public, 1=restricted (invite/key to post), 2=private.                  |
| `isNsfw`           | Boolean | Yes      | Indicates if the community is designated NSFW or adult.                                |
| `allowedPostTypes` | Enum    | Yes      | Allowed content types (bit-enum): 0=text, 1=link, 2=image, 3=video, 4=gallery, 5=poll. |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Array Properties

`allowedPostTypes`

Array properties can hold multiple values and are indicated by the `[]` suffix in their type. Avoid using arrays in properties that are used for relations, as they will not work correctly.
Note that using connection objects instead of arrays is recommended for relations, as they provide better performance and flexibility.

### Default Values

Default values are automatically assigned to properties when a new object is created, if no value is provided in the request body.
Since default values are applied on db level, they should be literal values, not expressions.If you want to use expressions, you can use transposed parameters in any crud route to set default values dynamically.

- **colorScheme**: #FFFFFF
- **allowedPostTypes**: [0,1,2,3,4,5]

### Always Create with Default Values

Some of the default values are set to be always used when creating a new object, even if the property value is provided in the request body. It ensures that the property is always initialized with a default value when the object is created.

- **creatorId**: Will be created with value ``

- **privacyLevel**: Will be created with value `0`

- **isNsfw**: Will be created with value `false`

- **allowedPostTypes**: Will be created with value `[0,1,2,3,4,5]`

### Constant Properties

`slug` `creatorId`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`name` `description` `bannerUrl` `avatarUrl` `colorScheme` `privacyLevel` `isNsfw` `allowedPostTypes`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **privacyLevel**: [public, restricted, private]

- **allowedPostTypes**: [text, link, image, video, gallery, poll]

### Elastic Search Indexing

`name` `slug` `description` `privacyLevel` `isNsfw`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`name` `slug` `creatorId`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Unique Properties

`slug`

Unique properties are enforced to have distinct values across all instances of the data object, preventing duplicate entries.
Note that a unique property is automatically indexed in the database so you will not need to set the `Indexed in DB` option.

### Cache Select Properties

`name` `slug` `privacyLevel` `isNsfw`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Secondary Key Properties

`slug`

Secondary key properties are used to create an additional indexed identifiers for the data object, allowing for alternative access patterns.
Different than normal indexed properties, secondary keys will act as primary keys and Mindbricks will provide automatic secondary key db utility functions to access the data object by the secondary key.

### Relation Properties

`creatorId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **creatorId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: Yes

### Session Data Properties

`creatorId`

Session data properties are used to store data that is specific to the user session, allowing for personalized experiences and temporary data storage.
If a property is configured as session data, it will be automatically mapped to the related field in the user session during CRUD operations.
Note that session data properties can not be mutated by the user, but only by the system.

- **creatorId**: ID property will be mapped to the session parameter `userId`.

This property is also used to store the owner of the session data, allowing for ownership checks and access control.

### Filter Properties

`name` `slug` `creatorId` `privacyLevel` `isNsfw`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **name**: String has a filter named `name`

- **slug**: String has a filter named `slug`

- **creatorId**: ID has a filter named `creatorId`

- **privacyLevel**: Enum has a filter named `privacyLevel`

- **isNsfw**: Boolean has a filter named `isNsfw`
