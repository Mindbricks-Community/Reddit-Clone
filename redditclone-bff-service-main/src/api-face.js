const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - bff",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "bff",
    },
    auth: {
      url: authUrl,
      loginPath: "/login",
      logoutPath: "/logout",
      currentUserPath: "/currentuser",
      authStrategy: "external",
      initialAuth: true,
    },
    dataObjects: [
      {
        name: "Dynamic All Index",
        description: "Dynamic All Index for all elasticsearch index",
        reference: {
          tableName: "Dynamic All Index",
          properties: [],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/allIndices",
            title: "All Indices",
            query: [],
            body: {},
            parameters: [],
            headers: [],
          },
          {
            isAuth: false,
            method: "POST",
            url: "/{indexName}/list",
            title: "List",
            query: [
              {
                key: "page",
                value: "1",
                description: "Page number",
                active: true,
              },
              {
                key: "limit",
                value: "10",
                description: "Limit number",
                active: true,
              },
              {
                key: "sortBy",
                value: "createdAt",
                description: "Sort by",
                active: true,
              },
              {
                key: "sortOrder",
                value: "desc",
                description: "Sort order",
                active: true,
              },
              {
                key: "q",
                value: "",
                description: "Search",
                active: false,
              },
            ],
            body: {
              type: "json",
              content: {
                field: {
                  //operator types: match, eq, noteq, range, exists, missing, prefix, wildcard, regexp, match_phrase, match_phrase_prefix
                  operator: "eq",
                  value: "string",
                  //if operator is range, values: [min, max]
                },
              },
            },
            parameters: [
              {
                key: "indexName",
                value: "string",
                description: "Index Name",
              },
            ],
            headers: [],
          },
          {
            isAuth: false,
            method: "GET",
            url: "/{indexName}/list",
            title: "List",
            query: [
              {
                key: "page",
                value: "1",
                description: "Page number",
                active: true,
              },
              {
                key: "limit",
                value: "10",
                description: "Limit number",
                active: true,
              },
              {
                key: "sortBy",
                value: "createdAt",
                description: "Sort by",
                active: true,
              },
              {
                key: "sortOrder",
                value: "desc",
                description: "Sort order",
                active: true,
              },
              {
                key: "q",
                value: "",
                description: "Search",
                active: false,
              },
            ],
            body: {},
            parameters: [
              {
                key: "indexName",
                value: "string",
                description: "Index Name",
              },
            ],
            headers: [],
          },
          {
            isAuth: false,
            method: "POST",
            url: "/{indexName}/count",
            title: "Count",
            query: [
              {
                key: "q",
                value: "",
                description: "Search",
                active: false,
              },
            ],
            body: {
              type: "json",
              content: {
                field: {
                  //operator types: match, eq, noteq, range, exists, missing, prefix, wildcard, regexp, match_phrase, match_phrase_prefix
                  operator: "eq",
                  value: "string",
                  //if operator is range, values: [min, max]
                },
              },
            },
            parameters: [
              {
                key: "indexName",
                value: "string",
                description: "Index Name",
              },
            ],
            headers: [],
          },
          {
            isAuth: false,
            method: "GET",
            url: "/{indexName}/count",
            title: "Count",
            query: [
              {
                key: "q",
                value: "",
                description: "Search",
                active: false,
              },
            ],
            body: {},
            parameters: [
              {
                key: "indexName",
                value: "string",
                description: "Index Name",
              },
            ],
            headers: [],
          },
          {
            isAuth: false,
            method: "GET",
            url: "/{indexName}/schema",
            title: "Schema",
            query: [],
            body: {},
            parameters: [
              {
                key: "indexName",
                value: "string",
                description: "Index Name",
              },
            ],
            headers: [],
          },
          {
            isAuth: false,
            method: "GET",
            url: "/{indexName}/{id}",
            title: "Get",
            query: [],
            body: {},
            parameters: [
              {
                key: "indexName",
                value: "string",
                description: "Index Name",
              },
              {
                key: "id",
                value: "string",
                description: "Id",
              },
            ],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
