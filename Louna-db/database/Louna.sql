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
    tilaus_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tila VARCHAR(255) NOT NUll,
    tilaus_aika TIMESTAMP NOT NULL DEFAULT current_timestamp(),
    nouto_aika INT,
    FOREIGN KEY (user_id) REFERENCES Käyttäjät(user_id)
);


CREATE TABLE Tilausannos (
    tilaus_id INT NOT NULL,
    annos_id INT NOT NULL,
    määrä INT NOT NULL,
    FOREIGN KEY (tilaus_id) REFERENCES Tilaukset(tilaus_id),
    FOREIGN KEY (annos_id) REFERENCES Annokset(annos_id)
);

-- CREATE TABLE AnnoksetAllergeenit (
--     annos_id INT NOT NULL,
--     allerg_id INT NOT NULL,
--     PRIMARY KEY (annos_id, allerg_id),
--     FOREIGN KEY (annos_id) REFERENCES Annokset(annos_id),
--     FOREIGN KEY (allerg_id) REFERENCES Allergeenit(allerg_id)
-- )

-- MUOKATTU  ateriaa, LIHA -


INSERT INTO Ruokalista (nimi, day_name) 
    VALUES ('Karjalanpaisti', 'Maanantai'),
    ('Kanttarellikeitto', 'Maanantai'),
    ('Paahdettu kasvisrisotto', 'Maanantai'), 
    ('Broileripasta', 'Tiistai'), 
    ('Pinaattiletut', 'Tiistai'), 
    ('Linssikeitto', 'Tiistai'), 
    ('Jauhelihakeitto', 'Keskiviikko'), 
    ('Lohikeitto', 'Keskiviikko'), 
    ('Falafelit ja hummus', 'Keskiviikko'), 
    ('Lihapullat ja perunamuusi', 'Torstai'), 
    ('Kasvislasagne', 'Torstai'),
    ('Thaimaalainen kasviscurry', 'Torstai'),
    ('Pepperonipizza', 'Perjantai'), 
    ('Margherita-pizza', 'Perjantai'),
    ('Vegaanipizza', 'Perjantai'); 


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
  VALUES ('Karjalanpaisti', 1, 300, 1),
  ('Kanttarellikeitto',1, 400, 2),
   ('Paahdettu kasvisrisotto', 7, 700, 3),
  ('Broileripasta', 2, 900, 4), 
  ('Pinaattiletut', 2, 750, 5), 
  ('Linssikeitto', 7, 650, 6),
  ('Jauhelihakeitto', 3, 850, 7), 
  ('Lohikeitto', 2, 800, 8), 
  ('Falafelit ja hummus', 7, 700, 9), 
  ('Lihapullat ja perunamuusi',2, 900, 10), 
  ('Kasvislasagne', 6, 850, 11), 
  ('Thaimaalainen kasviscurry', 7, 800, 12),
  ('Pepperonipizza', 2, 950, 13), 
  ('Margherita-pizza', 4, 850, 14), 
  ('Vegaanipizza', 7, 900, 15); 



INSERT INTO Käyttäjät ( username, password, email, user_level_id)
    VALUES ('admin', 'adminpassword', 'admin@email.com', 1),
    ('test_user', 'testpassword', 'test@email.com', 2);

INSERT INTO Tilaukset (user_id, nouto_aika, tila)
    VALUES (2, 1000, "Työn alla"),
    (2, 1000, "Vastaanotettu");

INSERT INTO Tilausannos (tilaus_id, annos_id, määrä)
    VALUES(1,1,1),
    (1,2,2),
    (2,5,1);