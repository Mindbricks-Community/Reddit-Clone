# REST API GUIDE

## redditclone-moderation-service

Implements manual and automated moderation tools, including actions (approve/remove/lock/warn/ban), automod events processing, moderate report workflow, moderator audit logging, and modmail messaging for the platform. Integrates deeply with core community/content services for moderation control and transparency.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Moderation Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Moderation Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Moderation Service via HTTP requests for purposes such as creating, updating, deleting and querying Moderation objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Moderation Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Moderation service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

**Protected Routes**:
Certain routes require specific authorization levels. Access to these routes is contingent upon the possession of a valid access token that meets the route-specific authorization criteria. Unauthorized requests to these routes will be rejected.

**Public Routes**:
The service also includes routes that are accessible without authentication. These public endpoints are designed for open access and do not require an access token.

### Token Locations

When including your access token in a request, ensure it is placed in one of the following specified locations. The service will sequentially search these locations for the token, utilizing the first one it encounters.

| Location             | Token Name / Param Name  |
| -------------------- | ------------------------ |
| Query                | access_token             |
| Authorization Header | Bearer                   |
| Header               | redditclone-access-token |
| Cookie               | redditclone-access-token |

Please ensure the token is correctly placed in one of these locations, using the appropriate label as indicated. The service prioritizes these locations in the order listed, processing the first token it successfully identifies.

## Api Definitions

This section outlines the API endpoints available within the Moderation service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Moderation service.

