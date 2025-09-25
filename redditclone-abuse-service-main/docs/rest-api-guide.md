# REST API GUIDE

## redditclone-abuse-service

Handles abuse and anti-spam workflows: collects and triages reports, enforces heuristics/rate limits, tracks flags on users/content, manages abuse investigations. Integrates with moderation/adminOps/content for platform health and safety.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Abuse Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Abuse Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Abuse Service via HTTP requests for purposes such as creating, updating, deleting and querying Abuse objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Abuse Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Abuse service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

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

This section outlines the API endpoints available within the Abuse service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Abuse service.

This service is configured to listen for HTTP requests on port `3005`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://abuse-api-redditclone.prw.mindbricks.com`
- **Staging:** `https://abuse-api-redditclone.staging.mindbricks.com`
- **Production:** `https://abuse-api-redditclone.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Abuse service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Abuse` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Abuse` service.

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

When the `Abuse` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

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

Abuse service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### AbuseReport resource

_Resource Definition_ : Tracks each instance where a user or automated system reports abuse, spam, policy violation, or problematic behavior on a post, comment, or user. Includes reporter, reason, target links, status, result, and moderation review info.
_AbuseReport Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **reportType** | Enum | | | _Type of abuse being reported: spam, harassment, rules, nsfw, other._ |
| **reportStatus** | Enum | | | _Current status: new/queued, under_review, forwarded, resolved, dismissed, invalid._ |
| **reasonText** | Text | | | _User-provided or system-generated explanation for report._ |
| **reporterUserId** | ID | | | _User who initiated the report._ |
| **reportedUserId** | ID | | | _User being reported (directly or as post/comment author)._ |
| **postId** | ID | | | _ID of the reported post (if applicable)._ |
| **commentId** | ID | | | _ID of the reported comment (if applicable)._ |
| **origin** | Enum | | | _Was report user-initiated/manual, automod, or external integration?_ |
| **resolutionResult** | Enum | | | _Outcome: content actioned (removed...), dismissed, after mod/admin review. Null if unresolved._ |
| **resolvedByUserId** | ID | | | _Moderator/admin/automod (user)ID who resolved the report._ |
| **extraData** | Object | | | _Flexible JSON for custom keys: browser, source IP, additional evidence, or attachment refs for mod workflow._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### reportType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **spam** | `"spam""` | 0 |
| **harassment** | `"harassment""` | 1 |
| **ruleViolation** | `"ruleViolation""` | 2 |
| **nsfw** | `"nsfw""` | 3 |
| **malware** | `"malware""` | 4 |
| **selfHarm** | `"selfHarm""` | 5 |
| **impersonation** | `"impersonation""` | 6 |
| **other** | `"other""` | 7 |

##### reportStatus Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **new** | `"new""` | 0 |
| **underReview** | `"underReview""` | 1 |
| **forwarded** | `"forwarded""` | 2 |
| **resolved** | `"resolved""` | 3 |
| **dismissed** | `"dismissed""` | 4 |
| **invalid** | `"invalid""` | 5 |

##### origin Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **user** | `"user""` | 0 |
| **automod** | `"automod""` | 1 |
| **external** | `"external""` | 2 |

##### resolutionResult Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **none** | `"none""` | 0 |
| **contentRemoved** | `"contentRemoved""` | 1 |
| **userRestricted** | `"userRestricted""` | 2 |
| **noAction** | `"noAction""` | 3 |
| **invalid** | `"invalid""` | 4 |
| **banned** | `"banned""` | 5 |
| **other** | `"other""` | 6 |

### AbuseFlag resource

