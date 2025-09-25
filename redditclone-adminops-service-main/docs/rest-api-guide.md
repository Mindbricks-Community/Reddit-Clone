# REST API GUIDE

## redditclone-adminops-service

Provides platform-level administrative interfaces for user and content management, user suspension/ban, audit logging, GDPR compliance, and policy management.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the AdminOps Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our AdminOps Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the AdminOps Service via HTTP requests for purposes such as creating, updating, deleting and querying AdminOps objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the AdminOps Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the AdminOps service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

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

This section outlines the API endpoints available within the AdminOps service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the AdminOps service.

This service is configured to listen for HTTP requests on port `3004`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://adminOps-api-redditclone.prw.mindbricks.com`
- **Staging:** `https://adminOps-api-redditclone.staging.mindbricks.com`
- **Production:** `https://adminOps-api-redditclone.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the AdminOps service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `AdminOps` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `AdminOps` service.

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

When the `AdminOps` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

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

AdminOps service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### AdminUserAction resource

_Resource Definition_ : Logs platform-level administrative actions taken by admins (e.g., user ban, content removal, compliance actions) for audit and compliance purposes.
_AdminUserAction Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **adminId** | ID | | | _ID of the admin who performed the action_ |
| **targetType** | Enum | | | _Type of entity targeted: user, post, comment, other_ |
| **targetId** | ID | | | _ID of the entity acted upon (userId, postId, or commentId, according to targetType)_ |
| **actionType** | Enum | | | _Type of admin action (ban, unban, suspend, warn, removeContent, unlock, export, deleteAccount, overrideRestriction, other)_ |
| **reason** | String | | | _Short public reason for admin action_ |
| **notes** | Text | | | _Detailed private notes about the action (visible to admins only)_ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### targetType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **user** | `"user""` | 0 |
| **post** | `"post""` | 1 |
| **comment** | `"comment""` | 2 |
| **other** | `"other""` | 3 |

##### actionType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **ban** | `"ban""` | 0 |
| **unban** | `"unban""` | 1 |
| **suspend** | `"suspend""` | 2 |
| **warn** | `"warn""` | 3 |
| **removeContent** | `"removeContent""` | 4 |
| **unlockContent** | `"unlockContent""` | 5 |
| **exportData** | `"exportData""` | 6 |
| **deleteAccount** | `"deleteAccount""` | 7 |
| **overrideRestriction** | `"overrideRestriction""` | 8 |
| **other** | `"other""` | 9 |

### GdprExportRequest resource

_Resource Definition_ : Tracks and manages user data export requests for GDPR compliance (user or admin-initiated).
_GdprExportRequest Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _ID of the user whose data export is requested_ |
| **requestedByAdminId** | ID | | | _ID of admin who initiated the export (null if user-initiated)_ |
| **status** | Enum | | | _Status of export request: pending, processing, completed, failed, canceled_ |
| **exportUrl** | String | | | _URL where user can download the exported data (if completed)_ |
| **errorMsg** | String | | | _Failure details (if status=failed or canceled)_ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **pending** | `"pending""` | 0 |
| **processing** | `"processing""` | 1 |
| **completed** | `"completed""` | 2 |
| **failed** | `"failed""` | 3 |
| **canceled** | `"canceled""` | 4 |

### GdprDeleteRequest resource

_Resource Definition_ : Tracks and manages user data/account erasure requests for GDPR compliance (user or admin-initiated).
_GdprDeleteRequest Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _ID of the user whose data/account deletion is requested_ |
| **requestedByAdminId** | ID | | | _ID of admin who initiated the deletion (null if user-initiated)_ |
| **status** | Enum | | | _Status of delete request: pending, processing, completed, failed, canceled_ |
| **errorMsg** | String | | | _Failure details (if status=failed or canceled)_ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **pending** | `"pending""` | 0 |
| **processing** | `"processing""` | 1 |
| **completed** | `"completed""` | 2 |
| **failed** | `"failed""` | 3 |
| **canceled** | `"canceled""` | 4 |

### CompliancePolicy resource

