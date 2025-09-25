# REST API GUIDE

## redditclone-community-service

Manages user-created communities, memberships, rules, settings, appearance, trending, and automod configuration.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Community Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Community Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Community Service via HTTP requests for purposes such as creating, updating, deleting and querying Community objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Community Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Community service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

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

This section outlines the API endpoints available within the Community service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Community service.

This service is configured to listen for HTTP requests on port `3001`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://community-api-redditclone.prw.mindbricks.com`
- **Staging:** `https://community-api-redditclone.staging.mindbricks.com`
- **Production:** `https://community-api-redditclone.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Community service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Community` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Community` service.

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

When the `Community` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

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

Community service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### Community resource

_Resource Definition_ : A top-level user-created group for discussions, featuring configuration for privacy, allowed post types, appearance, rules, and trending/popularity tracking.
_Community Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **name** | String | | | _Community display name (must be unique and human readable)._ |
| **slug** | String | | | _Unique identifier for URLs (e.g., r/mycommunity)._ |
| **description** | Text | | | _Detailed description of the community&#39;s purpose and content._ |
| **creatorId** | ID | | | _ID of the user who created the community._ |
| **bannerUrl** | String | | | _Banner image URL for top of the community page._ |
| **avatarUrl** | String | | | _Logo or avatar image URL of the community._ |
| **colorScheme** | String | | | _Customizable color theme (e.g., for branding the community page)._ |
| **privacyLevel** | Enum | | | _Privacy type: 0=public, 1=restricted (invite/key to post), 2=private._ |
| **isNsfw** | Boolean | | | _Indicates if the community is designated NSFW or adult._ |
| **allowedPostTypes** | Enum | | | _Allowed content types (bit-enum): 0=text, 1=link, 2=image, 3=video, 4=gallery, 5=poll._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### privacyLevel Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **public** | `"public""` | 0 |
| **restricted** | `"restricted""` | 1 |
| **private** | `"private""` | 2 |

##### allowedPostTypes Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **text** | `"text""` | 0 |
| **link** | `"link""` | 1 |
| **image** | `"image""` | 2 |
| **video** | `"video""` | 3 |
| **gallery** | `"gallery""` | 4 |
| **poll** | `"poll""` | 5 |

### CommunityMember resource

_Resource Definition_ : Tracks the user&#39;s membership/role in a community, including join status and granular role assignment (e.g., member, moderator, admin).
_CommunityMember Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Reference to the community._ |
| **userId** | ID | | | _Reference to the user._ |
| **role** | Enum | | | _Member role: 0=Member, 1=Moderator, 2=Admin (community-specific admin)._ |
| **status** | Enum | | | _Invite and join status: 0=active, 1=pending, 2=banned, 3=invite_sent, 4=removed._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### role Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **member** | `"member""` | 0 |
| **moderator** | `"moderator""` | 1 |
| **admin** | `"admin""` | 2 |

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **active** | `"active""` | 0 |
| **pending** | `"pending""` | 1 |
| **banned** | `"banned""` | 2 |
| **invite_sent** | `"invite_sent""` | 3 |
| **removed** | `"removed""` | 4 |

### CommunityRule resource

_Resource Definition_ : A rule or guideline defined by moderators of a community. Enforced by moderators and/or automod.
_CommunityRule Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Community this rule belongs to._ |
| **shortName** | String | | | _Short display name for the rule._ |
| **description** | Text | | | _Detailed explanation of the rule._ |
| **orderIndex** | Integer | | | _Ordering/priority of the rule within its community._ |

### CommunityPinned resource

_Resource Definition_ : A post, rule, or announcement pinned to the top/front of a community.
_CommunityPinned Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Community this pinned item is for._ |
| **targetType** | Enum | | | _Type of pinned item: 0=post, 1=rule, 2=announcement._ |
| **targetId** | ID | | | _ID of the post, rule, or announcement that is pinned._ |
| **orderIndex** | Integer | | | _Ordering for display among pinned items._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### targetType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **post** | `"post""` | 0 |
| **rule** | `"rule""` | 1 |
| **announcement** | `"announcement""` | 2 |

### CommunityAutomodSetting resource