_Resource Definition_ : Flags set automatically (machine/mod heuristics or batch mod actions) for (potential) abusive behavior. Linked to post, comment, user, or media. Used for marking, filtering, forwarding to moderation, or auto-restriction.
_AbuseFlag Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **flagType** | Enum | | | _Type of flag (spam, nsfw, ban-evasion, rate-abuse, suspicious, malware, automodCustom, other)._ |
| **flagStatus** | Enum | | | _Status of the flag (active, reviewed, dismissed, escalated, resolved, suppressed)._ |
| **postId** | ID | | | _Flagged post (optional, mutually exclusive with commentId, userId, mediaObjectId)._ |
| **commentId** | ID | | | _Flagged comment (optional, mutually exclusive with postId, userId, mediaObjectId)._ |
| **userId** | ID | | | _Flagged user (optional, mutually exclusive)._ |
| **mediaObjectId** | ID | | | _Flagged media object (optional, for NSFW/malware/other)._ |
| **origin** | Enum | | | _What set this flag: automod, rate-limiter, modtool, admin, external._ |
| **details** | Object | | | _Flexible field for context such as reason, scores, automod pattern, IP data, evidence, timestamps, etc._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### flagType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **spam** | `"spam""` | 0 |
| **nsfw** | `"nsfw""` | 1 |
| **rateAbuse** | `"rateAbuse""` | 2 |
| **suspicious** | `"suspicious""` | 3 |
| **malware** | `"malware""` | 4 |
| **banEvasion** | `"banEvasion""` | 5 |
| **automodCustom** | `"automodCustom""` | 6 |
| **other** | `"other""` | 7 |

##### flagStatus Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **active** | `"active""` | 0 |
| **reviewed** | `"reviewed""` | 1 |
| **dismissed** | `"dismissed""` | 2 |
| **escalated** | `"escalated""` | 3 |
| **resolved** | `"resolved""` | 4 |
| **suppressed** | `"suppressed""` | 5 |

##### origin Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **automod** | `"automod""` | 0 |
| **rateLimiter** | `"rateLimiter""` | 1 |
| **modtool** | `"modtool""` | 2 |
| **admin** | `"admin""` | 3 |
| **external** | `"external""` | 4 |

### AbuseHeuristicTrigger resource

_Resource Definition_ : Tracks anti-abuse/anti-spam system events: rate limits exceeded, spam/harassment heuristics, bulk/flooding events. Can be used for real-time throttling or investigation.
_AbuseHeuristicTrigger Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **triggerType** | Enum | | | _Kind of trigger: rate-exceeded, flood attempt, spam, abusePhrase, botSuspect, multiAccount, rapidVote, other._ |
| **userId** | ID | | | _Affected or triggering user (if any, e.g. rate limited)._ |
| **ipAddress** | String | | | _Source IP address/origination (for rate limits, bot detection, etc)._ |
| **targetId** | ID | | | _ID of post/comment/content/other entity if relevant._ |
| **details** | Object | | | _Flexible metadata (why, how many attempts, evidence, automod pattern, query params, timing, etc)._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### triggerType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **rateExceeded** | `"rateExceeded""` | 0 |
| **floodAttempt** | `"floodAttempt""` | 1 |
| **spamPattern** | `"spamPattern""` | 2 |
| **abusePhrase** | `"abusePhrase""` | 3 |
| **botSuspect** | `"botSuspect""` | 4 |
| **multiAccount** | `"multiAccount""` | 5 |
| **rapidVote** | `"rapidVote""` | 6 |
| **other** | `"other""` | 7 |

### AbuseInvestigation resource

_Resource Definition_ : Tracks ongoing investigations performed by mods/admins on potential abuse cases (spam rings, coordinated attacks, large-scale harassment, etc) for documentation and escalation.
_AbuseInvestigation Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **investigationStatus** | Enum | | | _Status of investigation (open, inProgress, closed, escalated, dismissed, duplicate)_ |
| **title** | String | | | _Short title or summary describing the investigation topic._ |
| **openedByUserId** | ID | | | _Moderator/admin user who opened the investigation._ |
| **assignedToUserIds** | ID | | | _Array of IDs of mods/admins currently active on the investigation._ |
| **relatedReportIds** | ID | | | _Array of abuseReport ids this investigation covers._ |
| **relatedFlagIds** | ID | | | _Array of abuseFlag ids handled in this investigation._ |
| **details** | Object | | | _Flexible details/log field (timeline, findings, next actions, etc)._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### investigationStatus Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **open** | `"open""` | 0 |
| **inProgress** | `"inProgress""` | 1 |
| **closed** | `"closed""` | 2 |
| **escalated** | `"escalated""` | 3 |
| **dismissed** | `"dismissed""` | 4 |
| **duplicate** | `"duplicate""` | 5 |

