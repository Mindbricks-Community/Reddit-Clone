# EVENT GUIDE

## redditclone-moderation-service

Implements manual and automated moderation tools, including actions (approve/remove/lock/warn/ban), automod events processing, moderate report workflow, moderator audit logging, and modmail messaging for the platform. Integrates deeply with core community/content services for moderation control and transparency.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `Moderation` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `Moderation` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `Moderation` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `Moderation` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `Moderation` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent moderationAction-created

**Event topic**: `redditclone-moderation-service-dbevent-moderationaction-created`

This event is triggered upon the creation of a `moderationAction` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "performedByUserId": "ID",
  "performedByRole": "Enum",
  "performedByRole_": "String",
  "reason": "String",
  "notes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent moderationAction-updated

**Event topic**: `redditclone-moderation-service-dbevent-moderationaction-updated`

Activation of this event follows the update of a `moderationAction` data object. The payload contains the updated information under the `moderationAction` attribute, along with the original data prior to update, labeled as `old_moderationAction`.

**Event payload**:

```json
{
  "old_moderationAction": {
    "id": "ID",
    "_owner": "ID",
    "communityId": "ID",
    "targetType": "Enum",
    "targetType_": "String",
    "targetId": "ID",
    "actionType": "Enum",
    "actionType_": "String",
    "performedByUserId": "ID",
    "performedByRole": "Enum",
    "performedByRole_": "String",
    "reason": "String",
    "notes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "moderationAction": {
    "id": "ID",
    "_owner": "ID",
    "communityId": "ID",
    "targetType": "Enum",
    "targetType_": "String",
    "targetId": "ID",
    "actionType": "Enum",
    "actionType_": "String",
    "performedByUserId": "ID",
    "performedByRole": "Enum",
    "performedByRole_": "String",
    "reason": "String",
    "notes": "Text",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent moderationAction-deleted

**Event topic**: `redditclone-moderation-service-dbevent-moderationaction-deleted`

This event announces the deletion of a `moderationAction` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "performedByUserId": "ID",
  "performedByRole": "Enum",
  "performedByRole_": "String",
  "reason": "String",
  "notes": "Text",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent automodEvent-created

**Event topic**: `redditclone-moderation-service-dbevent-automodevent-created`

This event is triggered upon the creation of a `automodEvent` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "automodType": "Enum",
  "automodType_": "String",
  "ruleId": "ID",
  "performedByAutomod": "Boolean",
  "triggerDetails": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent automodEvent-updated

**Event topic**: `redditclone-moderation-service-dbevent-automodevent-updated`

Activation of this event follows the update of a `automodEvent` data object. The payload contains the updated information under the `automodEvent` attribute, along with the original data prior to update, labeled as `old_automodEvent`.

**Event payload**:

```json
{
  "old_automodEvent": {
    "id": "ID",
    "_owner": "ID",
    "communityId": "ID",
    "targetType": "Enum",
    "targetType_": "String",
    "targetId": "ID",
    "automodType": "Enum",
    "automodType_": "String",
    "ruleId": "ID",
    "performedByAutomod": "Boolean",
    "triggerDetails": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "automodEvent": {
    "id": "ID",
    "_owner": "ID",
    "communityId": "ID",
    "targetType": "Enum",
    "targetType_": "String",
    "targetId": "ID",
    "automodType": "Enum",
    "automodType_": "String",
    "ruleId": "ID",
    "performedByAutomod": "Boolean",
    "triggerDetails": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent automodEvent-deleted

**Event topic**: `redditclone-moderation-service-dbevent-automodevent-deleted`

This event announces the deletion of a `automodEvent` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "automodType": "Enum",
  "automodType_": "String",
  "ruleId": "ID",
  "performedByAutomod": "Boolean",
  "triggerDetails": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent moderationAuditLog-created

**Event topic**: `redditclone-moderation-service-dbevent-moderationauditlog-created`

This event is triggered upon the creation of a `moderationAuditLog` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "logEntryType": "Enum",
  "logEntryType_": "String",
  "communityId": "ID",
  "entityType": "Enum",
  "entityType_": "String",
  "entityId": "ID",
  "actionUserId": "ID",
  "linkedModerationActionId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent moderationAuditLog-updated

**Event topic**: `redditclone-moderation-service-dbevent-moderationauditlog-updated`

Activation of this event follows the update of a `moderationAuditLog` data object. The payload contains the updated information under the `moderationAuditLog` attribute, along with the original data prior to update, labeled as `old_moderationAuditLog`.

**Event payload**:

```json
{
  "old_moderationAuditLog": {
    "id": "ID",
    "_owner": "ID",
    "logEntryType": "Enum",
    "logEntryType_": "String",
    "communityId": "ID",
    "entityType": "Enum",
    "entityType_": "String",
    "entityId": "ID",
    "actionUserId": "ID",
    "linkedModerationActionId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "moderationAuditLog": {
    "id": "ID",
    "_owner": "ID",
    "logEntryType": "Enum",
    "logEntryType_": "String",
    "communityId": "ID",
    "entityType": "Enum",
    "entityType_": "String",
    "entityId": "ID",
    "actionUserId": "ID",
    "linkedModerationActionId": "ID",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent moderationAuditLog-deleted

**Event topic**: `redditclone-moderation-service-dbevent-moderationauditlog-deleted`

This event announces the deletion of a `moderationAuditLog` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "logEntryType": "Enum",
  "logEntryType_": "String",
  "communityId": "ID",
  "entityType": "Enum",
  "entityType_": "String",
  "entityId": "ID",
  "actionUserId": "ID",
  "linkedModerationActionId": "ID",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent modmailThread-created

**Event topic**: `redditclone-moderation-service-dbevent-modmailthread-created`

This event is triggered upon the creation of a `modmailThread` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "subject": "String",
  "createdByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent modmailThread-updated

**Event topic**: `redditclone-moderation-service-dbevent-modmailthread-updated`

Activation of this event follows the update of a `modmailThread` data object. The payload contains the updated information under the `modmailThread` attribute, along with the original data prior to update, labeled as `old_modmailThread`.

**Event payload**:

```json
{
  "old_modmailThread": {
    "id": "ID",
    "_owner": "ID",
    "communityId": "ID",
    "subject": "String",
    "createdByUserId": "ID",
    "status": "Enum",
    "status_": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "modmailThread": {
    "id": "ID",
    "_owner": "ID",
    "communityId": "ID",
    "subject": "String",
    "createdByUserId": "ID",
    "status": "Enum",
    "status_": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent modmailThread-deleted

**Event topic**: `redditclone-moderation-service-dbevent-modmailthread-deleted`

This event announces the deletion of a `modmailThread` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "subject": "String",
  "createdByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent modmailMessage-created

**Event topic**: `redditclone-moderation-service-dbevent-modmailmessage-created`

This event is triggered upon the creation of a `modmailMessage` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "threadId": "ID",
  "senderUserId": "ID",
  "messageBody": "Text",
  "messageType": "Enum",
  "messageType_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent modmailMessage-updated

**Event topic**: `redditclone-moderation-service-dbevent-modmailmessage-updated`

Activation of this event follows the update of a `modmailMessage` data object. The payload contains the updated information under the `modmailMessage` attribute, along with the original data prior to update, labeled as `old_modmailMessage`.

**Event payload**:

```json
{
  "old_modmailMessage": {
    "id": "ID",
    "_owner": "ID",
    "threadId": "ID",
    "senderUserId": "ID",
    "messageBody": "Text",
    "messageType": "Enum",
    "messageType_": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "modmailMessage": {
    "id": "ID",
    "_owner": "ID",
    "threadId": "ID",
    "senderUserId": "ID",
    "messageBody": "Text",
    "messageType": "Enum",
    "messageType_": "String",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent modmailMessage-deleted

**Event topic**: `redditclone-moderation-service-dbevent-modmailmessage-deleted`

This event announces the deletion of a `modmailMessage` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "threadId": "ID",
  "senderUserId": "ID",
  "messageBody": "Text",
  "messageType": "Enum",
  "messageType_": "String",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `Moderation` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event moderationaction-created

**Event topic**: `elastic-index-redditclone_moderationaction-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "performedByUserId": "ID",
  "performedByRole": "Enum",
  "performedByRole_": "String",
  "reason": "String",
  "notes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event moderationaction-updated

**Event topic**: `elastic-index-redditclone_moderationaction-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "performedByUserId": "ID",
  "performedByRole": "Enum",
  "performedByRole_": "String",
  "reason": "String",
  "notes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event moderationaction-deleted

**Event topic**: `elastic-index-redditclone_moderationaction-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "actionType": "Enum",
  "actionType_": "String",
  "performedByUserId": "ID",
  "performedByRole": "Enum",
  "performedByRole_": "String",
  "reason": "String",
  "notes": "Text",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event moderationaction-extended

**Event topic**: `elastic-index-redditclone_moderationaction-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event automodevent-created

**Event topic**: `elastic-index-redditclone_automodevent-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "automodType": "Enum",
  "automodType_": "String",
  "ruleId": "ID",
  "performedByAutomod": "Boolean",
  "triggerDetails": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event automodevent-updated

**Event topic**: `elastic-index-redditclone_automodevent-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "automodType": "Enum",
  "automodType_": "String",
  "ruleId": "ID",
  "performedByAutomod": "Boolean",
  "triggerDetails": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event automodevent-deleted

**Event topic**: `elastic-index-redditclone_automodevent-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "targetType": "Enum",
  "targetType_": "String",
  "targetId": "ID",
  "automodType": "Enum",
  "automodType_": "String",
  "ruleId": "ID",
  "performedByAutomod": "Boolean",
  "triggerDetails": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event automodevent-extended

**Event topic**: `elastic-index-redditclone_automodevent-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event moderationauditlog-created

**Event topic**: `elastic-index-redditclone_moderationauditlog-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "logEntryType": "Enum",
  "logEntryType_": "String",
  "communityId": "ID",
  "entityType": "Enum",
  "entityType_": "String",
  "entityId": "ID",
  "actionUserId": "ID",
  "linkedModerationActionId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event moderationauditlog-updated

**Event topic**: `elastic-index-redditclone_moderationauditlog-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "logEntryType": "Enum",
  "logEntryType_": "String",
  "communityId": "ID",
  "entityType": "Enum",
  "entityType_": "String",
  "entityId": "ID",
  "actionUserId": "ID",
  "linkedModerationActionId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event moderationauditlog-deleted

**Event topic**: `elastic-index-redditclone_moderationauditlog-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "logEntryType": "Enum",
  "logEntryType_": "String",
  "communityId": "ID",
  "entityType": "Enum",
  "entityType_": "String",
  "entityId": "ID",
  "actionUserId": "ID",
  "linkedModerationActionId": "ID",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event moderationauditlog-extended

**Event topic**: `elastic-index-redditclone_moderationauditlog-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event modmailthread-created

**Event topic**: `elastic-index-redditclone_modmailthread-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "subject": "String",
  "createdByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event modmailthread-updated

**Event topic**: `elastic-index-redditclone_modmailthread-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "subject": "String",
  "createdByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event modmailthread-deleted

**Event topic**: `elastic-index-redditclone_modmailthread-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "communityId": "ID",
  "subject": "String",
  "createdByUserId": "ID",
  "status": "Enum",
  "status_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event modmailthread-extended

**Event topic**: `elastic-index-redditclone_modmailthread-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

## Index Event modmailmessage-created

**Event topic**: `elastic-index-redditclone_modmailmessage-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "threadId": "ID",
  "senderUserId": "ID",
  "messageBody": "Text",
  "messageType": "Enum",
  "messageType_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event modmailmessage-updated

**Event topic**: `elastic-index-redditclone_modmailmessage-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "threadId": "ID",
  "senderUserId": "ID",
  "messageBody": "Text",
  "messageType": "Enum",
  "messageType_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event modmailmessage-deleted

**Event topic**: `elastic-index-redditclone_modmailmessage-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "threadId": "ID",
  "senderUserId": "ID",
  "messageBody": "Text",
  "messageType": "Enum",
  "messageType_": "String",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event modmailmessage-extended

**Event topic**: `elastic-index-redditclone_modmailmessage-extended`

**Event payload**:

```js
{
  id: id,
  extends: {
    [extendName]: "Object",
    [extendName + "_count"]: "Number",
  },
}
```

# Route Events

Route events are emitted following the successful execution of a route. While most routes perform CRUD (Create, Read, Update, Delete) operations on data objects, resulting in route events that closely resemble database events, there are distinctions worth noting. A single route execution might trigger multiple CRUD actions and ElasticSearch indexing operations. However, for those primarily concerned with the overarching business logic and its outcomes, listening to the consolidated route event, published once at the conclusion of the route's execution, is more pertinent.

Moreover, routes often deliver aggregated data beyond the primary database object, catering to specific client needs. For instance, creating a data object via a route might not only return the entity's data but also route-specific metrics, such as the executing user's permissions related to the entity. Alternatively, a route might automatically generate default child entities following the creation of a parent object. Consequently, the route event encapsulates a unified dataset encompassing both the parent and its children, in contrast to individual events triggered for each entity created. Therefore, subscribing to route events can offer a richer, more contextually relevant set of information aligned with business logic.

The payload of a route event mirrors the REST response JSON of the route, providing a direct and comprehensive reflection of the data and metadata communicated to the client. This ensures that subscribers to route events receive a payload that encapsulates both the primary data involved and any additional information deemed significant at the business level, facilitating a deeper understanding and integration of the service's functional outcomes.

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
