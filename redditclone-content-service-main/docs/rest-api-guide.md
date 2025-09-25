# REST API GUIDE

## redditclone-content-service

Manages creation, editing, and deletion of posts and comments (multi-format), threaded commenting, voting, NSFW/filtering, feeds, discovery, caching, and associations with media uploads.

## Architectural Design Credit and Contact Information

The architectural design of this microservice is credited to .
For inquiries, feedback, or further information regarding the architecture, please direct your communication to:

Email:

We encourage open communication and welcome any questions or discussions related to the architectural aspects of this microservice.

## Documentation Scope

Welcome to the official documentation for the Content Service's REST API. This document is designed to provide a comprehensive guide to interfacing with our Content Service exclusively through RESTful API endpoints.

**Intended Audience**

This documentation is intended for developers and integrators who are looking to interact with the Content Service via HTTP requests for purposes such as creating, updating, deleting and querying Content objects.

**Overview**

Within these pages, you will find detailed information on how to effectively utilize the REST API, including authentication methods, request and response formats, endpoint descriptions, and examples of common use cases.

Beyond REST
It's important to note that the Content Service also supports alternative methods of interaction, such as gRPC and messaging via a Message Broker. These communication methods are beyond the scope of this document. For information regarding these protocols, please refer to their respective documentation.

## Authentication And Authorization

To ensure secure access to the Content service's protected endpoints, a project-wide access token is required. This token serves as the primary method for authenticating requests to our service. However, it's important to note that access control varies across different routes:

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

This section outlines the API endpoints available within the Content service. Each endpoint can receive parameters through various methods, meticulously described in the following definitions. It's important to understand the flexibility in how parameters can be included in requests to effectively interact with the Content service.

This service is configured to listen for HTTP requests on port `3002`,
serving both the main API interface and default administrative endpoints.

The following routes are available by default:

- **API Test Interface (API Face):** `/`
- **Swagger Documentation:** `/swagger`
- **Postman Collection Download:** `/getPostmanCollection`
- **Health Checks:** `/health` and `/admin/health`
- **Current Session Info:** `/currentuser`
- **Favicon:** `/favicon.ico`

This service is accessible via the following environment-specific URLs:

- **Preview:** `https://content-api-redditclone.prw.mindbricks.com`
- **Staging:** `https://content-api-redditclone.staging.mindbricks.com`
- **Production:** `https://content-api-redditclone.prod.mindbricks.com`

**Parameter Inclusion Methods:**
Parameters can be incorporated into API requests in several ways, each with its designated location. Understanding these methods is crucial for correctly constructing your requests:

**Query Parameters:** Included directly in the URL's query string.

**Path Parameters:** Embedded within the URL's path.

**Body Parameters:** Sent within the JSON body of the request.

**Session Parameters:** Automatically read from the session object. This method is used for parameters that are intrinsic to the user's session, such as userId. When using an API that involves session parameters, you can omit these from your request. The service will automatically bind them to the route, provided that a session is associated with your request.

**Note on Session Parameters:**
Session parameters represent a unique method of parameter inclusion, relying on the context of the user's session. A common example of a session parameter is userId, which the service automatically associates with your request when a session exists. This feature ensures seamless integration of user-specific data without manual input for each request.

By adhering to the specified parameter inclusion methods, you can effectively utilize the Content service's API endpoints. For detailed information on each endpoint, including required parameters and their accepted locations, refer to the individual API definitions below.

### Common Parameters

The `Content` service's routes support several common parameters designed to modify and enhance the behavior of API requests. These parameters are not individually listed in the API route definitions to avoid repetition. Instead, refer to this section to understand how to leverage these common behaviors across different routes. Note that all common parameters should be included in the query part of the URL.

### Supported Common Parameters:

- **getJoins (BOOLEAN)**: Controls whether to retrieve associated objects along with the main object. By default, `getJoins` is assumed to be `true`. Set it to `false` if you prefer to receive only the main fields of an object, excluding its associations.

