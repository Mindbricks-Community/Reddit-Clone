# EVENT GUIDE

## redditclone-abuse-service

Handles abuse and anti-spam workflows: collects and triages reports, enforces heuristics/rate limits, tracks flags on users/content, manages abuse investigations. Integrates with moderation/adminOps/content for platform health and safety.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to . For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

# Documentation Scope

Welcome to the official documentation for the `Abuse` Service Event descriptions. This guide is dedicated to detailing how to subscribe to and listen for state changes within the `Abuse` Service, offering an exclusive focus on event subscription mechanisms.

**Intended Audience**

This documentation is aimed at developers and integrators looking to monitor `Abuse` Service state changes. It is especially relevant for those wishing to implement or enhance business logic based on interactions with `Abuse` objects.

**Overview**

This section provides detailed instructions on monitoring service events, covering payload structures and demonstrating typical use cases through examples.

# Authentication and Authorization

Access to the `Abuse` service's events is facilitated through the project's Kafka server, which is not accessible to the public. Subscription to a Kafka topic requires being on the same network and possessing valid Kafka user credentials. This document presupposes that readers have existing access to the Kafka server.

Additionally, the service offers a public subscription option via REST for real-time data management in frontend applications, secured through REST API authentication and authorization mechanisms. To subscribe to service events via the REST API, please consult the Realtime REST API Guide.

# Database Events

Database events are triggered at the database layer, automatically and atomically, in response to any modifications at the data level. These events serve to notify subscribers about the creation, update, or deletion of objects within the database, distinct from any overarching business logic.

Listening to database events is particularly beneficial for those focused on tracking changes at the database level. A typical use case for subscribing to database events is to replicate the data store of one service within another service's scope, ensuring data consistency and syncronization across services.

For example, while a business operation such as "approve membership" might generate a high-level business event like `membership-approved`, the underlying database changes could involve multiple state updates to different entities. These might be published as separate events, such as `dbevent-member-updated` and `dbevent-user-updated`, reflecting the granular changes at the database level.

Such detailed eventing provides a robust foundation for building responsive, data-driven applications, enabling fine-grained observability and reaction to the dynamics of the data landscape. It also facilitates the architectural pattern of event sourcing, where state changes are captured as a sequence of events, allowing for high-fidelity data replication and history replay for analytical or auditing purposes.

## DbEvent abuseReport-created

**Event topic**: `redditclone-abuse-service-dbevent-abusereport-created`

This event is triggered upon the creation of a `abuseReport` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "reportType": "Enum",
  "reportType_": "String",
  "reportStatus": "Enum",
  "reportStatus_": "String",
  "reasonText": "Text",
  "reporterUserId": "ID",
  "reportedUserId": "ID",
  "postId": "ID",
  "commentId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "resolutionResult": "Enum",
  "resolutionResult_": "String",
  "resolvedByUserId": "ID",
  "extraData": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent abuseReport-updated

**Event topic**: `redditclone-abuse-service-dbevent-abusereport-updated`

Activation of this event follows the update of a `abuseReport` data object. The payload contains the updated information under the `abuseReport` attribute, along with the original data prior to update, labeled as `old_abuseReport`.

**Event payload**:

