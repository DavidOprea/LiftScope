CREATE TABLE IF NOT EXISTS logs(
    log_id INT,
    user_id VARCHAR(255) NOT NULL,
    text VARCHAR(10000) NOT NULL,
    date VARCHAR(255) NOT NULL,
    PRIMARY KEY (log_id, user_id)
);

CREATE TABLE IF NOT EXISTS profiles(
    user_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age VARCHAR(255) NOT NULL,
    streak JSON NOT NULL
);