- **excludeCQRS (BOOLEAN)**: Applicable only when `getJoins` is `true`. By default, `excludeCQRS` is set to `false`. Enabling this parameter (`true`) omits non-local associations, which are typically more resource-intensive as they require querying external services like ElasticSearch for additional information. Use this to optimize response times and resource usage.

- **requestId (String)**: Identifies a request to enable tracking through the service's log chain. A random hex string of 32 characters is assigned by default. If you wish to use a custom `requestId`, simply include it in your query parameters.

- **caching (BOOLEAN)**: Determines the use of caching for query routes. By default, caching is enabled (`true`). To ensure the freshest data directly from the database, set this parameter to `false`, bypassing the cache.

- **cacheTTL (Integer)**: Specifies the Time-To-Live (TTL) for query caching, in seconds. This is particularly useful for adjusting the default caching duration (5 minutes) for `get list` queries. Setting a custom `cacheTTL` allows you to fine-tune the cache lifespan to meet your needs.

- **pageNumber (Integer)**: For paginated `get list` routes, this parameter selects which page of results to retrieve. The default is `1`, indicating the first page. To disable pagination and retrieve all results, set `pageNumber` to `0`.

- **pageRowCount (Integer)**: In conjunction with paginated routes, this parameter defines the number of records per page. The default value is `25`. Adjusting `pageRowCount` allows you to control the volume of data returned in a single request.

By utilizing these common parameters, you can tailor the behavior of API requests to suit your specific requirements, ensuring optimal performance and usability of the `Content` service.

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

When the `Content` service processes requests successfully, it wraps the requested resource(s) within a JSON envelope. This envelope not only contains the data but also includes essential metadata, such as configuration details and pagination information, to enrich the response and provide context to the client.

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

Content service provides the following resources which are stored in its own database as a data object. Note that a resource for an api access is a data object for the service.

### Post resource

_Resource Definition_ : A user-created content submission to a community. Supports formats: text, link, image, video, gallery, poll. Includes metadata, status, voting tallies, filtering, and media references.
_Post Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **communityId** | ID | | | _Community to which the post belongs._ |
| **userId** | ID | | | _User who created this post._ |
| **title** | String | | | _Title of the post. Required except for image/gallery-only posts._ |
| **bodyText** | Text | | | _Text content of the post. Required for text posts; optional for others._ |
| **externalUrl** | String | | | _Target URL for link posts (YouTube, news, etc)._ |
| **postType** | Enum | | | _Type of post: text, link, image, video, gallery, poll._ |
| **status** | Enum | | | _Post status: active (0), deleted (1), locked (2), removed(3)._ |
| **isNsfw** | Boolean | | | _Whether the post is marked NSFW._ |
| **upVotes** | Integer | | | _Cached number of upvotes for the post._ |
| **downVotes** | Integer | | | _Cached number of downvotes for the post._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### postType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **text** | `"text""` | 0 |
| **link** | `"link""` | 1 |
| **image** | `"image""` | 2 |
| **video** | `"video""` | 3 |
| **gallery** | `"gallery""` | 4 |
| **poll** | `"poll""` | 5 |

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **active** | `"active""` | 0 |
| **deleted** | `"deleted""` | 1 |
| **locked** | `"locked""` | 2 |
| **removed** | `"removed""` | 3 |

### Comment resource

_Resource Definition_ : A comment or threaded reply on a post. Supports parent-child replies (threading), text, voting, nsfw, deleted/removed status.
_Comment Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **postId** | ID | | | _Parent post to which this comment belongs._ |
| **userId** | ID | | | _User who wrote this comment._ |
| **parentCommentId** | ID | | | _Parent comment for threaded replies. Null if top-level comment._ |
| **threadPath** | String | | | _Path string representing the threaded ancestry of this comment (for efficient thread queries)._ |
| **bodyText** | Text | | | _Content of the comment._ |
| **status** | Enum | | | _Comment status: active(0), deleted(1), removed(2)._ |
| **isNsfw** | Boolean | | | _Mark comment as NSFW._ |
| **upVotes** | Integer | | | _Cached upvote count for the comment._ |
| **downVotes** | Integer | | | _Cached downvote count for the comment._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### status Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **active** | `"active""` | 0 |
| **deleted** | `"deleted""` | 1 |
| **removed** | `"removed""` | 2 |

