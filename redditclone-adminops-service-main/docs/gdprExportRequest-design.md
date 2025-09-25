# Service Design Specification - Object Design for gdprExportRequest

**redditclone-adminops-service** documentation

## Document Overview

This document outlines the object design for the `gdprExportRequest` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## gdprExportRequest Data Object

### Object Overview

**Description:** Tracks and manages user data export requests for GDPR compliance (user or admin-initiated).

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Properties Schema

| Property             | Type   | Required | Description                                                                |
| -------------------- | ------ | -------- | -------------------------------------------------------------------------- |
| `userId`             | ID     | Yes      | ID of the user whose data export is requested                              |
| `requestedByAdminId` | ID     | No       | ID of admin who initiated the export (null if user-initiated)              |
| `status`             | Enum   | Yes      | Status of export request: pending, processing, completed, failed, canceled |
| `exportUrl`          | String | No       | URL where user can download the exported data (if completed)               |
| `errorMsg`           | String | No       | Failure details (if status=failed or canceled)                             |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`userId` `requestedByAdminId`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`userId` `requestedByAdminId` `status` `exportUrl` `errorMsg`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **status**: [pending, processing, completed, failed, canceled]

### Elastic Search Indexing

`userId` `status`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Relation Properties

`userId` `requestedByAdminId`

Mindbricks supports relations between data objects, allowing you to define how objects are linked together.
You can define relations in the data object properties, which will be used to create foreign key constraints in the database.
For complex joins operations, Mindbricks supportsa BFF pattern, where you can view dynamic and static views based on Elastic Search Indexes.
Use db level relations for simple one-to-one or one-to-many relationships, and use BFF views for complex joins that require multiple data objects to be joined together.

- **userId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

- **requestedByAdminId**: ID
  Relation to `user`.id

The target object is a sibling object, meaning that the relation is a many-to-one or one-to-one relationship from this object to the target.

On Delete: Set Null
Required: No

### Filter Properties

`userId` `status`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **userId**: ID has a filter named `userId`

- **status**: Enum has a filter named `status`