_Resource Definition_ : Singleton object for sitewide compliance/configuration options (e.g., minimum age, GDPR export/erase policy).
_CompliancePolicy Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **minAge** | Integer | | | _Minimum allowed user age (in years)_ |
| **gdprExportEnabled** | Boolean | | | _Sitewide toggle for GDPR data export availability_ |
| **gdprDeleteEnabled** | Boolean | | | _Sitewide toggle for GDPR delete/erasure availability_ |

### GlobalUserRestriction resource

_Resource Definition_ : Tracks users globally banned, suspended, or shadowbanned at platform level (not per community).
_GlobalUserRestriction Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _User ID being restricted_ |
| **restrictionType** | Enum | | | _Restriction type: ban, suspend, shadowban_ |
| **status** | Enum | | | _Status of restriction: active, revoked, expired_ |
| **startDate** | Date | | | _Start time of restriction (UTC)_ |
| **endDate** | Date | | | _End time of restriction (UTC, null if indefinite)_ |
| **reason** | String | | | _Public reason for restriction_ |
| **adminId** | ID | | | _Admin ID who issued/revoked the restriction_ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### restrictionType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **ban** | `"ban""` | 0 |
| **suspend** | `"suspend""` | 1 |
| **shadowban** | `"shadowban""` | 2 |

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **active** | `"active""` | 0 |
| **revoked** | `"revoked""` | 1 |
| **expired** | `"expired""` | 2 |

## Crud Routes

### Route: getAdminUserAction

