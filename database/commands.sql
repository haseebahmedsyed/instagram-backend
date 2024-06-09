CREATE DATABASE instagram;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE,
    profile_image VARCHAR(255),
    bio VARCHAR(255)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    imageurl VARCHAR(255),
    caption VARCHAR(255),
    createdat TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(userid) REFERENCES users(id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    postid INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    createdat TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);

CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    postid INT NOT NULL,
    createdat TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (userid) REFERENCES users(id),
    FOREIGN KEY (postid) REFERENCES posts(id)
);

CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    followerid INT NOT NULL,
    followingid INT NOT NULL,
    FOREIGN KEY (followerid) REFERENCES users(id),
    FOREIGN KEY (followingid) REFERENCES users(id)
);

CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    media VARCHAR(255),
    caption VARCHAR(255),
    createdat TIMESTAMP DEFAULT NOW(),
    isArchieved Boolean DEFAULT false,
    FOREIGN KEY(userid) REFERENCES users(id)
);

CREATE TABLE storyviewers (
    id SERIAL PRIMARY KEY,
    viewerid INT NOT NULL,
    storyid INT NOT NULL,
    FOREIGN KEY(viewerid) REFERENCES users(id),
    FOREIGN KEY(storyid) REFERENCES stories(id)
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    sender INT NOT NULL,
    reciever INT NOT NULL,
    content VARCHAR(255),
    createdat TIMESTAMP DEFAULT NOW(),
    seen Boolean DEFAULT false,
    seenat TIMESTAMP,
    FOREIGN KEY(sender) REFERENCES users(id),
    FOREIGN KEY(reciever) REFERENCES users(id)
);

    
