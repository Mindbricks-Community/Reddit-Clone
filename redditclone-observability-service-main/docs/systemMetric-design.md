# Service Design Specification - Object Design for systemMetric

**redditclone-observability-service** documentation

## Document Overview

This document outlines the object design for the `systemMetric` model in our application. It includes details about the model's attributes, relationships, and any specific validation or business logic that applies.

## systemMetric Data Object

### Object Overview

**Description:** A single point/time series metric (CPU, memory, error rate, etc.) collected from any service/module/host. Supports custom tags for dimensional filtering.

This object represents a core data structure within the service and acts as the blueprint for database interaction, API generation, and business logic enforcement.
It is defined using the `ObjectSettings` pattern, which governs its behavior, access control, caching strategy, and integration points with other systems such as Stripe and Redis.

### Core Configuration

- **Soft Delete:** Enabled — Determines whether records are marked inactive (`isActive = false`) instead of being physically deleted.
- **Public Access:** No — If enabled, anonymous users may access this object’s data depending on route-level rules.

### Composite Indexes

- **metric_time_name_idx**: [serviceName, metricName, timestamp]
  This composite index is defined to optimize query performance for complex queries involving multiple fields.

The index also defines a conflict resolution strategy for duplicate key violations.

When a new record would violate this composite index, the following action will be taken:

**On Duplicate**: `throwError`

An error will be thrown, preventing the insertion of conflicting data.

### Properties Schema

| Property      | Type   | Required | Description                                                                                          |
| ------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------- |
| `timestamp`   | Date   | Yes      | ISO timestamp for when the metric was captured.                                                      |
| `serviceName` | String | Yes      | Internal name of the service emitting the metric.                                                    |
| `host`        | String | No       | Hostname, k8s pod, or node identifier as reported by the agent/system.                               |
| `metricName`  | String | Yes      | Application or system metric name (e.g., cpuUsage, httpReqDuration).                                 |
| `metricValue` | Double | Yes      | Captured value of the metric (number, e.g., usage%, count, latency ms).                              |
| `unit`        | String | No       | Unit or suffix for the metric value (e.g., ms, %, count).                                            |
| `tags`        | Object | No       | Flexible object for custom metric tagging/dimension/labels (json: {route:..., method:..., env:...}). |

- Required properties are mandatory for creating objects and must be provided in the request body if no default value is set.

### Constant Properties

`timestamp` `serviceName` `host` `metricName` `metricValue` `unit`

Constant properties are defined to be immutable after creation, meaning they cannot be updated or changed once set. They are typically used for properties that should remain constant throughout the object's lifecycle.
A property is set to be constant if the `Allow Update` option is set to `false`.

### Elastic Search Indexing

`timestamp` `serviceName` `host` `metricName` `metricValue` `unit` `tags`

Properties that are indexed in Elastic Search will be searchable via the Elastic Search API.
While all properties are stored in the elastic search index of the data object, only those marked for Elastic Search indexing will be available for search queries.

### Database Indexing

`timestamp` `serviceName` `metricName`

Properties that are indexed in the database will be optimized for query performance, allowing for faster data retrieval.
Make a property indexed in the database if you want to use it frequently in query filters or sorting.

### Cache Select Properties

`serviceName` `metricName`

Cache select properties are used to collect data from Redis entity cache with a different key than the data object id.
This allows you to cache data that is not directly related to the data object id, but a frequently used filter.

### Filter Properties

`timestamp` `serviceName` `host` `metricName` `metricValue` `unit`

Filter properties are used to define parameters that can be used in query filters, allowing for dynamic data retrieval based on user input or predefined criteria.
These properties are automatically mapped as route parameters in the listing CRUD routes that have "Auto Params" enabled.

- **timestamp**: Date has a filter named `timestamp`

- **serviceName**: String has a filter named `serviceName`

- **host**: String has a filter named `host`

- **metricName**: String has a filter named `metricName`

- **metricValue**: Double has a filter named `metricValue`

- **unit**: String has a filter named `unit`
