export const storyQuery=`
    type Mutation {
        createStory(story: storyInput) : Story
        deleteStory(id:ID) : ID,
        viewStory(storyid : ID):Story
    }
`