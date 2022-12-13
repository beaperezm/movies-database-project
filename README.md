 **Proyecto de Base de Datos de películas**     

Práctica/Proyecto de Back-end que consiste en la creación de una base de datos de una api de películas, realizada con Node.js y MongoAtlas.

## Objetivos del proyecto

- Se han creado cuatro colecciones (users, movies, cinemas, directors)

1- Dentro de la carpeta `**models**` se pueden encontrar los "Schemas" con los atributos que quiero guardar en mi base de datos, de cada una de las colecciones; además de indicar, qué atributos son requeridos, únicos, etc.
En cada una de las colecciones además se ha creado el modelo, que sigue el Schema y que es el que se utiliza cada vez que se añade un elemento (ya que es el que está exportado)
   `**Movies**` -- tiene una relación con la colección directors
   `**Directors**`-- tiene una relación con la colección movies
   `**Cinemas**`-- tiene una relación con la colección movies

2- Dentro de la carpeta `**public**` donde se subirán los archivos estáticos del proyecto, para su posterior borrado automático.

3- Dentro de la carpeta `**routes**`, se encuentran la distintas colecciones con sus endpoints, aquí es dónde se realiza el CRUD (Create/Post, Read/Get/ Update/Put, Delete/Delete):
`**Users**`  --> realizada para el registro, login y logout del usuario

 `**Movies**` --> se han creado varios endpoints:

     --GET --> para recuperar todos los datos, paginación, recuperar datos por id, por título (recibes sólo el título y la imagen), por género y las películas estrenadas del 2010 en adelante. Para la lectura de la API no hace falta estar registrado.

     --POST --> para insertar datos e imágenes (a través de Cloudinary) en la base de datos.

     --DELETE --> para borrar datos de la base de datos.
     Podemos borrar solo un elemento de la colección de movies por su id; o también se puede borrar una película de esta colección (por su id) y se borrará también de la colección de `**cinemas**` y de `**directors**`

     --PUT --> para actualizar datos e imágenes de la base de datos.

     Tanto en los POST, DELETE y PUT hay que estar registrado y tener un role para poder realizar dichas acciones.

`**Directors**`, `**Cinemas**` --> se han creado varios endpoints:

    --GET --> para recuperar todos los datos y paginación.

    --POST --> para insertar datos e imágenes (a través de Cloudinary) en la base de datos.

     --DELETE --> para borrar datos de la base de datos (por el id).

     --PUT --> para actualizar datos e imágenes de la base de datos.

     Tanto en los POST, DELETE y PUT hay que estar registrado y tener un role para poder realizar dichas acciones.

4- Carpeta `**tmp**`--> creada para el despliege de la API con Vercel

5- Dentro de la carpeta `**utils**`, tenemos:
- authentication --> con passport para la gestión de usuarios.
- db --> con el archivo connect.js - es el encargado de conectar la base de datos a mongoose/MongoDB.
- errors --> creado el archivo create-error.js para unificar todo el control de errores por un mismo sitio.
- middlewares --> creados los middlewares de athentication, cloudinary y multer (éste último, lo que hace es preparar el archivo pra poder subirlo).
- seeds --> en la cual se encuentra, tanto el archivo .json de las películas (dentro de db) como la seed de movies - archivo que inicializa la base de datos.

6- `**vercel.json**` --> archivo con la configuración necesaria para el depliege de la Api.

--------------------------------------------

**Movie Database Project**

Back-end practice/project consisting in the creation of a movie api database, made with Node.js and MongoAtlas.

## Project objectives

Four collections have been created (users, movies, cinemas, directors)

1- Inside the folder `**models**` you can find the "Schemas" with the attributes that I want to save in my database, of each one of the collections; besides indicating, which attributes are required, unique, etc.
In each one of the collections the model has also been created, which follows the Schema and is the one that is used every time an element is added (since it is the one that is exported).
   `**Movies**` -- has a relation with directors collection.
   `**Directors**`-- has a relation with movies collection.
   `**Cinemas**`-- has a relation with movies collection.

2- Inside the folder `**public**` where the static files of the project will be uploaded, for later automatic deletion.

3- The `**routes**` folder contains the different collections with their endpoints, here is where CRUD is performed (Create/Post, Read/Get/ Update/Put, Delete/Delete):

`**Users**` --> performed for user registration, login and logout

`**Movies**` --> several endpoints have been created:

    --GET --> to retrieve all data, pagination, retrieve data by Id, by title(where you get only the title and image), by genre and movies released from 2010 onwards. You don´t need to be register to read the API.

    --POST --> to insert data and images (via Cloudinary) into de database.

    --DELETE --> to delete data from the database.
    We can delete only one item of movies collection or we can also delete a movie from this collection (by its id) and it will be deleted from the cinemas and directors collection as well.

    --PUT --> to update data and images of the database.

    In POST, PUT and DELETE you must be registered and have a role to be able to perform these actions.

`**Directors**`, `**Cinemas**` --> several endpoints have been created:

    --GET --> to retrieve all data, pagination.

    --POST --> to insert data and images (via Cloudinary) into de database.

    --DELETE --> to delete data from the database (by its id).

    --PUT --> to update data and images of the database.

     In POST, PUT and DELETE you must be registered and have a role to be able to perform these actions.

    
4- Folder `**tmp**`--> for the deployment of the API with Vercel

5- Inside `**utils**` folder:
- authentication --> with passport for user management.
- db --> with the connect.js file, it´s in charge of connecting the database to mongoose/MongoDB.
- errors --> created the create-error.js file to unify all error control in one place.
- middlewares --> created the middlewares of authentication, cloudinary and multer(this last one, what it does is to prepare the file to be uploaded).
- seeds --> in which you can find both the .json file of the movies (inside db folder) and the movies seed, file that initializes the database.

6- `**vercel.json**` --> file with the necessary configuration for Api deployment.