_Resource Definition_ : Configurable automoderator rules and settings for each community; triggers for keyword/content/pattern-based moderation.
_CommunityAutomodSetting Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Community this automod setting applies to._ |
| **rulesData** | Object | | | _JSON-structured data for all automod rules, triggers, and config for the community._ |

## Crud Routes

### Route: getCommunity

_Route Definition_ : Fetch a single community by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/communities/:communityId`

#### Parameters

The getCommunity api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| communityId | ID   | true     | request.params?.communityId |

To access the api you can use the **REST** controller with the path **GET /communities/:communityId**

```js
axios({
  method: "GET",
  url: `/communities/${communityId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`community`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "community",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "community": { "id": "ID", "isActive": true }
}
```

### Route: createCommunity

_Route Definition_ : Create a new community.

_Route Type_ : create

_Default access route_ : _POST_ `/communities`

#### Parameters

The createCommunity api has got 6 parameters

| Parameter   | Type   | Required | Population                |
| ----------- | ------ | -------- | ------------------------- |
| name        | String | true     | request.body?.name        |
| slug        | String | true     | request.body?.slug        |
| description | Text   | true     | request.body?.description |
| bannerUrl   | String | false    | request.body?.bannerUrl   |
| avatarUrl   | String | false    | request.body?.avatarUrl   |
| colorScheme | String | false    | request.body?.colorScheme |

To access the api you can use the **REST** controller with the path **POST /communities**

```js
axios({
  method: "POST",
  url: "/communities",
  data: {
    name: "String",
    slug: "String",
    description: "Text",
    bannerUrl: "String",
    avatarUrl: "String",
    colorScheme: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`community`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "community",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "community": { "id": "ID", "isActive": true }
}
```

### Route: updateCommunity

_Route Definition_ : Update community info, appearance, privacy, allowed post types, or settings.

_Route Type_ : update

_Default access route_ : _PATCH_ `/communities/:communityId`

#### Parameters

The updateCommunity api has got 9 parameters

| Parameter        | Type    | Required | Population                     |
| ---------------- | ------- | -------- | ------------------------------ |
| communityId      | ID      | true     | request.params?.communityId    |
| name             | String  | false    | request.body?.name             |
| description      | Text    | false    | request.body?.description      |
| bannerUrl        | String  | false    | request.body?.bannerUrl        |
| avatarUrl        | String  | false    | request.body?.avatarUrl        |
| colorScheme      | String  | false    | request.body?.colorScheme      |
| privacyLevel     | Enum    | false    | request.body?.privacyLevel     |
| isNsfw           | Boolean | false    | request.body?.isNsfw           |
| allowedPostTypes | Enum    | false    | request.body?.allowedPostTypes |

To access the api you can use the **REST** controller with the path **PATCH /communities/:communityId**

```js
axios({
  method: "PATCH",
  url: `/communities/${communityId}`,
  data: {
    name: "String",
    description: "Text",
    bannerUrl: "String",
    avatarUrl: "String",
    colorScheme: "String",
    privacyLevel: "Enum",
    isNsfw: "Boolean",
    allowedPostTypes: "Enum",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`community`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "community",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "community": { "id": "ID", "isActive": true }
}
```

### Route: deleteCommunity

_Route Definition_ : Deletes a community (soft delete).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/communities/:communityId`

#### Parameters

The deleteCommunity api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| communityId | ID   | true     | request.params?.communityId |

To access the api you can use the **REST** controller with the path **DELETE /communities/:communityId**

```js
axios({
  method: "DELETE",
  url: `/communities/${communityId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`community`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "community",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "community": { "id": "ID", "isActive": false }
}
```

### Route: listCommunities

_Route Definition_ : List/search communities (with trending filters).

_Route Type_ : getList

_Default access route_ : _GET_ `/communities`

The listCommunities api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /communities**

```js
axios({
  method: "GET",
  url: "/communities",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communities`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communities",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "communities": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getCommunityMember

_Route Definition_ : Get a community member by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/communitymembers/:communityMemberId`

#### Parameters

The getCommunityMember api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| communityMemberId | ID   | true     | request.params?.communityMemberId |

To access the api you can use the **REST** controller with the path **GET /communitymembers/:communityMemberId**

```js
axios({
  method: "GET",
  url: `/communitymembers/${communityMemberId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityMember`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityMember",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "communityMember": { "id": "ID", "isActive": true }
}
```

### Route: createCommunityMember

_Route Definition_ : Create a community member entry. User joins or is invited to a community.

_Route Type_ : create

_Default access route_ : _POST_ `/communitymembers`

The createCommunityMember api has got no parameters.

To access the api you can use the **REST** controller with the path **POST /communitymembers**

```js
axios({
  method: "POST",
  url: "/communitymembers",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityMember`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityMember",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "communityMember": { "id": "ID", "isActive": true }
}
```

### Route: updateCommunityMember

_Route Definition_ : Update status or role of a community member (e.g., promote to moderator, kick/ban).

_Route Type_ : update

_Default access route_ : _PATCH_ `/communitymembers/:communityMemberId`

#### Parameters

The updateCommunityMember api has got 3 parameters

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| communityMemberId | ID   | true     | request.params?.communityMemberId |
| role              | Enum | false    | request.body?.role                |
| status            | Enum | false    | request.body?.status              |

To access the api you can use the **REST** controller with the path **PATCH /communitymembers/:communityMemberId**

```js
axios({
  method: "PATCH",
  url: `/communitymembers/${communityMemberId}`,
  data: {
    role: "Enum",
    status: "Enum",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityMember`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityMember",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "communityMember": { "id": "ID", "isActive": true }
}
```

### Route: deleteCommunityMember

_Route Definition_ : Remove a member from the community (soft delete).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/communitymembers/:communityMemberId`

#### Parameters

The deleteCommunityMember api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| communityMemberId | ID   | true     | request.params?.communityMemberId |

To access the api you can use the **REST** controller with the path **DELETE /communitymembers/:communityMemberId**

```js
axios({
  method: "DELETE",
  url: `/communitymembers/${communityMemberId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityMember`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityMember",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "communityMember": { "id": "ID", "isActive": false }
}
```

### Route: listCommunityMembers

_Route Definition_ : List the members of a community (all roles/statuses).

_Route Type_ : getList

_Default access route_ : _GET_ `/communitymembers`

The listCommunityMembers api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /communitymembers**

```js
axios({
  method: "GET",
  url: "/communitymembers",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityMembers`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityMembers",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "communityMembers": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getCommunityRule

_Route Definition_ : Retrieve a specific rule by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/communityrules/:communityRuleId`

#### Parameters

The getCommunityRule api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| communityRuleId | ID   | true     | request.params?.communityRuleId |

To access the api you can use the **REST** controller with the path **GET /communityrules/:communityRuleId**

```js
axios({
  method: "GET",
  url: `/communityrules/${communityRuleId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityRule`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityRule",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "communityRule": { "id": "ID", "isActive": true }
}
```

### Route: createCommunityRule

_Route Definition_ : Add a new rule to a community.

_Route Type_ : create

_Default access route_ : _POST_ `/communityrules`

#### Parameters

The createCommunityRule api has got 3 parameters

| Parameter   | Type    | Required | Population                |
| ----------- | ------- | -------- | ------------------------- |
| shortName   | String  | true     | request.body?.shortName   |
| description | Text    | true     | request.body?.description |
| orderIndex  | Integer | true     | request.body?.orderIndex  |

To access the api you can use the **REST** controller with the path **POST /communityrules**

```js
axios({
  method: "POST",
  url: "/communityrules",
  data: {
    shortName: "String",
    description: "Text",
    orderIndex: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityRule`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityRule",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "communityRule": { "id": "ID", "isActive": true }
}
```

### Route: updateCommunityRule

_Route Definition_ : Edit a community rule (description, name, or order).

_Route Type_ : update

_Default access route_ : _PATCH_ `/communityrules/:communityRuleId`

#### Parameters

The updateCommunityRule api has got 4 parameters

| Parameter       | Type    | Required | Population                      |
| --------------- | ------- | -------- | ------------------------------- |
| communityRuleId | ID      | true     | request.params?.communityRuleId |
| shortName       | String  | false    | request.body?.shortName         |
| description     | Text    | false    | request.body?.description       |
| orderIndex      | Integer | false    | request.body?.orderIndex        |

To access the api you can use the **REST** controller with the path **PATCH /communityrules/:communityRuleId**

```js
axios({
  method: "PATCH",
  url: `/communityrules/${communityRuleId}`,
  data: {
    shortName: "String",
    description: "Text",
    orderIndex: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityRule`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityRule",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "communityRule": { "id": "ID", "isActive": true }
}
```

### Route: deleteCommunityRule

_Route Definition_ : Delete a rule from a community.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/communityrules/:communityRuleId`

#### Parameters

The deleteCommunityRule api has got 1 parameter

| Parameter       | Type | Required | Population                      |
| --------------- | ---- | -------- | ------------------------------- |
| communityRuleId | ID   | true     | request.params?.communityRuleId |

To access the api you can use the **REST** controller with the path **DELETE /communityrules/:communityRuleId**

```js
axios({
  method: "DELETE",
  url: `/communityrules/${communityRuleId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityRule`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityRule",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "communityRule": { "id": "ID", "isActive": false }
}
```

### Route: listCommunityRules

_Route Definition_ : List all rules for a specific community.

_Route Type_ : getList

_Default access route_ : _GET_ `/communityrules`

The listCommunityRules api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /communityrules**

```js
axios({
  method: "GET",
  url: "/communityrules",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityRules`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityRules",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "communityRules": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getCommunityPinned

_Route Definition_ : Get pinned item by ID.

_Route Type_ : get

_Default access route_ : _GET_ `/communitypinneds/:communityPinnedId`

#### Parameters

The getCommunityPinned api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| communityPinnedId | ID   | true     | request.params?.communityPinnedId |

To access the api you can use the **REST** controller with the path **GET /communitypinneds/:communityPinnedId**

```js
axios({
  method: "GET",
  url: `/communitypinneds/${communityPinnedId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityPinned`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityPinned",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "communityPinned": { "id": "ID", "isActive": true }
}
```

### Route: createCommunityPinned

_Route Definition_ : Pin a post, rule, or announcement in a community.

_Route Type_ : create

_Default access route_ : _POST_ `/communitypinneds`

#### Parameters

The createCommunityPinned api has got 1 parameter

| Parameter  | Type    | Required | Population               |
| ---------- | ------- | -------- | ------------------------ |
| orderIndex | Integer | true     | request.body?.orderIndex |

To access the api you can use the **REST** controller with the path **POST /communitypinneds**

```js
axios({
  method: "POST",
  url: "/communitypinneds",
  data: {
    orderIndex: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityPinned`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityPinned",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "communityPinned": { "id": "ID", "isActive": true }
}
```

### Route: updateCommunityPinned

_Route Definition_ : Reorder or update a pinned item.

_Route Type_ : update

_Default access route_ : _PATCH_ `/communitypinneds/:communityPinnedId`

#### Parameters

The updateCommunityPinned api has got 3 parameters

| Parameter         | Type    | Required | Population                        |
| ----------------- | ------- | -------- | --------------------------------- |
| communityPinnedId | ID      | true     | request.params?.communityPinnedId |
| targetType        | Enum    | false    | request.body?.targetType          |
| orderIndex        | Integer | false    | request.body?.orderIndex          |

To access the api you can use the **REST** controller with the path **PATCH /communitypinneds/:communityPinnedId**

```js
axios({
  method: "PATCH",
  url: `/communitypinneds/${communityPinnedId}`,
  data: {
    targetType: "Enum",
    orderIndex: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityPinned`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityPinned",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "communityPinned": { "id": "ID", "isActive": true }
}
```

### Route: deleteCommunityPinned

_Route Definition_ : Remove a pinned item.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/communitypinneds/:communityPinnedId`

#### Parameters

The deleteCommunityPinned api has got 1 parameter

| Parameter         | Type | Required | Population                        |
| ----------------- | ---- | -------- | --------------------------------- |
| communityPinnedId | ID   | true     | request.params?.communityPinnedId |

To access the api you can use the **REST** controller with the path **DELETE /communitypinneds/:communityPinnedId**

```js
axios({
  method: "DELETE",
  url: `/communitypinneds/${communityPinnedId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityPinned`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityPinned",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "communityPinned": { "id": "ID", "isActive": false }
}
```

### Route: listCommunityPinned

_Route Definition_ : List all pinned items for a community.

_Route Type_ : getList

_Default access route_ : _GET_ `/communitypinned`

The listCommunityPinned api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /communitypinned**

```js
axios({
  method: "GET",
  url: "/communitypinned",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityPinneds`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityPinneds",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "communityPinneds": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getCommunityAutomodSetting

_Route Definition_ : Get automod configuration for a single community.

_Route Type_ : get

_Default access route_ : _GET_ `/communityautomodsettings/:communityAutomodSettingId`

#### Parameters

The getCommunityAutomodSetting api has got 1 parameter

| Parameter                 | Type | Required | Population                                |
| ------------------------- | ---- | -------- | ----------------------------------------- |
| communityAutomodSettingId | ID   | true     | request.params?.communityAutomodSettingId |

To access the api you can use the **REST** controller with the path **GET /communityautomodsettings/:communityAutomodSettingId**

```js
axios({
  method: "GET",
  url: `/communityautomodsettings/${communityAutomodSettingId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityAutomodSetting`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityAutomodSetting",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "communityAutomodSetting": { "id": "ID", "isActive": true }
}
```

### Route: createCommunityAutomodSetting

_Route Definition_ : Create automod rules/settings for a community.

_Route Type_ : create

_Default access route_ : _POST_ `/communityautomodsettings`

#### Parameters

The createCommunityAutomodSetting api has got 1 parameter

| Parameter | Type   | Required | Population              |
| --------- | ------ | -------- | ----------------------- |
| rulesData | Object | true     | request.body?.rulesData |

To access the api you can use the **REST** controller with the path **POST /communityautomodsettings**

```js
axios({
  method: "POST",
  url: "/communityautomodsettings",
  data: {
    rulesData: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityAutomodSetting`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityAutomodSetting",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "communityAutomodSetting": { "id": "ID", "isActive": true }
}
```

### Route: updateCommunityAutomodSetting

_Route Definition_ : Edit automod rules/settings for a community.

_Route Type_ : update

_Default access route_ : _PATCH_ `/communityautomodsettings/:communityAutomodSettingId`

#### Parameters

The updateCommunityAutomodSetting api has got 2 parameters

| Parameter                 | Type   | Required | Population                                |
| ------------------------- | ------ | -------- | ----------------------------------------- |
| communityAutomodSettingId | ID     | true     | request.params?.communityAutomodSettingId |
| rulesData                 | Object | false    | request.body?.rulesData                   |

To access the api you can use the **REST** controller with the path **PATCH /communityautomodsettings/:communityAutomodSettingId**

```js
axios({
  method: "PATCH",
  url: `/communityautomodsettings/${communityAutomodSettingId}`,
  data: {
    rulesData: "Object",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityAutomodSetting`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityAutomodSetting",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "communityAutomodSetting": { "id": "ID", "isActive": true }
}
```

### Route: deleteCommunityAutomodSetting

_Route Definition_ : Remove automod config from community.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/communityautomodsettings/:communityAutomodSettingId`

#### Parameters

The deleteCommunityAutomodSetting api has got 1 parameter

| Parameter                 | Type | Required | Population                                |
| ------------------------- | ---- | -------- | ----------------------------------------- |
| communityAutomodSettingId | ID   | true     | request.params?.communityAutomodSettingId |

To access the api you can use the **REST** controller with the path **DELETE /communityautomodsettings/:communityAutomodSettingId**

```js
axios({
  method: "DELETE",
  url: `/communityautomodsettings/${communityAutomodSettingId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityAutomodSetting`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityAutomodSetting",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "communityAutomodSetting": { "id": "ID", "isActive": false }
}
```

### Route: listCommunityAutomodSettings

_Route Definition_ : List automod configs for communities (admin, audit).

_Route Type_ : getList

_Default access route_ : _GET_ `/communityautomodsettings`

The listCommunityAutomodSettings api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /communityautomodsettings**

```js
axios({
  method: "GET",
  url: "/communityautomodsettings",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`communityAutomodSettings`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "communityAutomodSettings",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "communityAutomodSettings": [{ "id": "ID", "isActive": true }, {}, {}],
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