```json
{
  "old_abuseReport": {
    "id": "ID",
    "_owner": "ID",
    "reportType": "Enum",
    "reportType_": "String",
    "reportStatus": "Enum",
    "reportStatus_": "String",
    "reasonText": "Text",
    "reporterUserId": "ID",
    "reportedUserId": "ID",
    "postId": "ID",
    "commentId": "ID",
    "origin": "Enum",
    "origin_": "String",
    "resolutionResult": "Enum",
    "resolutionResult_": "String",
    "resolvedByUserId": "ID",
    "extraData": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "abuseReport": {
    "id": "ID",
    "_owner": "ID",
    "reportType": "Enum",
    "reportType_": "String",
    "reportStatus": "Enum",
    "reportStatus_": "String",
    "reasonText": "Text",
    "reporterUserId": "ID",
    "reportedUserId": "ID",
    "postId": "ID",
    "commentId": "ID",
    "origin": "Enum",
    "origin_": "String",
    "resolutionResult": "Enum",
    "resolutionResult_": "String",
    "resolvedByUserId": "ID",
    "extraData": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent abuseReport-deleted

**Event topic**: `redditclone-abuse-service-dbevent-abusereport-deleted`

This event announces the deletion of a `abuseReport` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "reportType": "Enum",
  "reportType_": "String",
  "reportStatus": "Enum",
  "reportStatus_": "String",
  "reasonText": "Text",
  "reporterUserId": "ID",
  "reportedUserId": "ID",
  "postId": "ID",
  "commentId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "resolutionResult": "Enum",
  "resolutionResult_": "String",
  "resolvedByUserId": "ID",
  "extraData": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent abuseFlag-created

**Event topic**: `redditclone-abuse-service-dbevent-abuseflag-created`

This event is triggered upon the creation of a `abuseFlag` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "flagType": "Enum",
  "flagType_": "String",
  "flagStatus": "Enum",
  "flagStatus_": "String",
  "postId": "ID",
  "commentId": "ID",
  "userId": "ID",
  "mediaObjectId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent abuseFlag-updated

**Event topic**: `redditclone-abuse-service-dbevent-abuseflag-updated`

Activation of this event follows the update of a `abuseFlag` data object. The payload contains the updated information under the `abuseFlag` attribute, along with the original data prior to update, labeled as `old_abuseFlag`.

**Event payload**:

```json
{
  "old_abuseFlag": {
    "id": "ID",
    "_owner": "ID",
    "flagType": "Enum",
    "flagType_": "String",
    "flagStatus": "Enum",
    "flagStatus_": "String",
    "postId": "ID",
    "commentId": "ID",
    "userId": "ID",
    "mediaObjectId": "ID",
    "origin": "Enum",
    "origin_": "String",
    "details": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "abuseFlag": {
    "id": "ID",
    "_owner": "ID",
    "flagType": "Enum",
    "flagType_": "String",
    "flagStatus": "Enum",
    "flagStatus_": "String",
    "postId": "ID",
    "commentId": "ID",
    "userId": "ID",
    "mediaObjectId": "ID",
    "origin": "Enum",
    "origin_": "String",
    "details": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent abuseFlag-deleted

**Event topic**: `redditclone-abuse-service-dbevent-abuseflag-deleted`

This event announces the deletion of a `abuseFlag` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "flagType": "Enum",
  "flagType_": "String",
  "flagStatus": "Enum",
  "flagStatus_": "String",
  "postId": "ID",
  "commentId": "ID",
  "userId": "ID",
  "mediaObjectId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "details": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent abuseHeuristicTrigger-created

**Event topic**: `redditclone-abuse-service-dbevent-abuseheuristictrigger-created`

This event is triggered upon the creation of a `abuseHeuristicTrigger` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "triggerType": "Enum",
  "triggerType_": "String",
  "userId": "ID",
  "ipAddress": "String",
  "targetId": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent abuseHeuristicTrigger-updated

**Event topic**: `redditclone-abuse-service-dbevent-abuseheuristictrigger-updated`

Activation of this event follows the update of a `abuseHeuristicTrigger` data object. The payload contains the updated information under the `abuseHeuristicTrigger` attribute, along with the original data prior to update, labeled as `old_abuseHeuristicTrigger`.

**Event payload**:

```json
{
  "old_abuseHeuristicTrigger": {
    "id": "ID",
    "_owner": "ID",
    "triggerType": "Enum",
    "triggerType_": "String",
    "userId": "ID",
    "ipAddress": "String",
    "targetId": "ID",
    "details": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "abuseHeuristicTrigger": {
    "id": "ID",
    "_owner": "ID",
    "triggerType": "Enum",
    "triggerType_": "String",
    "userId": "ID",
    "ipAddress": "String",
    "targetId": "ID",
    "details": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent abuseHeuristicTrigger-deleted

**Event topic**: `redditclone-abuse-service-dbevent-abuseheuristictrigger-deleted`

This event announces the deletion of a `abuseHeuristicTrigger` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "triggerType": "Enum",
  "triggerType_": "String",
  "userId": "ID",
  "ipAddress": "String",
  "targetId": "ID",
  "details": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent abuseInvestigation-created

**Event topic**: `redditclone-abuse-service-dbevent-abuseinvestigation-created`

This event is triggered upon the creation of a `abuseInvestigation` data object in the database. The event payload encompasses the newly created data, encapsulated within the root of the paylod.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "investigationStatus": "Enum",
  "investigationStatus_": "String",
  "title": "String",
  "openedByUserId": "ID",
  "assignedToUserIds": "ID",
  "relatedReportIds": "ID",
  "relatedFlagIds": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## DbEvent abuseInvestigation-updated

**Event topic**: `redditclone-abuse-service-dbevent-abuseinvestigation-updated`

Activation of this event follows the update of a `abuseInvestigation` data object. The payload contains the updated information under the `abuseInvestigation` attribute, along with the original data prior to update, labeled as `old_abuseInvestigation`.

**Event payload**:

```json
{
  "old_abuseInvestigation": {
    "id": "ID",
    "_owner": "ID",
    "investigationStatus": "Enum",
    "investigationStatus_": "String",
    "title": "String",
    "openedByUserId": "ID",
    "assignedToUserIds": "ID",
    "relatedReportIds": "ID",
    "relatedFlagIds": "ID",
    "details": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  },
  "abuseInvestigation": {
    "id": "ID",
    "_owner": "ID",
    "investigationStatus": "Enum",
    "investigationStatus_": "String",
    "title": "String",
    "openedByUserId": "ID",
    "assignedToUserIds": "ID",
    "relatedReportIds": "ID",
    "relatedFlagIds": "ID",
    "details": "Object",
    "isActive": true,
    "recordVersion": "Integer",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
}
```

## DbEvent abuseInvestigation-deleted

**Event topic**: `redditclone-abuse-service-dbevent-abuseinvestigation-deleted`

This event announces the deletion of a `abuseInvestigation` data object, covering both hard deletions (permanent removal) and soft deletions (where the `isActive` attribute is set to false). Regardless of the deletion type, the event payload will present the data as it was immediately before deletion, highlighting an `isActive` status of false for soft deletions.

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "investigationStatus": "Enum",
  "investigationStatus_": "String",
  "title": "String",
  "openedByUserId": "ID",
  "assignedToUserIds": "ID",
  "relatedReportIds": "ID",
  "relatedFlagIds": "ID",
  "details": "Object",
  "isActive": false,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

# ElasticSearch Index Events

Within the `Abuse` service, most data objects are mirrored in ElasticSearch indices, ensuring these indices remain syncronized with their database counterparts through creation, updates, and deletions. These indices serve dual purposes: they act as a data source for external services and furnish aggregated data tailored to enhance frontend user experiences. Consequently, an ElasticSearch index might encapsulate data in its original form or aggregate additional information from other data objects.

These aggregations can include both one-to-one and one-to-many relationships not only with database objects within the same service but also across different services. This capability allows developers to access comprehensive, aggregated data efficiently. By subscribing to ElasticSearch index events, developers are notified when an index is updated and can directly obtain the aggregated entity within the event payload, bypassing the need for separate ElasticSearch queries.

It's noteworthy that some services may augment another service's index by appending to the entity’s `extends` object. In such scenarios, an `*-extended` event will contain only the newly added data. Should you require the complete dataset, you would need to retrieve the full ElasticSearch index entity using the provided ID.

This approach to indexing and event handling facilitates a modular, interconnected architecture where services can seamlessly integrate and react to changes, enriching the overall data ecosystem and enabling more dynamic, responsive applications.

## Index Event abusereport-created

**Event topic**: `elastic-index-redditclone_abusereport-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "reportType": "Enum",
  "reportType_": "String",
  "reportStatus": "Enum",
  "reportStatus_": "String",
  "reasonText": "Text",
  "reporterUserId": "ID",
  "reportedUserId": "ID",
  "postId": "ID",
  "commentId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "resolutionResult": "Enum",
  "resolutionResult_": "String",
  "resolvedByUserId": "ID",
  "extraData": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abusereport-updated

**Event topic**: `elastic-index-redditclone_abusereport-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "reportType": "Enum",
  "reportType_": "String",
  "reportStatus": "Enum",
  "reportStatus_": "String",
  "reasonText": "Text",
  "reporterUserId": "ID",
  "reportedUserId": "ID",
  "postId": "ID",
  "commentId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "resolutionResult": "Enum",
  "resolutionResult_": "String",
  "resolvedByUserId": "ID",
  "extraData": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abusereport-deleted

**Event topic**: `elastic-index-redditclone_abusereport-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "reportType": "Enum",
  "reportType_": "String",
  "reportStatus": "Enum",
  "reportStatus_": "String",
  "reasonText": "Text",
  "reporterUserId": "ID",
  "reportedUserId": "ID",
  "postId": "ID",
  "commentId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "resolutionResult": "Enum",
  "resolutionResult_": "String",
  "resolvedByUserId": "ID",
  "extraData": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abusereport-extended

**Event topic**: `elastic-index-redditclone_abusereport-extended`

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

## Route Event abusereport-created

**Event topic** : `redditclone-abuse-service-abusereport-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-updated

**Event topic** : `redditclone-abuse-service-abusereport-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-deleted

**Event topic** : `redditclone-abuse-service-abusereport-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": false }
}
```

## Route Event abuseflag-created

**Event topic** : `redditclone-abuse-service-abuseflag-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-updated

**Event topic** : `redditclone-abuse-service-abuseflag-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-deleted

**Event topic** : `redditclone-abuse-service-abuseflag-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": false }
}
```

## Route Event abuseheuristictrigger-created

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-updated

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-deleted

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": false }
}
```

## Route Event abuseinvestigation-created

**Event topic** : `redditclone-abuse-service-abuseinvestigation-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-updated

**Event topic** : `redditclone-abuse-service-abuseinvestigation-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-deleted

**Event topic** : `redditclone-abuse-service-abuseinvestigation-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": false }
}
```

## Index Event abuseflag-created

**Event topic**: `elastic-index-redditclone_abuseflag-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "flagType": "Enum",
  "flagType_": "String",
  "flagStatus": "Enum",
  "flagStatus_": "String",
  "postId": "ID",
  "commentId": "ID",
  "userId": "ID",
  "mediaObjectId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseflag-updated

**Event topic**: `elastic-index-redditclone_abuseflag-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "flagType": "Enum",
  "flagType_": "String",
  "flagStatus": "Enum",
  "flagStatus_": "String",
  "postId": "ID",
  "commentId": "ID",
  "userId": "ID",
  "mediaObjectId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseflag-deleted

**Event topic**: `elastic-index-redditclone_abuseflag-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "flagType": "Enum",
  "flagType_": "String",
  "flagStatus": "Enum",
  "flagStatus_": "String",
  "postId": "ID",
  "commentId": "ID",
  "userId": "ID",
  "mediaObjectId": "ID",
  "origin": "Enum",
  "origin_": "String",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseflag-extended

**Event topic**: `elastic-index-redditclone_abuseflag-extended`

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

## Route Event abusereport-created

**Event topic** : `redditclone-abuse-service-abusereport-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-updated

**Event topic** : `redditclone-abuse-service-abusereport-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-deleted

**Event topic** : `redditclone-abuse-service-abusereport-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": false }
}
```

## Route Event abuseflag-created

**Event topic** : `redditclone-abuse-service-abuseflag-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-updated

**Event topic** : `redditclone-abuse-service-abuseflag-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-deleted

**Event topic** : `redditclone-abuse-service-abuseflag-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": false }
}
```

## Route Event abuseheuristictrigger-created

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-updated

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-deleted

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": false }
}
```

## Route Event abuseinvestigation-created

**Event topic** : `redditclone-abuse-service-abuseinvestigation-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-updated

**Event topic** : `redditclone-abuse-service-abuseinvestigation-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-deleted

**Event topic** : `redditclone-abuse-service-abuseinvestigation-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": false }
}
```

## Index Event abuseheuristictrigger-created

**Event topic**: `elastic-index-redditclone_abuseheuristictrigger-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "triggerType": "Enum",
  "triggerType_": "String",
  "userId": "ID",
  "ipAddress": "String",
  "targetId": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseheuristictrigger-updated