This service is configured to listen for HTTP requests on port `3003`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://moderation-api-redditclone.prw.mindbricks.com`
- **Staging:** `https://moderation-api-redditclone.staging.mindbricks.com`
- **Production:** `https://moderation-api-redditclone.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Moderation service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Moderation` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Moderation` service.

### Error Response

If a request encounters an issue, whether due to a logical fault or a technical problem, the service responds with a standardized JSON error structure. The HTTP status code within this response indicates the nature of the error, utilizing commonly recognized codes for clarity:

- **400 Bad Request**: The request was improperly formatted or contained invalid parameters, preventing the server from processing it.
- **401 Unauthorized**: The request lacked valid authentication credentials or the credentials provided do not grant access to the requested resource.
- **404 Not Found**: The requested resource was not found on the server.
- **500 Internal Server Error**: The server encountered an unexpected condition that prevented it from fulfilling the request.

Each error response is structured to provide meaningful insight into the problem, assisting in diagnosing and resolving issues efficiently.

```js
{
  "result": "ERR",
  "status": 400,
  "message": "errMsg_organizationIdisNotAValidID",
  "errCode": 400,
  "date": "2024-03-19T12:13:54.124Z",
  "detail": "String"
}
```

### Object Structure of a Successfull Response

When the `Moderation` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

**Key Characteristics of the Response Envelope:**

- **Data Presentation**: Depending on the nature of the request, the service returns either a single data object or an array of objects encapsulated within the JSON envelope.
  - **Creation and Update Routes**: These routes return the unmodified (pure) form of the data object(s), without any associations to other data objects.
  - **Delete Routes**: Even though the data is removed from the database, the last known state of the data object(s) is returned in its pure form.
  - **Get Requests**: A single data object is returned in JSON format.
  - **Get List Requests**: An array of data objects is provided, reflecting a collection of resources.

- **Data Structure and Joins**: The complexity of the data structure in the response can vary based on the route's architectural design and the join options specified in the request. The architecture might inherently limit join operations, or they might be dynamically controlled through query parameters.
  - **Pure Data Forms**: In some cases, the response mirrors the exact structure found in the primary data table, without extensions.
  - **Extended Data Forms**: Alternatively, responses might include data extended through joins with tables within the same service or aggregated from external sources, such as ElasticSearch indices related to other services.
  - **Join Varieties**: The extensions might involve one-to-one joins, resulting in single object associations, or one-to-many joins, leading to an array of objects. In certain instances, the data might even feature nested inclusions from other data objects.

**Design Considerations**: The structure of a route's response data is meticulously crafted during the service's architectural planning. This design ensures that responses adequately reflect the intended data relationships and service logic, providing clients with rich and meaningful information.

**Brief Data**: Certain routes return a condensed version of the object data, intentionally selecting only specific fields deemed useful for that request. In such instances, the route documentation will detail the properties included in the response, guiding developers on what to expect.

### API Response Structure

The API utilizes a standardized JSON envelope to encapsulate responses. This envelope is designed to consistently deliver both the requested data and essential metadata, ensuring that clients can efficiently interpret and utilize the response.

**HTTP Status Codes:**

- **200 OK**: This status code is returned for successful GET, GETLIST, UPDATE, or DELETE operations, indicating that the request has been processed successfully.
- **201 Created**: This status code is specific to CREATE operations, signifying that the requested resource has been successfully created.

**Success Response Format:**

For successful operations, the response includes a `"status": "OK"` property, signaling the successful execution of the request. The structure of a successful response is outlined below:

```json
{
  "status":"OK",
  "statusCode": 200,
  "elapsedMs":126,
  "ssoTime":120,
  "source": "db",
  "cacheKey": "hexCode",
  "userId": "ID",
  "sessionId": "ID",
  "requestId": "ID",
  "dataName":"products",
  "method":"GET",
  "action":"getList",
  "appVersion":"Version",
  "rowCount":3
  "products":[{},{},{}],
  "paging": {
    "pageNumber":1,
    "pageRowCount":25,
    "totalRowCount":3,
    "pageCount":1
  },
  "filters": [],
  "uiPermissions": []
}
```

- **`products`**: In this example, this key contains the actual response content, which may be a single object or an array of objects depending on the operation performed.

**Handling Errors:**

For details on handling error scenarios and understanding the structure of error responses, please refer to the "Error Response" section provided earlier in this documentation. It outlines how error conditions are communicated, including the use of HTTP status codes and standardized JSON structures for error messages.

**Route Validation Layers:**

Route Validations may be executed in 4 different layers. The layer is a kind of time definition in the route life cycle. Note that while conditional check times are defined by layers, the fetch actions are defined by access times.

`layer1`: "The first layer of route life cycle which is just after the request parameters are validated and the request is in controller. Any script, validation or data operation in this layer can access the route parameters only. The beforeInstance data is not ready yet."

`layer2`: "The second layer of route life cycle which is just after beforeInstance data is collected before the main operation of the route and the main operation is not started yet. In this layer the collected supplementary data is accessable with the route parameters."

`layer3`: "The third layer of route life cycle which is just after the main operation of the route is completed. In this layer the main operation result is accessable with the beforeInstance data and route parameters. Note that the afterInstance data is not ready yet."

`layer4`: "The last layer of route life cycle which is just after afterInstance supplementary data is collected. In this layer the afterInstance data is accessable with the main operation result, beforeInstance data and route parameters."

## Resources

Moderation service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### ModerationAction resource

_Resource Definition_ : Records each manual moderation action (approve, remove, lock, warn, temp-ban, etc.) performed on a post, comment, or user within a community for audit and workflow.
_ModerationAction Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Target community where the moderation action takes place._ |
| **targetType** | Enum | | | _Target type: 0=post, 1=comment, 2=user._ |
| **targetId** | ID | | | _ID of the entity (post, comment, or user) on which action is performed._ |
| **actionType** | Enum | | | _Action taken: 0=approve, 1=remove, 2=lock, 3=unlock, 4=warn, 5=temp-ban, 6=perm-ban, 7=unban, 8=bulk-remove, 9=bulk-approve, 10=note._ |
| **performedByUserId** | ID | | | _ID of the moderator who performed the action._ |
| **performedByRole** | Enum | | | _Role of actor: 0=moderator, 1=admin (community-level or platform admin)._ |
| **reason** | String | | | _Short text reason provided by the moderator (public explanation)._ |
| **notes** | Text | | | _Optional detailed moderator notes (private, not shown to user)._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### targetType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **post** | `"post""` | 0 |
| **comment** | `"comment""` | 1 |
| **user** | `"user""` | 2 |

##### actionType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **approve** | `"approve""` | 0 |
| **remove** | `"remove""` | 1 |
| **lock** | `"lock""` | 2 |
| **unlock** | `"unlock""` | 3 |
| **warn** | `"warn""` | 4 |
| **tempBan** | `"tempBan""` | 5 |
| **permBan** | `"permBan""` | 6 |
| **unban** | `"unban""` | 7 |
| **bulkRemove** | `"bulkRemove""` | 8 |
| **bulkApprove** | `"bulkApprove""` | 9 |
| **note** | `"note""` | 10 |

##### performedByRole Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **moderator** | `"moderator""` | 0 |
| **admin** | `"admin""` | 1 |

### AutomodEvent resource

