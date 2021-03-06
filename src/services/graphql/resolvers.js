const mockService = {
  find: () => ([{_id: 0}])
}

const sanitize = input => (
  input
    .replace("fuck", "****")
    .replace("putang", "******")
    .replace("ina mo", "*** **")
)

export default function Resolvers() {
  const app = this

  const Posts = app.service("debug")

  const userArray = [{
    _id: 0,
    username: "phoomparin",
    firstName: "Phoomparin",
    lastName: "Mano"
  }]
  const Users = {

    find: () => (userArray),
    get: data => (userArray[0]),
    create: data => ({_id: 0, ...data})
  }

  const commentArray = [{
    _id: 0,
    content: "Ayyyyyyyyyyyyyyyyyyyyyy Lmaooooooooooooooo"
  }]

  const Comments = {
    find: () => (commentArray),
    get: () => (commentArray[0])
  }

  const Viewer = mockService

  return {
    User: {
      posts(user, args, context) {
        return Posts.find({
          query: {
            authorId: user._id
          }
        })
      }
    },
    Post: {
      comments(post, {limit}, context) {
        return Comments.find({
          query: {
            postId: post._id
          }
        })
      },
      author(post, args, context) {
        return Users.get(post.authorId)
      }
    },
    Comment: {
      author(comment, args, context) {
        return Users.get(comment.authorId)
      }
    },
    AuthPayload: {
      data(auth, args, context) {
        return auth.data
      }
    },
    RootQuery: {
      viewer(root, args, context) {
        return Viewer.find(context)
      },
      author(root, {username}, context) {
        return Users.find({
          query: {
            username
          }
        }).then(users => users[0])
      },
      authors(root, args, context) {
        return Users.find({})
      },
      posts(root, {category}, context) {
        return Posts.find({
          query: {
            category
          }
        })
      },
      post(root, {_id}, context) {
        return Posts.get(_id)
      }
    },

    RootMutation: {
      signUp(root, args, context) {
        return Users.create(args)
      },
      logIn(root, {username, password}, context) {
        return {token: Math.random().toString(36).replace(/[^a-z]+/g, "")}
      },
      createPost(root, {post}, context) {
        return Posts.create(post, context)
      },
      createComment(root, args, context) {
        return Comments.create(args, context)
      },
      removePost(root, {_id}, context) {
        return Posts.remove(_id, context)
      },
      removeComment(root, {_id}, context) {
        return Comments.remove(_id, context)
      }
    }

  }
}
