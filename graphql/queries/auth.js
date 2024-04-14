export const authQuery=`
    type Query {
        login(username:String!, password:String!) : User
    }

    type Mutation {
        signup(user : UserInput) : User
    }
`