**Event topic**: `elastic-index-redditclone_abuseheuristictrigger-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "triggerType": "Enum",
  "triggerType_": "String",
  "userId": "ID",
  "ipAddress": "String",
  "targetId": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseheuristictrigger-deleted

**Event topic**: `elastic-index-redditclone_abuseheuristictrigger-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "triggerType": "Enum",
  "triggerType_": "String",
  "userId": "ID",
  "ipAddress": "String",
  "targetId": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseheuristictrigger-extended

**Event topic**: `elastic-index-redditclone_abuseheuristictrigger-extended`

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

## Route Event abusereport-created

**Event topic** : `redditclone-abuse-service-abusereport-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-updated

**Event topic** : `redditclone-abuse-service-abusereport-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-deleted

**Event topic** : `redditclone-abuse-service-abusereport-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": false }
}
```

## Route Event abuseflag-created

**Event topic** : `redditclone-abuse-service-abuseflag-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-updated

**Event topic** : `redditclone-abuse-service-abuseflag-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-deleted

**Event topic** : `redditclone-abuse-service-abuseflag-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": false }
}
```

## Route Event abuseheuristictrigger-created

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-updated

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-deleted

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": false }
}
```

## Route Event abuseinvestigation-created

**Event topic** : `redditclone-abuse-service-abuseinvestigation-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-updated

