CREATE TABLE jokes (
    id UUID PRIMARY KEY,
    external_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL
);