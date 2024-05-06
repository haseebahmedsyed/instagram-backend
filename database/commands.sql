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