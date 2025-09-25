# Service Design Specification - Object Design for sloEvent

**redditclone-observability-service** documentation

## Document Overview

This document outlines the object design for the `sloEvent` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## sloEvent Data Object

### Object Overview

**Description:** Represents a service-level SLO/SLA event (breach, recovery, ongoing issue). Includes status, incident type, affected services, and resolution notes.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **sloevent_time_servicetype_idx**: [serviceName, eventType, eventTime]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property      | Type   | Required | Description                                                                |
| ------------- | ------ | -------- | -------------------------------------------------------------------------- |
| `eventTime`   | Date   | Yes      | Time when the (breach, recovery, etc) event was detected.                  |
| `serviceName` | String | Yes      | Service/component name affected.                                           |
| `eventType`   | Enum   | Yes      | Event type (breach, slow, outage, recovery, maintenance, incident, other). |
| `status`      | Enum   | Yes      | Current status (open, resolved, inProgress, closed).                       |
| `notes`       | Text   | No       | Event notes, outage details/resolution steps.                              |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`eventTime` `serviceName` `eventType`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Auto Update Properties

`status` `notes`

An update crud route created with the option `Auto Params` enabled will automatically update these properties with the provided values in the request body.
If you want to update any property in your own business logic not by user input, you can set the `Allow Auto Update` option to false.
These properties will be added to the update route's body parameters and can be updated by the user if any value is provided in the request body.

### Enum Properties

Enum properties are defined with a set of allowed values, ensuring that only valid options can be assigned to them.
The enum options value will be stored as strings in the database,
but when a data object is created an addtional property with the same name plus an idx suffix will be created, which will hold the index of the selected enum option.
You can use the index property to sort by the enum value or when your enum options represent a sequence of values.

- **eventType**: [breach, slow, outage, recovery, maintenance, incident, other]

- **status**: [open, resolved, inProgress, closed]

### Elastic Search Indexing

`eventTime` `serviceName` `eventType` `status` `notes`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`eventTime` `serviceName` `eventType` `status`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`serviceName` `eventType` `status`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Filter Properties

`eventTime` `serviceName` `eventType` `status`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **eventTime**: Date has a filter named `eventTime`

- **serviceName**: String has a filter named `serviceName`

- **eventType**: Enum has a filter named `eventType`

- **status**: Enum has a filter named `status`