_Resource Definition_ : Records each event generated by the community-level automoderator logic (trigger, removal, lock, filter, etc). Links to content, rule, and context.
_AutomodEvent Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Community where this automod event took place._ |
| **targetType** | Enum | | | _Target type: 0=post, 1=comment._ |
| **targetId** | ID | | | _ID of the post or comment affected by the automod event._ |
| **automodType** | Enum | | | _Type of automod event: 0=trigger, 1=auto-remove, 2=auto-lock, 3=flag-nsfw, 4=filter, 5=rate-limit, 6=spam-detect, 7=media-flag, 8=custom._ |
| **ruleId** | ID | | | _ID of the automod or community rule (if any) that triggered the event._ |
| **performedByAutomod** | Boolean | | | _True if the action/event was performed by automod._ |
| **triggerDetails** | Object | | | _JSON blob: detailed trigger context: keywords, patterns, match values._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### targetType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **post** | `"post""` | 0 |
| **comment** | `"comment""` | 1 |

##### automodType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **trigger** | `"trigger""` | 0 |
| **autoRemove** | `"autoRemove""` | 1 |
| **autoLock** | `"autoLock""` | 2 |
| **flagNsfw** | `"flagNsfw""` | 3 |
| **filter** | `"filter""` | 4 |
| **rateLimit** | `"rateLimit""` | 5 |
| **spamDetect** | `"spamDetect""` | 6 |
| **mediaFlag** | `"mediaFlag""` | 7 |
| **custom** | `"custom""` | 8 |

### ModerationAuditLog resource

_Resource Definition_ : Complete audit log of all moderation and automod events, including manual actions, automated actions, and source context.
_ModerationAuditLog Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **logEntryType** | Enum | | | _Type of log entry: 0=moderationAction, 1=automodEvent, 2=reportLinked, 3=bulkAction._ |
| **communityId** | ID | | | _Community context of the log entry._ |
| **entityType** | Enum | | | _Entity type the log references: 0=post, 1=comment, 2=user, 3=other._ |
| **entityId** | ID | | | _ID of the referenced post/comment/user/object._ |
| **actionUserId** | ID | | | _ID of the actor (moderator/admin/user/automod)._ |
| **linkedModerationActionId** | ID | | | _If this log is tied to a specific moderationAction entry._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### logEntryType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **moderationAction** | `"moderationAction""` | 0 |
| **automodEvent** | `"automodEvent""` | 1 |
| **reportLinked** | `"reportLinked""` | 2 |
| **bulkAction** | `"bulkAction""` | 3 |

##### entityType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **post** | `"post""` | 0 |
| **comment** | `"comment""` | 1 |
| **user** | `"user""` | 2 |
| **other** | `"other""` | 3 |

### ModmailThread resource

_Resource Definition_ : Represents a modmail conversation thread between moderators and a user (or group, if extended). Thread is logical envelope for messages.
_ModmailThread Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Community in which modmail is scoped._ |
| **subject** | String | | | _Subject line of the thread._ |
| **createdByUserId** | ID | | | _User (or moderator) who created the thread._ |
| **status** | Enum | | | _Status of the thread: 0=open, 1=resolved, 2=archived, 3=deleted._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **open** | `"open""` | 0 |
| **resolved** | `"resolved""` | 1 |
| **archived** | `"archived""` | 2 |
| **deleted** | `"deleted""` | 3 |

### ModmailMessage resource

_Resource Definition_ : A message sent as part of a modmail thread; can be by a moderator or a user.
_ModmailMessage Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **threadId** | ID | | | _Reference to the parent modmail thread._ |
| **senderUserId** | ID | | | _User/moderator who sent this message._ |
| **messageBody** | Text | | | _Body of the modmail message._ |
| **messageType** | Enum | | | _Type of message: 0=user, 1=moderator, 2=system._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### messageType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **user** | `"user""` | 0 |
| **moderator** | `"moderator""` | 1 |
| **system** | `"system""` | 2 |

## Crud Routes

### Route: getModerationAction

_Route Definition_ : Fetch a specific moderation action by id.

_Route Type_ : get

_Default access route_ : _GET_ `/moderationactions/:moderationActionId`

#### Parameters

The getModerationAction api has got 1 parameter

| Parameter          | Type | Required | Population                         |
| ------------------ | ---- | -------- | ---------------------------------- |
| moderationActionId | ID   | true     | request.params?.moderationActionId |

To access the api you can use the **REST** controller with the path **GET /moderationactions/:moderationActionId**

