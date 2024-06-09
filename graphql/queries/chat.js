export const chatQuery = `
    type Query{
        getChat(reciever:ID!):[Message]
    }

    type Mutation {
        sendMessage( message: messageInput): Message
    }

    type Subscription {
        messageSent( receiverid:ID! ) : Message
    }
`