## Crud Routes

### Route: getAbuseReport

_Route Definition_ : Fetch a single abuse report entry by its ID.

_Route Type_ : get

_Default access route_ : _GET_ `/abusereports/:abuseReportId`

#### Parameters

The getAbuseReport api has got 1 parameter

| Parameter     | Type | Required | Population                    |
| ------------- | ---- | -------- | ----------------------------- |
| abuseReportId | ID   | true     | request.params?.abuseReportId |

To access the api you can use the **REST** controller with the path **GET /abusereports/:abuseReportId**

```js
axios({
  method: "GET",
  url: `/abusereports/${abuseReportId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseReport`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseReport": { "id": "ID", "isActive": true }
}
```

### Route: createAbuseReport

_Route Definition_ : Create a new abuse report for a user, post, or comment.

_Route Type_ : create

_Default access route_ : _POST_ `/abusereports`

#### Parameters

The createAbuseReport api has got 10 parameters

| Parameter        | Type   | Required | Population                     |
| ---------------- | ------ | -------- | ------------------------------ |
| reportType       | Enum   | true     | request.body?.reportType       |
| reportStatus     | Enum   | true     | request.body?.reportStatus     |
| reasonText       | Text   | false    | request.body?.reasonText       |
| reportedUserId   | ID     | false    | request.body?.reportedUserId   |
| postId           | ID     | false    | request.body?.postId           |
| commentId        | ID     | false    | request.body?.commentId        |
| origin           | Enum   | true     | request.body?.origin           |
| resolutionResult | Enum   | false    | request.body?.resolutionResult |
| resolvedByUserId | ID     | false    | request.body?.resolvedByUserId |
| extraData        | Object | false    | request.body?.extraData        |

To access the api you can use the **REST** controller with the path **POST /abusereports**

```js
axios({
  method: "POST",
  url: "/abusereports",
  data: {
    reportType: "Enum",
    reportStatus: "Enum",
    reasonText: "Text",
    reportedUserId: "ID",
    postId: "ID",
    commentId: "ID",
    origin: "Enum",
    resolutionResult: "Enum",
    resolvedByUserId: "ID",
    extraData: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseReport`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updateAbuseReport

_Route Definition_ : Update the status, result, or review fields for an abuse report (e.g., by mod/admin).

_Route Type_ : update

_Default access route_ : _PATCH_ `/abusereports/:abuseReportId`

#### Parameters

The updateAbuseReport api has got 6 parameters

| Parameter        | Type   | Required | Population                     |
| ---------------- | ------ | -------- | ------------------------------ |
| abuseReportId    | ID     | true     | request.params?.abuseReportId  |
| reportStatus     | Enum   | false    | request.body?.reportStatus     |
| reasonText       | Text   | false    | request.body?.reasonText       |
| resolutionResult | Enum   | false    | request.body?.resolutionResult |
| resolvedByUserId | ID     | false    | request.body?.resolvedByUserId |
| extraData        | Object | false    | request.body?.extraData        |

To access the api you can use the **REST** controller with the path **PATCH /abusereports/:abuseReportId**

```js
axios({
  method: "PATCH",
  url: `/abusereports/${abuseReportId}`,
  data: {
    reportStatus: "Enum",
    reasonText: "Text",
    resolutionResult: "Enum",
    resolvedByUserId: "ID",
    extraData: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseReport`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deleteAbuseReport

_Route Definition_ : Delete (or soft-delete) an abuse report (admin/mod action only).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/abusereports/:abuseReportId`

#### Parameters

The deleteAbuseReport api has got 1 parameter

| Parameter     | Type | Required | Population                    |
| ------------- | ---- | -------- | ----------------------------- |
| abuseReportId | ID   | true     | request.params?.abuseReportId |

To access the api you can use the **REST** controller with the path **DELETE /abusereports/:abuseReportId**

```js
axios({
  method: "DELETE",
  url: `/abusereports/${abuseReportId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseReport`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listAbuseReports

_Route Definition_ : List and filter all abuse reports, with support for filtering by type, status, target, reporter or result.

_Route Type_ : getList

_Default access route_ : _GET_ `/abusereports`

The listAbuseReports api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /abusereports**

```js
axios({
  method: "GET",
  url: "/abusereports",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseReports`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "abuseReports",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "abuseReports": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getAbuseFlag

_Route Definition_ : Get an abuse flag by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/abuseflags/:abuseFlagId`

#### Parameters

The getAbuseFlag api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| abuseFlagId | ID   | true     | request.params?.abuseFlagId |

To access the api you can use the **REST** controller with the path **GET /abuseflags/:abuseFlagId**

```js
axios({
  method: "GET",
  url: `/abuseflags/${abuseFlagId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseFlag`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseFlag": { "id": "ID", "isActive": true }
}
```

### Route: createAbuseFlag

_Route Definition_ : Create a new flag for abusive content, user, or media (typically automod/tool driven).

_Route Type_ : create

_Default access route_ : _POST_ `/abuseflags`

#### Parameters

The createAbuseFlag api has got 8 parameters

| Parameter     | Type   | Required | Population                  |
| ------------- | ------ | -------- | --------------------------- |
| flagType      | Enum   | true     | request.body?.flagType      |
| flagStatus    | Enum   | true     | request.body?.flagStatus    |
| postId        | ID     | false    | request.body?.postId        |
| commentId     | ID     | false    | request.body?.commentId     |
| userId        | ID     | false    | request.body?.userId        |
| mediaObjectId | ID     | false    | request.body?.mediaObjectId |
| origin        | Enum   | true     | request.body?.origin        |
| details       | Object | false    | request.body?.details       |

To access the api you can use the **REST** controller with the path **POST /abuseflags**

```js
axios({
  method: "POST",
  url: "/abuseflags",
  data: {
    flagType: "Enum",
    flagStatus: "Enum",
    postId: "ID",
    commentId: "ID",
    userId: "ID",
    mediaObjectId: "ID",
    origin: "Enum",
    details: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseFlag`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updateAbuseFlag

_Route Definition_ : Update status or details of an abuse flag (mod/admin action).

_Route Type_ : update

_Default access route_ : _PATCH_ `/abuseflags/:abuseFlagId`

#### Parameters

The updateAbuseFlag api has got 3 parameters

| Parameter   | Type   | Required | Population                  |
| ----------- | ------ | -------- | --------------------------- |
| abuseFlagId | ID     | true     | request.params?.abuseFlagId |
| flagStatus  | Enum   | false    | request.body?.flagStatus    |
| details     | Object | false    | request.body?.details       |

To access the api you can use the **REST** controller with the path **PATCH /abuseflags/:abuseFlagId**

```js
axios({
  method: "PATCH",
  url: `/abuseflags/${abuseFlagId}`,
  data: {
    flagStatus: "Enum",
    details: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseFlag`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deleteAbuseFlag

_Route Definition_ : Delete/soft-delete a flag (admin/mod action only).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/abuseflags/:abuseFlagId`

#### Parameters

The deleteAbuseFlag api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| abuseFlagId | ID   | true     | request.params?.abuseFlagId |

To access the api you can use the **REST** controller with the path **DELETE /abuseflags/:abuseFlagId**

```js
axios({
  method: "DELETE",
  url: `/abuseflags/${abuseFlagId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseFlag`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listAbuseFlags

_Route Definition_ : List and filter all flags (by status, type, target, origin, etc.).

_Route Type_ : getList

_Default access route_ : _GET_ `/abuseflags`

The listAbuseFlags api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /abuseflags**

```js
axios({
  method: "GET",
  url: "/abuseflags",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseFlags`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "abuseFlags",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "abuseFlags": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getAbuseHeuristicTrigger

_Route Definition_ : Get anti-abuse/anti-spam system trigger by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/abuseheuristictriggers/:abuseHeuristicTriggerId`

#### Parameters

The getAbuseHeuristicTrigger api has got 1 parameter

| Parameter               | Type | Required | Population                              |
| ----------------------- | ---- | -------- | --------------------------------------- |
| abuseHeuristicTriggerId | ID   | true     | request.params?.abuseHeuristicTriggerId |

To access the api you can use the **REST** controller with the path **GET /abuseheuristictriggers/:abuseHeuristicTriggerId**

```js
axios({
  method: "GET",
  url: `/abuseheuristictriggers/${abuseHeuristicTriggerId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseHeuristicTrigger`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseHeuristicTrigger": { "id": "ID", "isActive": true }
}
```

### Route: createAbuseHeuristicTrigger

_Route Definition_ : Insert an anti-abuse system event for rate limit/heuristics (rate-limit, spam, bot, etc).

_Route Type_ : create

_Default access route_ : _POST_ `/abuseheuristictriggers`

#### Parameters

The createAbuseHeuristicTrigger api has got 5 parameters

| Parameter   | Type   | Required | Population                |
| ----------- | ------ | -------- | ------------------------- |
| triggerType | Enum   | true     | request.body?.triggerType |
| userId      | ID     | false    | request.body?.userId      |
| ipAddress   | String | false    | request.body?.ipAddress   |
| targetId    | ID     | false    | request.body?.targetId    |
| details     | Object | false    | request.body?.details     |

To access the api you can use the **REST** controller with the path **POST /abuseheuristictriggers**

```js
axios({
  method: "POST",
  url: "/abuseheuristictriggers",
  data: {
    triggerType: "Enum",
    userId: "ID",
    ipAddress: "String",
    targetId: "ID",
    details: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseHeuristicTrigger`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updateAbuseHeuristicTrigger

_Route Definition_ : Update fields/details of heuristic triggers (e.g., marking as reviewed, resolved, or adding investigation links).

_Route Type_ : update

_Default access route_ : _PATCH_ `/abuseheuristictriggers/:abuseHeuristicTriggerId`

#### Parameters

The updateAbuseHeuristicTrigger api has got 2 parameters

| Parameter               | Type   | Required | Population                              |
| ----------------------- | ------ | -------- | --------------------------------------- |
| abuseHeuristicTriggerId | ID     | true     | request.params?.abuseHeuristicTriggerId |
| details                 | Object | false    | request.body?.details                   |

To access the api you can use the **REST** controller with the path **PATCH /abuseheuristictriggers/:abuseHeuristicTriggerId**

```js
axios({
  method: "PATCH",
  url: `/abuseheuristictriggers/${abuseHeuristicTriggerId}`,
  data: {
    details: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseHeuristicTrigger`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deleteAbuseHeuristicTrigger

_Route Definition_ : Delete a heuristic trigger (admin-only).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/abuseheuristictriggers/:abuseHeuristicTriggerId`

#### Parameters

The deleteAbuseHeuristicTrigger api has got 1 parameter

| Parameter               | Type | Required | Population                              |
| ----------------------- | ---- | -------- | --------------------------------------- |
| abuseHeuristicTriggerId | ID   | true     | request.params?.abuseHeuristicTriggerId |

To access the api you can use the **REST** controller with the path **DELETE /abuseheuristictriggers/:abuseHeuristicTriggerId**

```js
axios({
  method: "DELETE",
  url: `/abuseheuristictriggers/${abuseHeuristicTriggerId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseHeuristicTrigger`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listAbuseHeuristicTriggers

_Route Definition_ : List all abuse system events (rate, spam, bot, etc) for review or analytics.

_Route Type_ : getList

_Default access route_ : _GET_ `/abuseheuristictriggers`

The listAbuseHeuristicTriggers api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /abuseheuristictriggers**

```js
axios({
  method: "GET",
  url: "/abuseheuristictriggers",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseHeuristicTriggers`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "abuseHeuristicTriggers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "abuseHeuristicTriggers": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getAbuseInvestigation

_Route Definition_ : Fetch one abuse investigation by id.

_Route Type_ : get

_Default access route_ : _GET_ `/abuseinvestigations/:abuseInvestigationId`

#### Parameters

The getAbuseInvestigation api has got 1 parameter

| Parameter            | Type | Required | Population                           |
| -------------------- | ---- | -------- | ------------------------------------ |
| abuseInvestigationId | ID   | true     | request.params?.abuseInvestigationId |

To access the api you can use the **REST** controller with the path **GET /abuseinvestigations/:abuseInvestigationId**

```js
axios({
  method: "GET",
  url: `/abuseinvestigations/${abuseInvestigationId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseInvestigation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "abuseInvestigation": { "id": "ID", "isActive": true }
}
```

### Route: createAbuseInvestigation

_Route Definition_ : Create a new abuse investigation (admin/mod only).

_Route Type_ : create

_Default access route_ : _POST_ `/abuseinvestigations`

#### Parameters

The createAbuseInvestigation api has got 7 parameters

| Parameter           | Type   | Required | Population                        |
| ------------------- | ------ | -------- | --------------------------------- |
| investigationStatus | Enum   | true     | request.body?.investigationStatus |
| title               | String | true     | request.body?.title               |
| openedByUserId      | ID     | true     | request.body?.openedByUserId      |
| assignedToUserIds   | ID     | false    | request.body?.assignedToUserIds   |
| relatedReportIds    | ID     | false    | request.body?.relatedReportIds    |
| relatedFlagIds      | ID     | false    | request.body?.relatedFlagIds      |
| details             | Object | false    | request.body?.details             |

To access the api you can use the **REST** controller with the path **POST /abuseinvestigations**

```js
axios({
  method: "POST",
  url: "/abuseinvestigations",
  data: {
    investigationStatus: "Enum",
    title: "String",
    openedByUserId: "ID",
    assignedToUserIds: "ID",
    relatedReportIds: "ID",
    relatedFlagIds: "ID",
    details: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseInvestigation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: updateAbuseInvestigation

_Route Definition_ : Update status/title/details etc. for an abuse investigation.

_Route Type_ : update

_Default access route_ : _PATCH_ `/abuseinvestigations/:abuseInvestigationId`

#### Parameters

The updateAbuseInvestigation api has got 7 parameters

| Parameter            | Type   | Required | Population                           |
| -------------------- | ------ | -------- | ------------------------------------ |
| abuseInvestigationId | ID     | true     | request.params?.abuseInvestigationId |
| investigationStatus  | Enum   | false    | request.body?.investigationStatus    |
| title                | String | false    | request.body?.title                  |
| assignedToUserIds    | ID     | false    | request.body?.assignedToUserIds      |
| relatedReportIds     | ID     | false    | request.body?.relatedReportIds       |
| relatedFlagIds       | ID     | false    | request.body?.relatedFlagIds         |
| details              | Object | false    | request.body?.details                |

To access the api you can use the **REST** controller with the path **PATCH /abuseinvestigations/:abuseInvestigationId**

```js
axios({
  method: "PATCH",
  url: `/abuseinvestigations/${abuseInvestigationId}`,
  data: {
    investigationStatus: "Enum",
    title: "String",
    assignedToUserIds: "ID",
    relatedReportIds: "ID",
    relatedFlagIds: "ID",
    details: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseInvestigation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: deleteAbuseInvestigation

_Route Definition_ : Delete (soft) an abuse investigation (admin only).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/abuseinvestigations/:abuseInvestigationId`

#### Parameters

The deleteAbuseInvestigation api has got 1 parameter

| Parameter            | Type | Required | Population                           |
| -------------------- | ---- | -------- | ------------------------------------ |
| abuseInvestigationId | ID   | true     | request.params?.abuseInvestigationId |

To access the api you can use the **REST** controller with the path **DELETE /abuseinvestigations/:abuseInvestigationId**

```js
axios({
  method: "DELETE",
  url: `/abuseinvestigations/${abuseInvestigationId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseInvestigation`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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

### Route: listAbuseInvestigations

_Route Definition_ : List and filter investigations by status, user, or topic.

_Route Type_ : getList

_Default access route_ : _GET_ `/abuseinvestigations`

The listAbuseInvestigations api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /abuseinvestigations**

```js
axios({
  method: "GET",
  url: "/abuseinvestigations",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`abuseInvestigations`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "abuseInvestigations",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "abuseInvestigations": [{ "id": "ID", "isActive": true }, {}, {}],
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
