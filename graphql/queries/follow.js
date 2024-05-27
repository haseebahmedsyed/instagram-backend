export const followQuery =`
    type Mutation {
        follow(followerid: ID, followingid: ID) : ID
        unfollow (followerid: ID, followingid: ID) : ID
    }
`