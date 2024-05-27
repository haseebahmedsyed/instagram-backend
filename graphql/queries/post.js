export const postQuery = `
    type Query {
        getPostByUserId(userid: Int) : [Post],
        getFeedAndUserProfile : UserProfileAndFeed
    }
    type Mutation {
        uploadPost(post : postInput) : Post,
        likePost (like: likeInput) : Like,
        commentPost(comment: commentInput): Comment
    }
`