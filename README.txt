PRUEBA TÉCNICA

Este proyecto está dividido en dos partes: Backend (API en .NET) y Frontend (React).
Dentro de la carpeta backend se incluye un archivo PruebaT.bak que contiene la base de datos que debe restaurarse en SQL Server antes de ejecutar la API.

REQUISITOS PREVIOS

NET 8 SDK

SQL Server o SQL Server Express

SQL Server Management Studio (SSMS)

Node.js (versión LTS)

npm

Git


RESTAURAR LA BASE DE DATOS (PruebaT.bak)

1 Abrir SQL Server Management Studio (SSMS).

2 Conectarse a la instancia de SQL Server (por ejemplo localhost o localhost\SQLEXPRESS).

3 En el panel izquierdo (Object Explorer), dar clic derecho en “Databases”.

4 Seleccionar “Restore Database…”.

5 En la sección “Source”, elegir “Device” y presionar el botón con los tres puntos.

6 Dar clic en “Add” y buscar el archivo:
backend/PruebaT.bak

7 En “Destination database”, escribir el nombre: PruebaTecnica

8 En la pestaña “Options”, activar si es necesario: Overwrite the existing database (WITH REPLACE).

9 Dar clic en OK para restaurar la base.

///////////////////////////////////////////////////////////////////////////////////////////////////////////

CONFIGURAR BACKEND (API .NET)

Ubicación del backend:
backend/PruebaTecnica

Editar la cadena de conexión en el archivo appsettings.json.

Si usas SQL Authentication (usuario y contraseña):

ConnectionStrings -> DefaultConnection:
Server=localhost\SQLEXPRESS;Database=PruebaTecnica;User Id=sa;Password=TuContraseña;

Si usas Windows Authentication:

Server=localhost\SQLEXPRESS;Database=PruebaTecnica;Trusted_Connection=True;

Nota: Cambiar SQLEXPRESS según tu instancia.
Si te conectas a SSMS usando solo localhost, entonces usa:
Server=localhost;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
EJECUTAR EL BACKEND

Abrir la solución en la carpeta de Backend llamada
PruebaTecnica.sln y en la aarte superior de Visual Studio Ejecutar el https
 
La API iniciará en una dirección como:
http://localhost:7294

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

EJECUTAR EL FRONTEND

Abrir consola y ejecutar:

cd frontend
npm install
npm run dev

La aplicación se abrirá en:
http://localhost:5173

NOTA: En la carpeta api dentro del proyecto de React hay unos .js que son Api, Auth EquipoApi y SolicitudesApi
contienen una constante const API_URL = "https://localhost:7294/api"; y se debe cambiar el puerto si es que en tu caso al ejecutar la api tengas unos diferente.
/////////////////////////////////////////////////////////////////////////////////////////////////

EXTRAS PARA USAR LA APP

Deberás usar este User para poder iniciar sección y utilizar la app

user: grecia@michel.com
password: Admin123!

El flujo después de iniciar sección sera el dashboard con las características solicitadas, después tendremos un botón para ver nuestras solicitudes y crearlas, dentro de esa vista de solicitudes podremos crear las recomendaciones de equipos según las solicitudes.