_Route Definition_ : Get an admin user action audit entry by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/adminuseractions/:adminUserActionId`

#### Parameters

The getAdminUserAction api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| adminUserActionId | ID   | true     | request.params?.adminUserActionId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /adminuseractions/:adminUserActionId**

```js
axios({
  method: "GET",
  url: `/adminuseractions/${adminUserActionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`adminUserAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "adminUserAction",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "adminUserAction": { "id": "ID", "isActive": true }
}
```

### Route: createAdminUserAction

_Route Definition_ : Create a new admin user action log entry.

_Route Type_ : create

_Default access route_ : _POST_ `/adminuseractions`

#### Parameters

The createAdminUserAction api has got 6 parameters

| Parameter  | Type   | Required | Population               |
| ---------- | ------ | -------- | ------------------------ |
| adminId    | ID     | true     | request.body?.adminId    |
| targetType | Enum   | true     | request.body?.targetType |
| targetId   | ID     | true     | request.body?.targetId   |
| actionType | Enum   | true     | request.body?.actionType |
| reason     | String | false    | request.body?.reason     |
| notes      | Text   | false    | request.body?.notes      |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **POST /adminuseractions**

```js
axios({
  method: "POST",
  url: "/adminuseractions",
  data: {
    adminId: "ID",
    targetType: "Enum",
    targetId: "ID",
    actionType: "Enum",
    reason: "String",
    notes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`adminUserAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "adminUserAction",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "adminUserAction": { "id": "ID", "isActive": true }
}
```

### Route: updateAdminUserAction

_Route Definition_ : Update admin user action log entry (private/notes fields).

_Route Type_ : update

_Default access route_ : _PATCH_ `/adminuseractions/:adminUserActionId`

#### Parameters

The updateAdminUserAction api has got 3 parameters

| Parameter         | Type   | Required | Population                        |
| ----------------- | ------ | -------- | --------------------------------- |
| adminUserActionId | ID     | true     | request.params?.adminUserActionId |
| reason            | String | false    | request.body?.reason              |
| notes             | Text   | false    | request.body?.notes               |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **PATCH /adminuseractions/:adminUserActionId**

```js
axios({
  method: "PATCH",
  url: `/adminuseractions/${adminUserActionId}`,
  data: {
    reason: "String",
    notes: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`adminUserAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "adminUserAction",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "adminUserAction": { "id": "ID", "isActive": true }
}
```

### Route: deleteAdminUserAction

_Route Definition_ : Delete an admin user action log entry.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/adminuseractions/:adminUserActionId`

#### Parameters

The deleteAdminUserAction api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| adminUserActionId | ID   | true     | request.params?.adminUserActionId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **DELETE /adminuseractions/:adminUserActionId**

```js
axios({
  method: "DELETE",
  url: `/adminuseractions/${adminUserActionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`adminUserAction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "adminUserAction",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "adminUserAction": { "id": "ID", "isActive": false }
}
```

### Route: listAdminUserActions

_Route Definition_ : List all admin user action audit logs, with filters.

_Route Type_ : getList

_Default access route_ : _GET_ `/adminuseractions`

The listAdminUserActions api has got no parameters.

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /adminuseractions**

```js
axios({
  method: "GET",
  url: "/adminuseractions",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`adminUserActions`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "adminUserActions",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "adminUserActions": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getGdprExportRequest

_Route Definition_ : Get a GDPR export request by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/gdprexportrequests/:gdprExportRequestId`

#### Parameters

The getGdprExportRequest api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| gdprExportRequestId | ID   | true     | request.params?.gdprExportRequestId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /gdprexportrequests/:gdprExportRequestId**

```js
axios({
  method: "GET",
  url: `/gdprexportrequests/${gdprExportRequestId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprExportRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprExportRequest",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprExportRequest": { "id": "ID", "isActive": true }
}
```

### Route: createGdprExportRequest

_Route Definition_ : Create a new GDPR export request entry.

_Route Type_ : create

_Default access route_ : _POST_ `/gdprexportrequests`

#### Parameters

The createGdprExportRequest api has got 5 parameters

| Parameter          | Type   | Required | Population                       |
| ------------------ | ------ | -------- | -------------------------------- |
| userId             | ID     | true     | request.body?.userId             |
| requestedByAdminId | ID     | false    | request.body?.requestedByAdminId |
| status             | Enum   | true     | request.body?.status             |
| exportUrl          | String | false    | request.body?.exportUrl          |
| errorMsg           | String | false    | request.body?.errorMsg           |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **POST /gdprexportrequests**

```js
axios({
  method: "POST",
  url: "/gdprexportrequests",
  data: {
    userId: "ID",
    requestedByAdminId: "ID",
    status: "Enum",
    exportUrl: "String",
    errorMsg: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprExportRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprExportRequest",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprExportRequest": { "id": "ID", "isActive": true }
}
```

### Route: updateGdprExportRequest

_Route Definition_ : Update a GDPR export request entry (status, error, exportUrl).

_Route Type_ : update

_Default access route_ : _PATCH_ `/gdprexportrequests/:gdprExportRequestId`

#### Parameters

The updateGdprExportRequest api has got 4 parameters

| Parameter           | Type   | Required | Population                          |
| ------------------- | ------ | -------- | ----------------------------------- |
| gdprExportRequestId | ID     | true     | request.params?.gdprExportRequestId |
| status              | Enum   | false    | request.body?.status                |
| exportUrl           | String | false    | request.body?.exportUrl             |
| errorMsg            | String | false    | request.body?.errorMsg              |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **PATCH /gdprexportrequests/:gdprExportRequestId**

```js
axios({
  method: "PATCH",
  url: `/gdprexportrequests/${gdprExportRequestId}`,
  data: {
    status: "Enum",
    exportUrl: "String",
    errorMsg: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprExportRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprExportRequest",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprExportRequest": { "id": "ID", "isActive": true }
}
```

### Route: deleteGdprExportRequest

_Route Definition_ : Delete a GDPR export request entry.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/gdprexportrequests/:gdprExportRequestId`

#### Parameters

The deleteGdprExportRequest api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| gdprExportRequestId | ID   | true     | request.params?.gdprExportRequestId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **DELETE /gdprexportrequests/:gdprExportRequestId**

```js
axios({
  method: "DELETE",
  url: `/gdprexportrequests/${gdprExportRequestId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprExportRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprExportRequest",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprExportRequest": { "id": "ID", "isActive": false }
}
```

### Route: listGdprExportRequests

_Route Definition_ : List GDPR export requests, with filters.

_Route Type_ : getList

_Default access route_ : _GET_ `/gdprexportrequests`

The listGdprExportRequests api has got no parameters.

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /gdprexportrequests**

```js
axios({
  method: "GET",
  url: "/gdprexportrequests",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprExportRequests`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprExportRequests",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "gdprExportRequests": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getGdprDeleteRequest

_Route Definition_ : Get a GDPR deletion request by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/gdprdeleterequests/:gdprDeleteRequestId`

#### Parameters

The getGdprDeleteRequest api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| gdprDeleteRequestId | ID   | true     | request.params?.gdprDeleteRequestId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /gdprdeleterequests/:gdprDeleteRequestId**

```js
axios({
  method: "GET",
  url: `/gdprdeleterequests/${gdprDeleteRequestId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprDeleteRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprDeleteRequest",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprDeleteRequest": { "id": "ID", "isActive": true }
}
```

### Route: createGdprDeleteRequest

_Route Definition_ : Create a new GDPR delete request entry.

_Route Type_ : create

_Default access route_ : _POST_ `/gdprdeleterequests`

#### Parameters

The createGdprDeleteRequest api has got 4 parameters

| Parameter          | Type   | Required | Population                       |
| ------------------ | ------ | -------- | -------------------------------- |
| userId             | ID     | true     | request.body?.userId             |
| requestedByAdminId | ID     | false    | request.body?.requestedByAdminId |
| status             | Enum   | true     | request.body?.status             |
| errorMsg           | String | false    | request.body?.errorMsg           |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **POST /gdprdeleterequests**

```js
axios({
  method: "POST",
  url: "/gdprdeleterequests",
  data: {
    userId: "ID",
    requestedByAdminId: "ID",
    status: "Enum",
    errorMsg: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprDeleteRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprDeleteRequest",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprDeleteRequest": { "id": "ID", "isActive": true }
}
```

### Route: updateGdprDeleteRequest

_Route Definition_ : Update a GDPR delete request entry (status, error).

_Route Type_ : update

_Default access route_ : _PATCH_ `/gdprdeleterequests/:gdprDeleteRequestId`

#### Parameters

The updateGdprDeleteRequest api has got 3 parameters

| Parameter           | Type   | Required | Population                          |
| ------------------- | ------ | -------- | ----------------------------------- |
| gdprDeleteRequestId | ID     | true     | request.params?.gdprDeleteRequestId |
| status              | Enum   | false    | request.body?.status                |
| errorMsg            | String | false    | request.body?.errorMsg              |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **PATCH /gdprdeleterequests/:gdprDeleteRequestId**

```js
axios({
  method: "PATCH",
  url: `/gdprdeleterequests/${gdprDeleteRequestId}`,
  data: {
    status: "Enum",
    errorMsg: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprDeleteRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprDeleteRequest",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprDeleteRequest": { "id": "ID", "isActive": true }
}
```

### Route: deleteGdprDeleteRequest

_Route Definition_ : Delete a GDPR delete request entry.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/gdprdeleterequests/:gdprDeleteRequestId`

#### Parameters

The deleteGdprDeleteRequest api has got 1 parameter

| Parameter           | Type | Required | Population                          |
| ------------------- | ---- | -------- | ----------------------------------- |
| gdprDeleteRequestId | ID   | true     | request.params?.gdprDeleteRequestId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **DELETE /gdprdeleterequests/:gdprDeleteRequestId**

```js
axios({
  method: "DELETE",
  url: `/gdprdeleterequests/${gdprDeleteRequestId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprDeleteRequest`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprDeleteRequest",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "gdprDeleteRequest": { "id": "ID", "isActive": false }
}
```

### Route: listGdprDeleteRequests

_Route Definition_ : List GDPR deletion requests, with filters.

_Route Type_ : getList

_Default access route_ : _GET_ `/gdprdeleterequests`

The listGdprDeleteRequests api has got no parameters.

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /gdprdeleterequests**

```js
axios({
  method: "GET",
  url: "/gdprdeleterequests",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`gdprDeleteRequests`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "gdprDeleteRequests",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "gdprDeleteRequests": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getCompliancePolicy

_Route Definition_ : Get compliance policy (singleton, by id).

_Route Type_ : get

_Default access route_ : _GET_ `/compliancepolicies/:compliancePolicyId`

#### Parameters

The getCompliancePolicy api has got 1 parameter

| Parameter          | Type | Required | Population                         |
| ------------------ | ---- | -------- | ---------------------------------- |
| compliancePolicyId | ID   | true     | request.params?.compliancePolicyId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /compliancepolicies/:compliancePolicyId**

```js
axios({
  method: "GET",
  url: `/compliancepolicies/${compliancePolicyId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`compliancePolicy`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "compliancePolicy",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "compliancePolicy": { "id": "ID", "isActive": true }
}
```

### Route: createCompliancePolicy

_Route Definition_ : Create sitewide compliance policy config (should be only one).

_Route Type_ : create

_Default access route_ : _POST_ `/compliancepolicies`

#### Parameters

The createCompliancePolicy api has got 3 parameters

| Parameter         | Type    | Required | Population                      |
| ----------------- | ------- | -------- | ------------------------------- |
| minAge            | Integer | true     | request.body?.minAge            |
| gdprExportEnabled | Boolean | true     | request.body?.gdprExportEnabled |
| gdprDeleteEnabled | Boolean | true     | request.body?.gdprDeleteEnabled |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **POST /compliancepolicies**

```js
axios({
  method: "POST",
  url: "/compliancepolicies",
  data: {
    minAge: "Integer",
    gdprExportEnabled: "Boolean",
    gdprDeleteEnabled: "Boolean",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`compliancePolicy`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "compliancePolicy",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "compliancePolicy": { "id": "ID", "isActive": true }
}
```

### Route: updateCompliancePolicy

_Route Definition_ : Update sitewide compliance policy config.

_Route Type_ : update

_Default access route_ : _PATCH_ `/compliancepolicies/:compliancePolicyId`

#### Parameters

The updateCompliancePolicy api has got 4 parameters

| Parameter          | Type    | Required | Population                         |
| ------------------ | ------- | -------- | ---------------------------------- |
| compliancePolicyId | ID      | true     | request.params?.compliancePolicyId |
| minAge             | Integer | true     | request.body?.minAge               |
| gdprExportEnabled  | Boolean | true     | request.body?.gdprExportEnabled    |
| gdprDeleteEnabled  | Boolean | true     | request.body?.gdprDeleteEnabled    |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **PATCH /compliancepolicies/:compliancePolicyId**

```js
axios({
  method: "PATCH",
  url: `/compliancepolicies/${compliancePolicyId}`,
  data: {
    minAge: "Integer",
    gdprExportEnabled: "Boolean",
    gdprDeleteEnabled: "Boolean",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`compliancePolicy`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "compliancePolicy",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "compliancePolicy": { "id": "ID", "isActive": true }
}
```

### Route: deleteCompliancePolicy

_Route Definition_ : Delete compliance policy config if ever needed.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/compliancepolicies/:compliancePolicyId`

#### Parameters

The deleteCompliancePolicy api has got 1 parameter

| Parameter          | Type | Required | Population                         |
| ------------------ | ---- | -------- | ---------------------------------- |
| compliancePolicyId | ID   | true     | request.params?.compliancePolicyId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **DELETE /compliancepolicies/:compliancePolicyId**

```js
axios({
  method: "DELETE",
  url: `/compliancepolicies/${compliancePolicyId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`compliancePolicy`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "compliancePolicy",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "compliancePolicy": { "id": "ID", "isActive": false }
}
```

### Route: listCompliancePolicies

_Route Definition_ : List compliance policy configs (should only be one active).

_Route Type_ : getList

_Default access route_ : _GET_ `/compliancepolicies`

The listCompliancePolicies api has got no parameters.

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /compliancepolicies**

```js
axios({
  method: "GET",
  url: "/compliancepolicies",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`compliancePolicies`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "compliancePolicies",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "compliancePolicies": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getGlobalUserRestriction

_Route Definition_ : Get global user restriction record by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/globaluserrestrictions/:globalUserRestrictionId`

#### Parameters

The getGlobalUserRestriction api has got 1 parameter

| Parameter               | Type | Required | Population                              |
| ----------------------- | ---- | -------- | --------------------------------------- |
| globalUserRestrictionId | ID   | true     | request.params?.globalUserRestrictionId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /globaluserrestrictions/:globalUserRestrictionId**

```js
axios({
  method: "GET",
  url: `/globaluserrestrictions/${globalUserRestrictionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`globalUserRestriction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "globalUserRestriction",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "globalUserRestriction": { "id": "ID", "isActive": true }
}
```

### Route: createGlobalUserRestriction

_Route Definition_ : Create a global user restriction (ban/suspend/shadowban).

_Route Type_ : create

_Default access route_ : _POST_ `/globaluserrestrictions`

#### Parameters

The createGlobalUserRestriction api has got 7 parameters

| Parameter       | Type   | Required | Population                    |
| --------------- | ------ | -------- | ----------------------------- |
| userId          | ID     | true     | request.body?.userId          |
| restrictionType | Enum   | true     | request.body?.restrictionType |
| status          | Enum   | true     | request.body?.status          |
| startDate       | Date   | false    | request.body?.startDate       |
| endDate         | Date   | false    | request.body?.endDate         |
| reason          | String | false    | request.body?.reason          |
| adminId         | ID     | false    | request.body?.adminId         |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **POST /globaluserrestrictions**

```js
axios({
  method: "POST",
  url: "/globaluserrestrictions",
  data: {
    userId: "ID",
    restrictionType: "Enum",
    status: "Enum",
    startDate: "Date",
    endDate: "Date",
    reason: "String",
    adminId: "ID",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`globalUserRestriction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "globalUserRestriction",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "globalUserRestriction": { "id": "ID", "isActive": true }
}
```

### Route: updateGlobalUserRestriction

_Route Definition_ : Update a global user restriction (status, dates, notes).

_Route Type_ : update

_Default access route_ : _PATCH_ `/globaluserrestrictions/:globalUserRestrictionId`

#### Parameters

The updateGlobalUserRestriction api has got 7 parameters

| Parameter               | Type   | Required | Population                              |
| ----------------------- | ------ | -------- | --------------------------------------- |
| globalUserRestrictionId | ID     | true     | request.params?.globalUserRestrictionId |
| restrictionType         | Enum   | false    | request.body?.restrictionType           |
| status                  | Enum   | false    | request.body?.status                    |
| startDate               | Date   | false    | request.body?.startDate                 |
| endDate                 | Date   | false    | request.body?.endDate                   |
| reason                  | String | false    | request.body?.reason                    |
| adminId                 | ID     | false    | request.body?.adminId                   |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **PATCH /globaluserrestrictions/:globalUserRestrictionId**

```js
axios({
  method: "PATCH",
  url: `/globaluserrestrictions/${globalUserRestrictionId}`,
  data: {
    restrictionType: "Enum",
    status: "Enum",
    startDate: "Date",
    endDate: "Date",
    reason: "String",
    adminId: "ID",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`globalUserRestriction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "globalUserRestriction",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "globalUserRestriction": { "id": "ID", "isActive": true }
}
```

### Route: deleteGlobalUserRestriction

_Route Definition_ : Delete a global user restriction record.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/globaluserrestrictions/:globalUserRestrictionId`

#### Parameters

The deleteGlobalUserRestriction api has got 1 parameter

| Parameter               | Type | Required | Population                              |
| ----------------------- | ---- | -------- | --------------------------------------- |
| globalUserRestrictionId | ID   | true     | request.params?.globalUserRestrictionId |

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **DELETE /globaluserrestrictions/:globalUserRestrictionId**

```js
axios({
  method: "DELETE",
  url: `/globaluserrestrictions/${globalUserRestrictionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`globalUserRestriction`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "globalUserRestriction",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "globalUserRestriction": { "id": "ID", "isActive": false }
}
```

### Route: listGlobalUserRestrictions

_Route Definition_ : List all global user restrictions (with filters).

_Route Type_ : getList

_Default access route_ : _GET_ `/globaluserrestrictions`

The listGlobalUserRestrictions api has got no parameters.

To access the route the session should validated across these validations.

```js
/* 
Validation Check: Check if the logged in user has [admin] roles
This validation will be executed on layer1
*/
if (!this.userHasRole(this.ROLES.admin)) {
  throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
}
```

To access the api you can use the **REST** controller with the path **GET /globaluserrestrictions**

```js
axios({
  method: "GET",
  url: "/globaluserrestrictions",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`globalUserRestrictions`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "globalUserRestrictions",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "globalUserRestrictions": [{ "id": "ID", "isActive": true }, {}, {}],
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
