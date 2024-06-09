export const types = `
type User {
    id: ID!
    fullname: String!
    username: String!
    phone: String!
    password: String!
    dob: DateTime
    profile_image: String
    bio: String
}

type Post {
    id:ID,
    userid: Int!,
    image: String,
    caption: String,
    createdat: DateTime,
    comments : [Comment],
    likes: [Like],
    user: User
}

type Story {
    id:ID,
    userid: Int!,
    media: String,
    caption: String,
    createdat: DateTime,
    isArchieved: Boolean!
    user: User,
    viewers:[User]
}

type Comment {
    id: ID,
    userid: Int!,
    postid: Int!,
    text: String!,
    createdat: DateTime
}

type Like {
    id: ID,
    userid: Int!,
    postid: Int!,
    createdat: DateTime
}

type UserProfileAndFeeds {
    user: User,
    feed: [Post],
    stories: [Story]
}

type storyViews{
    id:ID,
    storyid:ID,
    viewerid:ID
}

type Message{
    id: ID,
    sender: ID!,
    reciever: ID!,
    content: String,
    createdat: DateTime ,
    seen: Boolean,
    seenat: DateTime
}
`