### Vote resource

_Resource Definition_ : Tracks upvote/downvote by user on a post or a comment. Used to prevent duplicate voting and aggregate score.
_Vote Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **userId** | ID | | | _User who cast the vote._ |
| **postId** | ID | | | _Post that receives the vote (nullable if for comment)._ |
| **commentId** | ID | | | _Comment that receives the vote (nullable if for post)._ |
| **voteType** | Enum | | | _Direction/type of the vote. 0=none (neutral), 1=upvote, 2=downvote._ |

#### Enum Properties

Enum properties are represented as Small Integer values (0-255) in the database. The values are mapped to their corresponding names in the application layer.

##### voteType Enum Property

_Enum Options_
| Name | Value | Index |
| ---- | ----- | ----- |
| **none** | `"none""` | 0 |
| **upvote** | `"upvote""` | 1 |
| **downvote** | `"downvote""` | 2 |

### PollOption resource

_Resource Definition_ : Option available to vote on for a poll-type post. Each poll-type post may have multiple poll options.
_PollOption Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **postId** | ID | | | _Post (of type &#39;poll&#39;) this option belongs to._ |
| **optionIndex** | Integer | | | _Index of this poll option (0-based)._ |
| **optionText** | String | | | _Text/label for this poll option._ |
| **voteCount** | Integer | | | _Cached number of votes for this option._ |

### PostMedia resource

_Resource Definition_ : Associates media (images/videos) to a post or comment, allowing galleries and ordering. Media is owned by media service, this is the cross-ref with ordering/meta.
_PostMedia Resource Properties_
| Name | Type | Required | Default | Definition |
| ---- | ---- | -------- | ------- | ---------- |
| **mediaObjectId** | ID | | | _ID of media object stored in media service._ |
| **postId** | ID | | | _Referencing post, if any._ |
| **commentId** | ID | | | _Referencing comment, if any._ |
| **mediaIndex** | Integer | | | _Order for display in gallery/media list._ |
| **caption** | Text | | | _Optional caption/description for this media instance in the post or comment._ |

## Crud Routes

### Route: getPost

_Route Definition_ : Get a single post by its ID.

_Route Type_ : get

_Default access route_ : _GET_ `/posts/:postId`

#### Parameters

The getPost api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| postId    | ID   | true     | request.params?.postId |

To access the api you can use the **REST** controller with the path **GET /posts/:postId**

```js
axios({
  method: "GET",
  url: `/posts/${postId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`post`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "post",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "post": { "id": "ID", "isActive": true }
}
```

### Route: createPost

_Route Definition_ : Create a new post in a community.

_Route Type_ : create

_Default access route_ : _POST_ `/posts`

#### Parameters

The createPost api has got 9 parameters

| Parameter   | Type    | Required | Population                |
| ----------- | ------- | -------- | ------------------------- |
| communityId | ID      | true     | request.body?.communityId |
| title       | String  | false    | request.body?.title       |
| bodyText    | Text    | false    | request.body?.bodyText    |
| externalUrl | String  | false    | request.body?.externalUrl |
| postType    | Enum    | true     | request.body?.postType    |
| status      | Enum    | true     | request.body?.status      |
| isNsfw      | Boolean | true     | request.body?.isNsfw      |
| upVotes     | Integer | true     | request.body?.upVotes     |
| downVotes   | Integer | true     | request.body?.downVotes   |

To access the api you can use the **REST** controller with the path **POST /posts**

```js
axios({
  method: "POST",
  url: "/posts",
  data: {
    communityId: "ID",
    title: "String",
    bodyText: "Text",
    externalUrl: "String",
    postType: "Enum",
    status: "Enum",
    isNsfw: "Boolean",
    upVotes: "Integer",
    downVotes: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`post`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "post",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "post": { "id": "ID", "isActive": true }
}
```

### Route: updatePost

_Route Definition_ : Edit an existing post (if author or moderator).

_Route Type_ : update

_Default access route_ : _PATCH_ `/posts/:postId`

#### Parameters

The updatePost api has got 7 parameters

| Parameter   | Type    | Required | Population                |
| ----------- | ------- | -------- | ------------------------- |
| postId      | ID      | true     | request.params?.postId    |
| title       | String  | false    | request.body?.title       |
| bodyText    | Text    | false    | request.body?.bodyText    |
| externalUrl | String  | false    | request.body?.externalUrl |
| postType    | Enum    | false    | request.body?.postType    |
| status      | Enum    | false    | request.body?.status      |
| isNsfw      | Boolean | false    | request.body?.isNsfw      |

To access the api you can use the **REST** controller with the path **PATCH /posts/:postId**

```js
axios({
  method: "PATCH",
  url: `/posts/${postId}`,
  data: {
    title: "String",
    bodyText: "Text",
    externalUrl: "String",
    postType: "Enum",
    status: "Enum",
    isNsfw: "Boolean",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`post`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "post",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "post": { "id": "ID", "isActive": true }
}
```

### Route: deletePost

_Route Definition_ : Delete a post (by author or moderator, marks as deleted/removed).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/posts/:postId`

#### Parameters

The deletePost api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| postId    | ID   | true     | request.params?.postId |

To access the api you can use the **REST** controller with the path **DELETE /posts/:postId**

```js
axios({
  method: "DELETE",
  url: `/posts/${postId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`post`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "post",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "post": { "id": "ID", "isActive": false }
}
```

### Route: listPosts

_Route Definition_ : Browse, search, or filter posts for feeds/discovery.

_Route Type_ : getList

_Default access route_ : _GET_ `/posts`

The listPosts api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /posts**

```js
axios({
  method: "GET",
  url: "/posts",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`posts`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "posts",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "posts": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getComment

_Route Definition_ : Get a single comment by its ID.

_Route Type_ : get

_Default access route_ : _GET_ `/comments/:commentId`

#### Parameters

The getComment api has got 1 parameter

| Parameter | Type | Required | Population                |
| --------- | ---- | -------- | ------------------------- |
| commentId | ID   | true     | request.params?.commentId |

To access the api you can use the **REST** controller with the path **GET /comments/:commentId**

```js
axios({
  method: "GET",
  url: `/comments/${commentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`comment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "comment",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "comment": { "id": "ID", "isActive": true }
}
```

### Route: createComment

_Route Definition_ : Create a comment on a post or as a reply.

_Route Type_ : create

_Default access route_ : _POST_ `/comments`

#### Parameters

The createComment api has got 8 parameters

| Parameter       | Type    | Required | Population                    |
| --------------- | ------- | -------- | ----------------------------- |
| postId          | ID      | true     | request.body?.postId          |
| parentCommentId | ID      | false    | request.body?.parentCommentId |
| threadPath      | String  | false    | request.body?.threadPath      |
| bodyText        | Text    | true     | request.body?.bodyText        |
| status          | Enum    | true     | request.body?.status          |
| isNsfw          | Boolean | true     | request.body?.isNsfw          |
| upVotes         | Integer | true     | request.body?.upVotes         |
| downVotes       | Integer | true     | request.body?.downVotes       |

To access the api you can use the **REST** controller with the path **POST /comments**

```js
axios({
  method: "POST",
  url: "/comments",
  data: {
    postId: "ID",
    parentCommentId: "ID",
    threadPath: "String",
    bodyText: "Text",
    status: "Enum",
    isNsfw: "Boolean",
    upVotes: "Integer",
    downVotes: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`comment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "comment",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "comment": { "id": "ID", "isActive": true }
}
```

### Route: updateComment

_Route Definition_ : Edit an existing comment (if author or moderator).

_Route Type_ : update

_Default access route_ : _PATCH_ `/comments/:commentId`

#### Parameters

The updateComment api has got 6 parameters

| Parameter       | Type    | Required | Population                    |
| --------------- | ------- | -------- | ----------------------------- |
| commentId       | ID      | true     | request.params?.commentId     |
| parentCommentId | ID      | false    | request.body?.parentCommentId |
| threadPath      | String  | false    | request.body?.threadPath      |
| bodyText        | Text    | true     | request.body?.bodyText        |
| status          | Enum    | false    | request.body?.status          |
| isNsfw          | Boolean | false    | request.body?.isNsfw          |

To access the api you can use the **REST** controller with the path **PATCH /comments/:commentId**

```js
axios({
  method: "PATCH",
  url: `/comments/${commentId}`,
  data: {
    parentCommentId: "ID",
    threadPath: "String",
    bodyText: "Text",
    status: "Enum",
    isNsfw: "Boolean",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`comment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "comment",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "comment": { "id": "ID", "isActive": true }
}
```

### Route: deleteComment

_Route Definition_ : Delete a comment (by author or moderator).

_Route Type_ : delete

_Default access route_ : _DELETE_ `/comments/:commentId`

#### Parameters

The deleteComment api has got 1 parameter

| Parameter | Type | Required | Population                |
| --------- | ---- | -------- | ------------------------- |
| commentId | ID   | true     | request.params?.commentId |

To access the api you can use the **REST** controller with the path **DELETE /comments/:commentId**

```js
axios({
  method: "DELETE",
  url: `/comments/${commentId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`comment`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "comment",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "comment": { "id": "ID", "isActive": false }
}
```

### Route: listComments

_Route Definition_ : Get comments for a post, or threaded replies for a comment.

_Route Type_ : getList

_Default access route_ : _GET_ `/comments`

The listComments api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /comments**

```js
axios({
  method: "GET",
  url: "/comments",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`comments`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "comments",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "comments": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getVote

_Route Definition_ : Get a single vote (by ID) for admin/debug.

_Route Type_ : get

_Default access route_ : _GET_ `/votes/:voteId`

#### Parameters

The getVote api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| voteId    | ID   | true     | request.params?.voteId |

To access the api you can use the **REST** controller with the path **GET /votes/:voteId**

```js
axios({
  method: "GET",
  url: `/votes/${voteId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`vote`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "vote",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "vote": { "id": "ID", "isActive": true }
}
```

### Route: createVote

_Route Definition_ : Cast a vote on a post or comment.

_Route Type_ : create

_Default access route_ : _POST_ `/votes`

#### Parameters

The createVote api has got 3 parameters

| Parameter | Type | Required | Population              |
| --------- | ---- | -------- | ----------------------- |
| postId    | ID   | false    | request.body?.postId    |
| commentId | ID   | false    | request.body?.commentId |
| voteType  | Enum | true     | request.body?.voteType  |

To access the api you can use the **REST** controller with the path **POST /votes**

```js
axios({
  method: "POST",
  url: "/votes",
  data: {
    postId: "ID",
    commentId: "ID",
    voteType: "Enum",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`vote`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "vote",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "vote": { "id": "ID", "isActive": true }
}
```

### Route: updateVote

_Route Definition_ : Change a prior vote (e.g. undo or switch).

_Route Type_ : update

_Default access route_ : _PATCH_ `/votes/:voteId`

#### Parameters

The updateVote api has got 2 parameters

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| voteId    | ID   | true     | request.params?.voteId |
| voteType  | Enum | false    | request.body?.voteType |

To access the api you can use the **REST** controller with the path **PATCH /votes/:voteId**

```js
axios({
  method: "PATCH",
  url: `/votes/${voteId}`,
  data: {
    voteType: "Enum",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`vote`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "vote",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "vote": { "id": "ID", "isActive": true }
}
```

### Route: deleteVote

_Route Definition_ : Remove a vote for undoing engagement.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/votes/:voteId`

#### Parameters

The deleteVote api has got 1 parameter

| Parameter | Type | Required | Population             |
| --------- | ---- | -------- | ---------------------- |
| voteId    | ID   | true     | request.params?.voteId |

To access the api you can use the **REST** controller with the path **DELETE /votes/:voteId**

```js
axios({
  method: "DELETE",
  url: `/votes/${voteId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`vote`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "vote",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "vote": { "id": "ID", "isActive": false }
}
```

### Route: listVotes

_Route Definition_ : List votes for a given post, comment, or user (admin/debug/stats).

_Route Type_ : getList

_Default access route_ : _GET_ `/votes`

The listVotes api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /votes**

```js
axios({
  method: "GET",
  url: "/votes",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`votes`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "votes",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "votes": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getPollOption

_Route Definition_ : Get a single poll option (by ID).

_Route Type_ : get

_Default access route_ : _GET_ `/polloptions/:pollOptionId`

#### Parameters

The getPollOption api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| pollOptionId | ID   | true     | request.params?.pollOptionId |

To access the api you can use the **REST** controller with the path **GET /polloptions/:pollOptionId**

```js
axios({
  method: "GET",
  url: `/polloptions/${pollOptionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`pollOption`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "pollOption",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "pollOption": { "id": "ID", "isActive": true }
}
```

### Route: createPollOption

_Route Definition_ : Add a poll option to a poll-type post.

_Route Type_ : create

_Default access route_ : _POST_ `/polloptions`

#### Parameters

The createPollOption api has got 4 parameters

| Parameter   | Type    | Required | Population                |
| ----------- | ------- | -------- | ------------------------- |
| postId      | ID      | true     | request.body?.postId      |
| optionIndex | Integer | true     | request.body?.optionIndex |
| optionText  | String  | true     | request.body?.optionText  |
| voteCount   | Integer | true     | request.body?.voteCount   |

To access the api you can use the **REST** controller with the path **POST /polloptions**

```js
axios({
  method: "POST",
  url: "/polloptions",
  data: {
    postId: "ID",
    optionIndex: "Integer",
    optionText: "String",
    voteCount: "Integer",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`pollOption`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "pollOption",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "pollOption": { "id": "ID", "isActive": true }
}
```

### Route: updatePollOption

_Route Definition_ : Edit a poll option (label only).

_Route Type_ : update

_Default access route_ : _PATCH_ `/polloptions/:pollOptionId`

#### Parameters

The updatePollOption api has got 3 parameters

| Parameter    | Type    | Required | Population                   |
| ------------ | ------- | -------- | ---------------------------- |
| pollOptionId | ID      | true     | request.params?.pollOptionId |
| optionIndex  | Integer | false    | request.body?.optionIndex    |
| optionText   | String  | true     | request.body?.optionText     |

To access the api you can use the **REST** controller with the path **PATCH /polloptions/:pollOptionId**

```js
axios({
  method: "PATCH",
  url: `/polloptions/${pollOptionId}`,
  data: {
    optionIndex: "Integer",
    optionText: "String",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`pollOption`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "pollOption",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "pollOption": { "id": "ID", "isActive": true }
}
```

### Route: deletePollOption

_Route Definition_ : Delete a poll option.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/polloptions/:pollOptionId`

#### Parameters

The deletePollOption api has got 1 parameter

| Parameter    | Type | Required | Population                   |
| ------------ | ---- | -------- | ---------------------------- |
| pollOptionId | ID   | true     | request.params?.pollOptionId |

To access the api you can use the **REST** controller with the path **DELETE /polloptions/:pollOptionId**

```js
axios({
  method: "DELETE",
  url: `/polloptions/${pollOptionId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`pollOption`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "pollOption",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "pollOption": { "id": "ID", "isActive": false }
}
```

### Route: listPollOptions

_Route Definition_ : List poll options for a poll post.

_Route Type_ : getList

_Default access route_ : _GET_ `/polloptions`

The listPollOptions api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /polloptions**

```js
axios({
  method: "GET",
  url: "/polloptions",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`pollOptions`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "pollOptions",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "pollOptions": [{ "id": "ID", "isActive": true }, {}, {}],
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

### Route: getPostMedia

_Route Definition_ : Get a specific postMedia association.

_Route Type_ : get

_Default access route_ : _GET_ `/postmedias/:postMediaId`

#### Parameters

The getPostMedia api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| postMediaId | ID   | true     | request.params?.postMediaId |

To access the api you can use the **REST** controller with the path **GET /postmedias/:postMediaId**

```js
axios({
  method: "GET",
  url: `/postmedias/${postMediaId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`postMedia`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "postMedia",
  "action": "get",
  "appVersion": "Version",
  "rowCount": 1,
  "postMedia": { "id": "ID", "isActive": true }
}
```

### Route: addPostMedia

_Route Definition_ : Associate a media object to a post or comment (as part of upload).

_Route Type_ : create

_Default access route_ : _POST_ `/addpostmedia`

#### Parameters

The addPostMedia api has got 5 parameters

| Parameter     | Type    | Required | Population                  |
| ------------- | ------- | -------- | --------------------------- |
| mediaObjectId | ID      | true     | request.body?.mediaObjectId |
| postId        | ID      | false    | request.body?.postId        |
| commentId     | ID      | false    | request.body?.commentId     |
| mediaIndex    | Integer | true     | request.body?.mediaIndex    |
| caption       | Text    | false    | request.body?.caption       |

To access the api you can use the **REST** controller with the path **POST /addpostmedia**

```js
axios({
  method: "POST",
  url: "/addpostmedia",
  data: {
    mediaObjectId: "ID",
    postId: "ID",
    commentId: "ID",
    mediaIndex: "Integer",
    caption: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`postMedia`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "postMedia",
  "action": "create",
  "appVersion": "Version",
  "rowCount": 1,
  "postMedia": { "id": "ID", "isActive": true }
}
```

### Route: updatePostMedia

_Route Definition_ : Edit a postMedia association (caption/order).

_Route Type_ : update

_Default access route_ : _PATCH_ `/postmedias/:postMediaId`

#### Parameters

The updatePostMedia api has got 3 parameters

| Parameter   | Type    | Required | Population                  |
| ----------- | ------- | -------- | --------------------------- |
| postMediaId | ID      | true     | request.params?.postMediaId |
| mediaIndex  | Integer | false    | request.body?.mediaIndex    |
| caption     | Text    | false    | request.body?.caption       |

To access the api you can use the **REST** controller with the path **PATCH /postmedias/:postMediaId**

```js
axios({
  method: "PATCH",
  url: `/postmedias/${postMediaId}`,
  data: {
    mediaIndex: "Integer",
    caption: "Text",
  },
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`postMedia`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "postMedia",
  "action": "update",
  "appVersion": "Version",
  "rowCount": 1,
  "postMedia": { "id": "ID", "isActive": true }
}
```

### Route: deletePostMedia

_Route Definition_ : Remove postMedia association.

_Route Type_ : delete

_Default access route_ : _DELETE_ `/postmedias/:postMediaId`

#### Parameters

The deletePostMedia api has got 1 parameter

| Parameter   | Type | Required | Population                  |
| ----------- | ---- | -------- | --------------------------- |
| postMediaId | ID   | true     | request.params?.postMediaId |

To access the api you can use the **REST** controller with the path **DELETE /postmedias/:postMediaId**

```js
axios({
  method: "DELETE",
  url: `/postmedias/${postMediaId}`,
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`postMedia`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "postMedia",
  "action": "delete",
  "appVersion": "Version",
  "rowCount": 1,
  "postMedia": { "id": "ID", "isActive": false }
}
```

### Route: listPostMedia

_Route Definition_ : List media objects associated to a post or comment (with ordering/captions).

_Route Type_ : getList

_Default access route_ : _GET_ `/postmedia`

The listPostMedia api has got no parameters.

To access the api you can use the **REST** controller with the path **GET /postmedia**

```js
axios({
  method: "GET",
  url: "/postmedia",
  data: {},
  params: {},
});
```

The API response is encapsulated within a JSON envelope. Successful operations return an HTTP status code of 200 for get, getlist, update, or delete requests, and 201 for create requests. Each successful response includes a `"status": "OK"` property. For error handling, refer to the "Error Response" section.

Following JSON represents the most comprehensive form of the **`postMedias`** object in the respones. However, some properties may be omitted based on the object's internal logic.

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
  "dataName": "postMedias",
  "action": "getList",
  "appVersion": "Version",
  "rowCount": "\"Number\"",
  "postMedias": [{ "id": "ID", "isActive": true }, {}, {}],
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
