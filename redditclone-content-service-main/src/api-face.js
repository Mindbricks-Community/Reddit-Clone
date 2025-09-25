const { inject } = require("mindbricks-api-face");

module.exports = (app) => {
  const authUrl = (process.env.SERVICE_URL ?? "mindbricks.com").replace(
    process.env.SERVICE_SHORT_NAME,
    "auth",
  );

  const config = {
    name: "redditclone - content",
    brand: {
      name: "redditclone",
      image: "https://mindbricks.com/favicon.ico",
      moduleName: "content",
      version: process.env.SERVICE_VERSION || "1.0.0",
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
        name: "Post",
        description:
          "A user-created content submission to a community. Supports formats: text, link, image, video, gallery, poll. Includes metadata, status, voting tallies, filtering, and media references.",
        reference: {
          tableName: "post",
          properties: [
            {
              name: "communityId",
              type: "ID",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "title",
              type: "String",
            },

            {
              name: "bodyText",
              type: "Text",
            },

            {
              name: "externalUrl",
              type: "String",
            },

            {
              name: "postType",
              type: "Enum",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "isNsfw",
              type: "Boolean",
            },

            {
              name: "upVotes",
              type: "Integer",
            },

            {
              name: "downVotes",
              type: "Integer",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/posts/{postId}",
            title: "getPost",
            query: [],

            parameters: [
              {
                key: "postId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/posts",
            title: "createPost",
            query: [],

            body: {
              type: "json",
              content: {
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
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/posts/{postId}",
            title: "updatePost",
            query: [],

            body: {
              type: "json",
              content: {
                title: "String",
                bodyText: "Text",
                externalUrl: "String",
                postType: "Enum",
                status: "Enum",
                isNsfw: "Boolean",
              },
            },

            parameters: [
              {
                key: "postId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/posts/{postId}",
            title: "deletePost",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "postId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/posts",
            title: "listPosts",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "Comment",
        description:
          "A comment or threaded reply on a post. Supports parent-child replies (threading), text, voting, nsfw, deleted/removed status.",
        reference: {
          tableName: "comment",
          properties: [
            {
              name: "postId",
              type: "ID",
            },

            {
              name: "userId",
              type: "ID",
            },

            {
              name: "parentCommentId",
              type: "ID",
            },

            {
              name: "threadPath",
              type: "String",
            },

            {
              name: "bodyText",
              type: "Text",
            },

            {
              name: "status",
              type: "Enum",
            },

            {
              name: "isNsfw",
              type: "Boolean",
            },

            {
              name: "upVotes",
              type: "Integer",
            },

            {
              name: "downVotes",
              type: "Integer",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/comments/{commentId}",
            title: "getComment",
            query: [],

            parameters: [
              {
                key: "commentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/comments",
            title: "createComment",
            query: [],

            body: {
              type: "json",
              content: {
                postId: "ID",
                parentCommentId: "ID",
                threadPath: "String",
                bodyText: "Text",
                status: "Enum",
                isNsfw: "Boolean",
                upVotes: "Integer",
                downVotes: "Integer",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/comments/{commentId}",
            title: "updateComment",
            query: [],

            body: {
              type: "json",
              content: {
                parentCommentId: "ID",
                threadPath: "String",
                bodyText: "Text",
                status: "Enum",
                isNsfw: "Boolean",
              },
            },

            parameters: [
              {
                key: "commentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/comments/{commentId}",
            title: "deleteComment",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "commentId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/comments",
            title: "listComments",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "Vote",
        description:
          "Tracks upvote/downvote by user on a post or a comment. Used to prevent duplicate voting and aggregate score.",
        reference: {
          tableName: "vote",
          properties: [
            {
              name: "userId",
              type: "ID",
            },

            {
              name: "postId",
              type: "ID",
            },

            {
              name: "commentId",
              type: "ID",
            },

            {
              name: "voteType",
              type: "Enum",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/votes/{voteId}",
            title: "getVote",
            query: [],

            parameters: [
              {
                key: "voteId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/votes",
            title: "createVote",
            query: [],

            body: {
              type: "json",
              content: {
                postId: "ID",
                commentId: "ID",
                voteType: "Enum",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/votes/{voteId}",
            title: "updateVote",
            query: [],

            body: {
              type: "json",
              content: {
                voteType: "Enum",
              },
            },

            parameters: [
              {
                key: "voteId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/votes/{voteId}",
            title: "deleteVote",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "voteId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "GET",
            url: "/votes",
            title: "listVotes",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "PollOption",
        description:
          "Option available to vote on for a poll-type post. Each poll-type post may have multiple poll options.",
        reference: {
          tableName: "pollOption",
          properties: [
            {
              name: "postId",
              type: "ID",
            },

            {
              name: "optionIndex",
              type: "Integer",
            },

            {
              name: "optionText",
              type: "String",
            },

            {
              name: "voteCount",
              type: "Integer",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/polloptions/{pollOptionId}",
            title: "getPollOption",
            query: [],

            parameters: [
              {
                key: "pollOptionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/polloptions",
            title: "createPollOption",
            query: [],

            body: {
              type: "json",
              content: {
                postId: "ID",
                optionIndex: "Integer",
                optionText: "String",
                voteCount: "Integer",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/polloptions/{pollOptionId}",
            title: "updatePollOption",
            query: [],

            body: {
              type: "json",
              content: {
                optionIndex: "Integer",
                optionText: "String",
              },
            },

            parameters: [
              {
                key: "pollOptionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/polloptions/{pollOptionId}",
            title: "deletePollOption",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "pollOptionId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/polloptions",
            title: "listPollOptions",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },

      {
        name: "PostMedia",
        description:
          "Associates media (images/videos) to a post or comment, allowing galleries and ordering. Media is owned by media service, this is the cross-ref with ordering/meta.",
        reference: {
          tableName: "postMedia",
          properties: [
            {
              name: "mediaObjectId",
              type: "ID",
            },

            {
              name: "postId",
              type: "ID",
            },

            {
              name: "commentId",
              type: "ID",
            },

            {
              name: "mediaIndex",
              type: "Integer",
            },

            {
              name: "caption",
              type: "Text",
            },
          ],
        },
        endpoints: [
          {
            isAuth: false,
            method: "GET",
            url: "/postmedias/{postMediaId}",
            title: "getPostMedia",
            query: [],

            parameters: [
              {
                key: "postMediaId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "POST",
            url: "/addpostmedia",
            title: "addPostMedia",
            query: [],

            body: {
              type: "json",
              content: {
                mediaObjectId: "ID",
                postId: "ID",
                commentId: "ID",
                mediaIndex: "Integer",
                caption: "Text",
              },
            },

            parameters: [],
            headers: [],
          },

          {
            isAuth: true,
            method: "PATCH",
            url: "/postmedias/{postMediaId}",
            title: "updatePostMedia",
            query: [],

            body: {
              type: "json",
              content: {
                mediaIndex: "Integer",
                caption: "Text",
              },
            },

            parameters: [
              {
                key: "postMediaId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: true,
            method: "DELETE",
            url: "/postmedias/{postMediaId}",
            title: "deletePostMedia",
            query: [],

            body: {
              type: "json",
              content: {},
            },

            parameters: [
              {
                key: "postMediaId",
                value: "",
                description: "",
              },
            ],
            headers: [],
          },

          {
            isAuth: false,
            method: "GET",
            url: "/postmedia",
            title: "listPostMedia",
            query: [],

            parameters: [],
            headers: [],
          },
        ],
      },
    ],
  };

  inject(app, config);
};