```js
axios({
  method: "GET",
  url: `/moderationactions/${moderationActionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAction",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAction": { "id": "ID", "isActive": true }
}
```

### Route: createModerationAction

_Route Definition_ : Record a new moderation action performed by a moderator or admin.

_Route Type_ : create

_Default access route_ : _POST_ `/moderationactions`

#### Parameters

The createModerationAction api has got 7 parameters

| Parameter       | Type   | Required | Population                    |
| --------------- | ------ | -------- | ----------------------------- |
| communityId     | ID     | true     | request.body?.communityId     |
| targetType      | Enum   | true     | request.body?.targetType      |
| targetId        | ID     | true     | request.body?.targetId        |
| actionType      | Enum   | true     | request.body?.actionType      |
| performedByRole | Enum   | true     | request.body?.performedByRole |
| reason          | String | false    | request.body?.reason          |
| notes           | Text   | false    | request.body?.notes           |

To access the api you can use the **REST** controller with the path **POST /moderationactions**

```js
axios({
  method: "POST",
  url: "/moderationactions",
  data: {
    communityId: "ID",
    targetType: "Enum",
    targetId: "ID",
    actionType: "Enum",
    performedByRole: "Enum",
    reason: "String",
    notes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAction",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAction": { "id": "ID", "isActive": true }
}
```

### Route: updateModerationAction

_Route Definition_ : Update a moderation action. Only notes/reason are usually updatable.

_Route Type_ : update

_Default access route_ : _PATCH_ `/moderationactions/:moderationActionId`

#### Parameters

The updateModerationAction api has got 3 parameters

| Parameter          | Type   | Required | Population                         |
| ------------------ | ------ | -------- | ---------------------------------- |
| moderationActionId | ID     | true     | request.params?.moderationActionId |
| reason             | String | false    | request.body?.reason               |
| notes              | Text   | false    | request.body?.notes                |

To access the api you can use the **REST** controller with the path **PATCH /moderationactions/:moderationActionId**

```js
axios({
  method: "PATCH",
  url: `/moderationactions/${moderationActionId}`,
  data: {
    reason: "String",
    notes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAction",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAction": { "id": "ID", "isActive": true }
}
```

### Route: deleteModerationAction

_Route Definition_ : Soft-delete a moderation action (audit only).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/moderationactions/:moderationActionId`

#### Parameters

The deleteModerationAction api has got 1 parameter

| Parameter          | Type | Required | Population                         |
| ------------------ | ---- | -------- | ---------------------------------- |
| moderationActionId | ID   | true     | request.params?.moderationActionId |

To access the api you can use the **REST** controller with the path **DELETE /moderationactions/:moderationActionId**

```js
axios({
  method: "DELETE",
  url: `/moderationactions/${moderationActionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAction",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAction": { "id": "ID", "isActive": false }
}
```

### Route: listModerationActions

_Route Definition_ : List all moderation actions for a given community, user, or content item.

_Route Type_ : getList

_Default access route_ : _GET_ `/moderationactions`

The listModerationActions api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /moderationactions**

```js
axios({
  method: "GET",
  url: "/moderationactions",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationActions`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationActions",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "moderationActions": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getAutomodEvent

_Route Definition_ : Get a specific automod event by id.

_Route Type_ : get

_Default access route_ : _GET_ `/automodevents/:automodEventId`

#### Parameters

The getAutomodEvent api has got 1 parameter

| Parameter      | Type | Required | Population                     |
| -------------- | ---- | -------- | ------------------------------ |
| automodEventId | ID   | true     | request.params?.automodEventId |

To access the api you can use the **REST** controller with the path **GET /automodevents/:automodEventId**

```js
axios({
  method: "GET",
  url: `/automodevents/${automodEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`automodEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "automodEvent",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "automodEvent": { "id": "ID", "isActive": true }
}
```

### Route: createAutomodEvent

_Route Definition_ : Record a new automod event for moderation or workflow.

_Route Type_ : create

_Default access route_ : _POST_ `/automodevents`

#### Parameters

The createAutomodEvent api has got 7 parameters

| Parameter          | Type    | Required | Population                       |
| ------------------ | ------- | -------- | -------------------------------- |
| communityId        | ID      | true     | request.body?.communityId        |
| targetType         | Enum    | true     | request.body?.targetType         |
| targetId           | ID      | true     | request.body?.targetId           |
| automodType        | Enum    | true     | request.body?.automodType        |
| ruleId             | ID      | false    | request.body?.ruleId             |
| performedByAutomod | Boolean | true     | request.body?.performedByAutomod |
| triggerDetails     | Object  | false    | request.body?.triggerDetails     |

To access the api you can use the **REST** controller with the path **POST /automodevents**

```js
axios({
  method: "POST",
  url: "/automodevents",
  data: {
    communityId: "ID",
    targetType: "Enum",
    targetId: "ID",
    automodType: "Enum",
    ruleId: "ID",
    performedByAutomod: "Boolean",
    triggerDetails: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`automodEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "automodEvent",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "automodEvent": { "id": "ID", "isActive": true }
}
```

### Route: updateAutomodEvent

_Route Definition_ : Update an automod event (rare, for correction).

_Route Type_ : update

_Default access route_ : _PATCH_ `/automodevents/:automodEventId`

#### Parameters

The updateAutomodEvent api has got 2 parameters

| Parameter      | Type   | Required | Population                     |
| -------------- | ------ | -------- | ------------------------------ |
| automodEventId | ID     | true     | request.params?.automodEventId |
| triggerDetails | Object | false    | request.body?.triggerDetails   |

To access the api you can use the **REST** controller with the path **PATCH /automodevents/:automodEventId**

```js
axios({
  method: "PATCH",
  url: `/automodevents/${automodEventId}`,
  data: {
    triggerDetails: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`automodEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "automodEvent",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "automodEvent": { "id": "ID", "isActive": true }
}
```

### Route: deleteAutomodEvent

_Route Definition_ : Soft-delete an automod event.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/automodevents/:automodEventId`

#### Parameters

The deleteAutomodEvent api has got 1 parameter

| Parameter      | Type | Required | Population                     |
| -------------- | ---- | -------- | ------------------------------ |
| automodEventId | ID   | true     | request.params?.automodEventId |

To access the api you can use the **REST** controller with the path **DELETE /automodevents/:automodEventId**

```js
axios({
  method: "DELETE",
  url: `/automodevents/${automodEventId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`automodEvent`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "automodEvent",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "automodEvent": { "id": "ID", "isActive": false }
}
```

### Route: listAutomodEvents

_Route Definition_ : List automod events for a community or content item.

_Route Type_ : getList

_Default access route_ : _GET_ `/automodevents`

The listAutomodEvents api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /automodevents**

```js
axios({
  method: "GET",
  url: "/automodevents",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`automodEvents`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "automodEvents",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "automodEvents": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getModerationAuditLog

_Route Definition_ : Get a specific moderation audit log entry by id.

_Route Type_ : get

_Default access route_ : _GET_ `/moderationauditlogs/:moderationAuditLogId`

#### Parameters

The getModerationAuditLog api has got 1 parameter

| Parameter            | Type | Required | Population                           |
| -------------------- | ---- | -------- | ------------------------------------ |
| moderationAuditLogId | ID   | true     | request.params?.moderationAuditLogId |

To access the api you can use the **REST** controller with the path **GET /moderationauditlogs/:moderationAuditLogId**

```js
axios({
  method: "GET",
  url: `/moderationauditlogs/${moderationAuditLogId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAuditLog",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAuditLog": { "id": "ID", "isActive": true }
}
```

### Route: createModerationAuditLog

_Route Definition_ : Create a new moderation audit log entry (internal use/audit).

_Route Type_ : create

_Default access route_ : _POST_ `/moderationauditlogs`

#### Parameters

The createModerationAuditLog api has got 6 parameters

| Parameter                | Type | Required | Population                             |
| ------------------------ | ---- | -------- | -------------------------------------- |
| logEntryType             | Enum | true     | request.body?.logEntryType             |
| communityId              | ID   | true     | request.body?.communityId              |
| entityType               | Enum | false    | request.body?.entityType               |
| entityId                 | ID   | false    | request.body?.entityId                 |
| actionUserId             | ID   | false    | request.body?.actionUserId             |
| linkedModerationActionId | ID   | false    | request.body?.linkedModerationActionId |

To access the api you can use the **REST** controller with the path **POST /moderationauditlogs**

```js
axios({
  method: "POST",
  url: "/moderationauditlogs",
  data: {
    logEntryType: "Enum",
    communityId: "ID",
    entityType: "Enum",
    entityId: "ID",
    actionUserId: "ID",
    linkedModerationActionId: "ID",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAuditLog",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAuditLog": { "id": "ID", "isActive": true }
}
```

### Route: updateModerationAuditLog

_Route Definition_ : Update a moderation audit log entry.

_Route Type_ : update

_Default access route_ : _PATCH_ `/moderationauditlogs/:moderationAuditLogId`

#### Parameters

The updateModerationAuditLog api has got 1 parameter

| Parameter            | Type | Required | Population                           |
| -------------------- | ---- | -------- | ------------------------------------ |
| moderationAuditLogId | ID   | true     | request.params?.moderationAuditLogId |

To access the api you can use the **REST** controller with the path **PATCH /moderationauditlogs/:moderationAuditLogId**

```js
axios({
  method: "PATCH",
  url: `/moderationauditlogs/${moderationAuditLogId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAuditLog",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAuditLog": { "id": "ID", "isActive": true }
}
```

### Route: deleteModerationAuditLog

_Route Definition_ : Soft-delete a moderation audit log entry (rare, for corrections).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/moderationauditlogs/:moderationAuditLogId`

#### Parameters

The deleteModerationAuditLog api has got 1 parameter

| Parameter            | Type | Required | Population                           |
| -------------------- | ---- | -------- | ------------------------------------ |
| moderationAuditLogId | ID   | true     | request.params?.moderationAuditLogId |

To access the api you can use the **REST** controller with the path **DELETE /moderationauditlogs/:moderationAuditLogId**

```js
axios({
  method: "DELETE",
  url: `/moderationauditlogs/${moderationAuditLogId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAuditLog`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAuditLog",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "moderationAuditLog": { "id": "ID", "isActive": false }
}
```

### Route: listModerationAuditLogs

_Route Definition_ : List moderation audit logs (platform, community, actor, etc.).

_Route Type_ : getList

_Default access route_ : _GET_ `/moderationauditlogs`

The listModerationAuditLogs api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /moderationauditlogs**

```js
axios({
  method: "GET",
  url: "/moderationauditlogs",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`moderationAuditLogs`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "moderationAuditLogs",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "moderationAuditLogs": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getModmailThread

_Route Definition_ : Get a specific modmail thread by id.

_Route Type_ : get

_Default access route_ : _GET_ `/modmailthreads/:modmailThreadId`

#### Parameters

The getModmailThread api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| modmailThreadId | ID   | true     | request.params?.modmailThreadId |

To access the api you can use the **REST** controller with the path **GET /modmailthreads/:modmailThreadId**

```js
axios({
  method: "GET",
  url: `/modmailthreads/${modmailThreadId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailThread`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailThread",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailThread": { "id": "ID", "isActive": true }
}
```

### Route: createModmailThread

_Route Definition_ : Create a new modmail thread.

_Route Type_ : create

_Default access route_ : _POST_ `/modmailthreads`

#### Parameters

The createModmailThread api has got 3 parameters

| Parameter   | Type   | Required | Population                |
| ----------- | ------ | -------- | ------------------------- |
| communityId | ID     | true     | request.body?.communityId |
| subject     | String | true     | request.body?.subject     |
| status      | Enum   | true     | request.body?.status      |

To access the api you can use the **REST** controller with the path **POST /modmailthreads**

```js
axios({
  method: "POST",
  url: "/modmailthreads",
  data: {
    communityId: "ID",
    subject: "String",
    status: "Enum",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailThread`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailThread",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailThread": { "id": "ID", "isActive": true }
}
```

### Route: updateModmailThread

_Route Definition_ : Update a modmail thread&#39;s status or subject.

_Route Type_ : update

_Default access route_ : _PATCH_ `/modmailthreads/:modmailThreadId`

#### Parameters

The updateModmailThread api has got 3 parameters

| Parameter       | Type   | Required | Population                      |
| --------------- | ------ | -------- | ------------------------------- |
| modmailThreadId | ID     | true     | request.params?.modmailThreadId |
| subject         | String | false    | request.body?.subject           |
| status          | Enum   | false    | request.body?.status            |

To access the api you can use the **REST** controller with the path **PATCH /modmailthreads/:modmailThreadId**

```js
axios({
  method: "PATCH",
  url: `/modmailthreads/${modmailThreadId}`,
  data: {
    subject: "String",
    status: "Enum",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailThread`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailThread",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailThread": { "id": "ID", "isActive": true }
}
```

### Route: deleteModmailThread

_Route Definition_ : Soft-delete a modmail thread.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/modmailthreads/:modmailThreadId`

#### Parameters

The deleteModmailThread api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| modmailThreadId | ID   | true     | request.params?.modmailThreadId |

To access the api you can use the **REST** controller with the path **DELETE /modmailthreads/:modmailThreadId**

```js
axios({
  method: "DELETE",
  url: `/modmailthreads/${modmailThreadId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailThread`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailThread",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailThread": { "id": "ID", "isActive": false }
}
```

### Route: listModmailThreads

_Route Definition_ : List all modmail threads for a community or participant.

_Route Type_ : getList

_Default access route_ : _GET_ `/modmailthreads`

The listModmailThreads api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /modmailthreads**

```js
axios({
  method: "GET",
  url: "/modmailthreads",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailThreads`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailThreads",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "modmailThreads": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Route: getModmailMessage

_Route Definition_ : Get a specific modmail message by id.

_Route Type_ : get

_Default access route_ : _GET_ `/modmailmessages/:modmailMessageId`

#### Parameters

The getModmailMessage api has got 1 parameter

| Parameter        | Type | Required | Population                       |
| ---------------- | ---- | -------- | -------------------------------- |
| modmailMessageId | ID   | true     | request.params?.modmailMessageId |

To access the api you can use the **REST** controller with the path **GET /modmailmessages/:modmailMessageId**

```js
axios({
  method: "GET",
  url: `/modmailmessages/${modmailMessageId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailMessage`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailMessage",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailMessage": { "id": "ID", "isActive": true }
}
```

### Route: createModmailMessage

_Route Definition_ : Send a new modmail message in a thread.

_Route Type_ : create

_Default access route_ : _POST_ `/modmailmessages`

#### Parameters

The createModmailMessage api has got 3 parameters

| Parameter   | Type | Required | Population                |
| ----------- | ---- | -------- | ------------------------- |
| threadId    | ID   | true     | request.body?.threadId    |
| messageBody | Text | true     | request.body?.messageBody |
| messageType | Enum | true     | request.body?.messageType |

To access the api you can use the **REST** controller with the path **POST /modmailmessages**

```js
axios({
  method: "POST",
  url: "/modmailmessages",
  data: {
    threadId: "ID",
    messageBody: "Text",
    messageType: "Enum",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailMessage`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailMessage",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailMessage": { "id": "ID", "isActive": true }
}
```

### Route: updateModmailMessage

_Route Definition_ : Update a modmail message (only allowed for sender, if at all).

_Route Type_ : update

_Default access route_ : _PATCH_ `/modmailmessages/:modmailMessageId`

#### Parameters

The updateModmailMessage api has got 1 parameter

| Parameter        | Type | Required | Population                       |
| ---------------- | ---- | -------- | -------------------------------- |
| modmailMessageId | ID   | true     | request.params?.modmailMessageId |

To access the api you can use the **REST** controller with the path **PATCH /modmailmessages/:modmailMessageId**

```js
axios({
  method: "PATCH",
  url: `/modmailmessages/${modmailMessageId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailMessage`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailMessage",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailMessage": { "id": "ID", "isActive": true }
}
```

### Route: deleteModmailMessage

_Route Definition_ : Soft-delete a modmail message.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/modmailmessages/:modmailMessageId`

#### Parameters

The deleteModmailMessage api has got 1 parameter

| Parameter        | Type | Required | Population                       |
| ---------------- | ---- | -------- | -------------------------------- |
| modmailMessageId | ID   | true     | request.params?.modmailMessageId |

To access the api you can use the **REST** controller with the path **DELETE /modmailmessages/:modmailMessageId**

```js
axios({
  method: "DELETE",
  url: `/modmailmessages/${modmailMessageId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailMessage`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailMessage",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "modmailMessage": { "id": "ID", "isActive": false }
}
```

### Route: listModmailMessages

_Route Definition_ : List all messages in a thread.

_Route Type_ : getList

_Default access route_ : _GET_ `/modmailmessages`

The listModmailMessages api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /modmailmessages**

```js
axios({
  method: "GET",
  url: "/modmailmessages",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`modmailMessages`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "modmailMessages",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "modmailMessages": [{ "id": "ID", "isActive": true }, {}, {}],
  "paging": {
    "pageNumber": "Number",
    "pageRowCount": "NUmber",
    "totalRowCount": "Number",
    "pageCount": "Number"
  },
  "filters": [],
  "uiPermissions": []
}
```

### Authentication Specific Routes

### Common Routes

### Route: currentuser

_Route Definition_: Retrieves the currently authenticated user's session information.

_Route Type_: sessionInfo

_Access Route_: `GET /currentuser`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Returns the authenticated session object associated with the current access token.
- If no valid session exists, responds with a 401 Unauthorized.

```js
// Sample GET /currentuser call
axios.get("/currentuser", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**
Returns the session object, including user-related data and token information.

```
{
  "sessionId": "9cf23fa8-07d4-4e7c-80a6-ec6d6ac96bb9",
  "userId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
  "email": "user@example.com",
  "fullname": "John Doe",
  "roleId": "user",
  "tenantId": "abc123",
  "accessToken": "jwt-token-string",
  ...
}
```

**Error Response**
**401 Unauthorized:** No active session found.

```
{
  "status": "ERR",
  "message": "No login found"
}
```

**Notes**

- This route is typically used by frontend or mobile applications to fetch the current session state after login.
- The returned session includes key user identity fields, tenant information (if applicable), and the access token for further authenticated requests.
- Always ensure a valid access token is provided in the request to retrieve the session.

### Route: permissions

`*Route Definition*`: Retrieves all effective permission records assigned to the currently authenticated user.

`*Route Type*`: permissionFetch

_Access Route_: `GET /permissions`

#### Parameters

This route does **not** require any request parameters.

#### Behavior

- Fetches all active permission records (`givenPermissions` entries) associated with the current user session.
- Returns a full array of permission objects.
- Requires a valid session (`access token`) to be available.

```js
// Sample GET /permissions call
axios.get("/permissions", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

Returns an array of permission objects.

```json
[
  {
    "id": "perm1",
    "permissionName": "adminPanel.access",
    "roleId": "admin",
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  },
  {
    "id": "perm2",
    "permissionName": "orders.manage",
    "roleId": null,
    "subjectUserId": "d92b9d4c-9b1e-4e95-842e-3fb9c8c1df38",
    "subjectUserGroupId": null,
    "objectId": null,
    "canDo": true,
    "tenantCodename": "store123"
  }
]
```

Each object reflects a single permission grant, aligned with the givenPermissions model:

- `**permissionName**`: The permission the user has.
- `**roleId**`: If the permission was granted through a role. -` **subjectUserId**`: If directly granted to the user.
- `**subjectUserGroupId**`: If granted through a group.
- `**objectId**`: If tied to a specific object (OBAC).
- `**canDo**`: True or false flag to represent if permission is active or restricted.

**Error Responses**

- **401 Unauthorized**: No active session found.

```json
{
  "status": "ERR",
  "message": "No login found"
}
```

- **500 Internal Server Error**: Unexpected error fetching permissions.

**Notes**

- The /permissions route is available across all backend services generated by Mindbricks, not just the auth service.
- Auth service: Fetches permissions freshly from the live database (givenPermissions table).
- Other services: Typically use a cached or projected view of permissions stored in a common ElasticSearch store, optimized for faster authorization checks.

> **Tip**:
> Applications can cache permission results client-side or server-side, but should occasionally refresh by calling this endpoint, especially after login or permission-changing operations.

### Route: permissions/:permissionName

_Route Definition_: Checks whether the current user has access to a specific permission, and provides a list of scoped object exceptions or inclusions.

_Route Type_: permissionScopeCheck

_Access Route_: `GET /permissions/:permissionName`

#### Parameters

| Parameter      | Type   | Required | Population                      |
| -------------- | ------ | -------- | ------------------------------- |
| permissionName | String | Yes      | `request.params.permissionName` |

#### Behavior

- Evaluates whether the current user **has access** to the given `permissionName`.
- Returns a structured object indicating:
  - Whether the permission is generally granted (`canDo`)
  - Which object IDs are explicitly included or excluded from access (`exceptions`)
- Requires a valid session (`access token`).

```js
// Sample GET /permissions/orders.manage
axios.get("/permissions/orders.manage", {
  headers: {
    Authorization: "Bearer your-jwt-token",
  },
});
```

**Success Response**

```json
{
  "canDo": true,
  "exceptions": [
    "a1f2e3d4-xxxx-yyyy-zzzz-object1",
    "b2c3d4e5-xxxx-yyyy-zzzz-object2"
  ]
}
```

- If `canDo` is `true`, the user generally has the permission, but not for the objects listed in `exceptions` (i.e., restrictions).
- If `canDo` is `false`, the user does not have the permission by default — but only for the objects in `exceptions`, they do have permission (i.e., selective overrides).
- The exceptions array contains valid **UUID strings**, each corresponding to an object ID (typically from the data model targeted by the permission).

## Copyright

All sources, documents and other digital materials are copyright of .

## About Us

For more information please visit our website: .

.
.
