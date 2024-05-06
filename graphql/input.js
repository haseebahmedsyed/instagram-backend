export const inputs = `
input UserInput {
    fullname: String!
    username: String!
    phone: String!
    password: String!
    dob: DateTime
    profile_image: String
    bio: String
}

input postInput {
    id:ID,
    userid: Int!,
    caption: String,
    createdat: DateTime,
    file: Upload
}

input likeInput {
    id:ID,
    userid: Int!,
    postid:Int!,
    createdat: DateTime,
}

input commentInput {
    id:ID,
    userid: Int!,
    postid:Int!,
    text:String!,
    createdat: DateTime,
}
`