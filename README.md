Backend Citas Medicas
En caso de querer usar el proyecto puedes iniciarlo de la siguiente manera 
Primero instalar las dependencias de Node.js con:
npm install express pg bcryptjs jsonwebtoken dotenv cors   
luego instala nodemon:
npm install --save-dev nodemon   
y ejecuta el index.html con five server 
tambien debes crear las tablas en la base de datos y crear el archivo .env con las credenciales de tu base de datos de PostgreSQL en la carpeta de backend

-- Crear la tabla Doctor
CREATE TABLE Doctor (
    ID_Doctor SERIAL PRIMARY KEY,    
    Nombre VARCHAR(100) NOT NULL,     
    Apellido VARCHAR(100) NOT NULL,  
    Telefono VARCHAR(15)             
);

-- Crear la tabla Paciente
CREATE TABLE Paciente (
    ID_Paciente SERIAL PRIMARY KEY,   
    Nombre VARCHAR(100) NOT NULL,      
    Apellido VARCHAR(100) NOT NULL,     
    Telefono VARCHAR(15),             
    Direccion VARCHAR(200)          
);

-- Crear la tabla Cita
CREATE TABLE Cita (
    ID_Cita SERIAL PRIMARY KEY,       
    Fecha DATE NOT NULL,             
    Hora TIME NOT NULL,               
    Estado VARCHAR(20) CHECK (Estado IN ('Pendiente', 'Completada')) NOT NULL,  
    ID_Doctor INT NOT NULL,            
    ID_Paciente INT NOT NULL,          
    FOREIGN KEY (ID_Doctor) REFERENCES Doctor(ID_Doctor) ON DELETE CASCADE,  
    FOREIGN KEY (ID_Paciente) REFERENCES Paciente(ID_Paciente) ON DELETE CASCADE 
);


CREATE TABLE Cita_Completada (
    ID_Cita SERIAL PRIMARY KEY,
    ID_Paciente INT NOT NULL,
    ID_Doctor INT NOT NULL,
    Fecha DATE NOT NULL,
    Hora TIME NOT NULL,
    Estado VARCHAR(50) NOT NULL,
    Fecha_Completada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);