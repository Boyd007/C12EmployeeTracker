INSERT INTO department (name)
    VALUES ("Project Manager"), ("Developer"), ("Designer"), ("Administration");

INSERT INTO role (title, salary, department_id)
    VALUES ("Senior Project Manager", 200000, 1), 
    ("Project Management", 125000, 1), 
    ("Senior Developer", 175000, 2), 
    ("Junior Developer", 100000, 2), 
    ("Senior Graphic Designer", 150000, 3), 
    ("Junior Graphic Designer", 80000, 3), 
    ("Office Manager", 100000, 4), 
    ("Administrative Assistant", 60000, 4), 
    ("Receptionist", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("Rick", "Sanchez", 1, null),
    ("Morty", "Smith", 2, 1),
    ("Summer", "Smith", 3, null),
    ("Snuffles", "Smith", 4, 3),
    ("Mr", "Birdperson", 5, null),
    ("Jerry", "Smith", 6, 5),
    ("Krombopulos", "Michael", 7, null),
    ("Mr", "Meeseeks", 8, 7),
    ("Doofus", "Rick", 9, 7)