**Event topic** : `redditclone-abuse-service-abuseinvestigation-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-deleted

**Event topic** : `redditclone-abuse-service-abuseinvestigation-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": false }
}
```

## Index Event abuseinvestigation-created

**Event topic**: `elastic-index-redditclone_abuseinvestigation-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "investigationStatus": "Enum",
  "investigationStatus_": "String",
  "title": "String",
  "openedByUserId": "ID",
  "assignedToUserIds": "ID",
  "relatedReportIds": "ID",
  "relatedFlagIds": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseinvestigation-updated

**Event topic**: `elastic-index-redditclone_abuseinvestigation-created`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "investigationStatus": "Enum",
  "investigationStatus_": "String",
  "title": "String",
  "openedByUserId": "ID",
  "assignedToUserIds": "ID",
  "relatedReportIds": "ID",
  "relatedFlagIds": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseinvestigation-deleted

**Event topic**: `elastic-index-redditclone_abuseinvestigation-deleted`

**Event payload**:

```json
{
  "id": "ID",
  "_owner": "ID",
  "investigationStatus": "Enum",
  "investigationStatus_": "String",
  "title": "String",
  "openedByUserId": "ID",
  "assignedToUserIds": "ID",
  "relatedReportIds": "ID",
  "relatedFlagIds": "ID",
  "details": "Object",
  "isActive": true,
  "recordVersion": "Integer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Index Event abuseinvestigation-extended

**Event topic**: `elastic-index-redditclone_abuseinvestigation-extended`

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

## Route Event abusereport-created

**Event topic** : `redditclone-abuse-service-abusereport-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-updated

