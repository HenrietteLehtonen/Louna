DROP DATABASE IF EXISTS Louna;
CREATE DATABASE Louna;
USE Louna;

CREATE TABLE Käyttäjät (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE Allergeenit (
    allerg_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    tunniste VARCHAR(255) NOT NULL,
    allergeeni VARCHAR(255) NOT NULL
);

CREATE TABLE Ruokalista (
    lista_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nimi VARCHAR(255) NOT NULL,
    day_name VARCHAR(255) NOT NULL
);

CREATE TABLE Annokset (
    annos_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nimi VARCHAR(255) NOT NULL,
    allerg_id INT NOT NULL,
    hinta INT NOT NULL,
    lista_id INT NOT NULL,
    FOREIGN KEY (allerg_id) REFERENCES Allergeenit(allerg_id),
    FOREIGN KEY (lista_id) REFERENCES Ruokalista(lista_id)
);

CREATE TABLE Tilaukset (
    tilas_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    annos_id INT NOT NULL,
    tilaus_aika TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    nouto_aika INT,
    FOREIGN KEY (annos_id) REFERENCES Annokset(annos_id),
    FOREIGN KEY (user_id) REFERENCES Käyttäjät(user_id)
);


CREATE TABLE Tilausannos (
    tilas_id INT NOT NULL,
    annos_id INT NOT NULL,
    määrä INT NOT NULL,
    PRIMARY KEY (tilas_id, annos_id),
    FOREIGN KEY (tilas_id) REFERENCES Tilaukset(tilas_id),
    FOREIGN KEY (annos_id) REFERENCES Annokset(annos_id)
);

-- CREATE TABLE AnnoksetAllergeenit (
--     annos_id INT NOT NULL,
--     allerg_id INT NOT NULL,
--     PRIMARY KEY (annos_id, allerg_id),
--     FOREIGN KEY (annos_id) REFERENCES Annokset(annos_id),
--     FOREIGN KEY (allerg_id) REFERENCES Allergeenit(allerg_id)
-- )


INSERT INTO Ruokalista (nimi, day_name) 
    VALUES ('peruna', 'Maanantai'),
    ('makkara', 'Maanantai'),
    ('pasta', 'Tiistai'),
    ('kana', 'Tiistai'),
    ('kalakeitto', 'Keskiviikko'),
    ('leipä', 'Keskiviikko'),
    ('lasagne', 'Torstai'),
    ('salaatti', 'Torstai'),
    ('pizza', 'Perjantai'),
    ('tacos', 'Perjantai');

INSERT INTO Allergeenit (tunniste, allergeeni)
    VALUES ('G', 'gluteenoton'),
    ('VL', 'vähälaktoosinen'),
    ('L', 'laktoositon'),
    ('M', 'maidoton'),
    ('K', 'ei_sisällä_kananmunaa'),
    ('SO', 'soijaton'),
    ('VEG', 'vegaaninen'),
    ('EI', 'ei_allergeeneja');

INSERT INTO Annokset (nimi, allerg_id, hinta, lista_id) 
  VALUES ('peruna', 1, 300, 1),
  ('makkara',1, 400, 2),
  ('pasta', 1, 500, 3),
  ('kana', 1, 600, 4),
  ('kalakeitto', 1, 750, 5),
  ('leipä', 1, 200, 6),
  ('lasagne', 1, 800, 7),
  ('salaatti', 1, 400, 8),
  ('pizza', 1, 800, 9),
  ('tacos', 1, 600, 10);


INSERT INTO Käyttäjät ( username, password, email, user_level_id)
    VALUES ('admin', 'adminpassword', 'admin@email.com', 1),
    ('test_user', 'testpassword', 'test@email.com', 2);

INSERT INTO Tilaukset (user_id, annos_id, nouto_aika)
    VALUES (2, 1, 1000);

INSERT INTO Tilausannos (tilas_id, annos_id, määrä)
    VALUES(1,1,1),
    (1,2,2);