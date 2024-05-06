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
    likes: [Like]
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

`