**Event topic** : `redditclone-abuse-service-abusereport-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

## Route Event abusereport-deleted

**Event topic** : `redditclone-abuse-service-abusereport-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseReport` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseReport`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseReport",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": false }
}
```

## Route Event abuseflag-created

**Event topic** : `redditclone-abuse-service-abuseflag-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-updated

**Event topic** : `redditclone-abuse-service-abuseflag-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

## Route Event abuseflag-deleted

**Event topic** : `redditclone-abuse-service-abuseflag-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseFlag` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseFlag`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseFlag",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": false }
}
```

## Route Event abuseheuristictrigger-created

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-updated

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

## Route Event abuseheuristictrigger-deleted

**Event topic** : `redditclone-abuse-service-abuseheuristictrigger-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseHeuristicTrigger` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseHeuristicTrigger`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseHeuristicTrigger",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": false }
}
```

## Route Event abuseinvestigation-created

**Event topic** : `redditclone-abuse-service-abuseinvestigation-created`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-updated

**Event topic** : `redditclone-abuse-service-abuseinvestigation-updated`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

## Route Event abuseinvestigation-deleted

**Event topic** : `redditclone-abuse-service-abuseinvestigation-deleted`

**Event payload**:

The event payload, mirroring the REST API response, is structured as an encapsulated JSON. It includes metadata related to the API as well as the `abuseInvestigation` data object itself.

The following JSON included in the payload illustrates the fullest representation of the **`abuseInvestigation`** object. Note, however, that certain properties might be excluded in accordance with the object's inherent logic.

```json
{
  "status": "OK",
  "statusCode": "200",
  "elapsedMs": 126,
  "ssoTime": 120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName": "abuseInvestigation",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": false }
}
```

# Copyright

All sources, documents and other digital materials are copyright of .

# About Us

For more information please visit our website: .

.
.
