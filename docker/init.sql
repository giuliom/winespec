-- init.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (
    username, password_hash, email
    ) VALUES (
        'test_user',
        '3fe8a977a6468ea5836c7d00b37f0bc7',
        'testuser@testmail.com'
        );


CREATE TABLE wines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INT,
    grape VARCHAR(50),
    abv REAL,
    types TEXT[],
    winery VARCHAR(100),
    region VARCHAR(100),
    country VARCHAR(100),
    price REAL,
    volume REAL,
    count INT
);


-- Load the JSON file into a temporary table as a JSON array
CREATE TEMP TABLE tmp_json (data JSONB);

-- Read the entire file content and cast it to a JSONB array
INSERT INTO tmp_json (data)
VALUES ((pg_read_file('/docker-entrypoint-initdb.d/content.json')::JSONB));

-- Insert data into the wines table by iterating over the JSON array
INSERT INTO wines (
    name, year, grape, abv, types, winery, region, country, price, volume, count
)
SELECT
    item->>'name' AS name,
    (item->>'year')::INT AS year,
    item->>'grape' AS grape,
    (item->>'abv')::NUMERIC(4,2) AS abv,
    ARRAY(
        SELECT jsonb_array_elements_text(item->'types')
    ) AS types,
    item->>'winery' AS winery,
    item->>'region' AS region,
    item->>'country' AS country,
    (item->>'price')::NUMERIC(10,2) AS price,
    (item->>'volume')::NUMERIC(4,2) AS volume,
    (item->>'count')::INT AS count
FROM
    tmp_json,
    jsonb_array_elements(tmp_json.data) AS item;