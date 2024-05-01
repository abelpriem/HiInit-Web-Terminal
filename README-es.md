Languajes: | [English](./README.md) |

## HiInit Terminal Web v1.0 &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)[![Netlify Status](https://api.netlify.com/api/v1/badges/b6605ef0-438b-4f66-825d-6f6a000e696f/deploy-status)](https://app.netlify.com/sites/hiinit-web-terminal/deploys)

      ___ ___  .___ .___  _______   .___ ___________     __      __        ___                ____    _______        
     /   |   \ |   ||   | \      \  |   |\__    ___/    /  \    /  \  ____ \_ |__      ___  _/_   |   \   _  \     
    /    ~    \|   ||   | /   |   \ |   |  |    |       \   \/\/   /_/ __ \ | __ \     \  \/ /|   |   /  /_\  \     
    \    Y    /|   ||   |/    |    \|   |  |    |        \        / \  ___/ | \_\ \     \   / |   |   \  \_/   \   
     \___|_  / |___||___|\____|__  /|___|  |____|         \__/\  /   \___   |___  /      \_/  |___| /\ \_____  /   
           \/                    \/                            \/        \/     \/                  \/       \/    
<br>

> HiInit es un sistema de terminal web de `creación y carga de archivos` con un sistema de registro y login de usuarios con diferentes grupos y categorías.
> Los archivos pueden ser compartidos entre los distintos miembros de un grupo específico, navegando entre los distintos archivos de la carpeta raíz.
> Hay diferentes roles con sus correspondientes permisos pero solo el tipo de usuario **ADMIN** tiene el `sistema CRUD` (creación, escritura, carga y eliminación).

- Última actualización: 26/03/2024

## ÍNDICE

- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README-es.md#resumen">Resumen</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README-es.md#tipos-de-usuarios">Tipos de Usuarios</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README-es.md#casos---funciones">Casos - Funciones</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README-es.md#modelo-de-datos">Modelo de Datos</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README-es.md#comandos">Comandos</a>
- <a href="https://github.com/abelpriem/HiInit-Web-Terminal/blob/main/README-es.md#figma---componentes">Figma - Componentes</a>


## RESUMEN

`Para HiInit v0.1`
- [x] Terminal web con servicio de carga online de archivos.
- [x] Escritorio o espacio personal para cada usuario.
- [x] Empleo de `MULTER` y el paquete `FS` de NodeJS en API para subir archivos mediante petición HTTP y guardarlos en disco `npm i multer`
- [x] Subida y descarga de archivos.
- [x] Sistema CRUD completo
- [x] Primera versión para el proyecto final de ISDI CODERS.

<br>

`Para HiInit v1.0`
- [x] Utilización de `AWS` para el alojamiento en nube o remoto de archivos `npm i aws-sdk`
- [x] Uso de `MongoDB Atlas` para almacenar base de datos en Cloud
- [x] Deploy con `Render` y `Netlify`

<br>

`Para HiInit v1.5`

- [ ] Organización y creación de carpetas
- [ ] Añadir grupos/roles de staffs
- [ ] Poder asignar más grupos a usuarios
- [ ] En construcción ... ⏳

## TIPOS DE USUARIOS

- Invitado: Primera entrada sin logeo de usuario - Color naranja
- User: Usuario estándar - Color azul
- Root: Administrador - Color rojo
  
## CASOS - FUNCIONES

`INVITADO`

- Primera entrada | Registro o Login | Salida | Help 

`USUARIO ESTÁNDAR`

- Crear y manejar sus propios archivos | Subir y descargar archivos | Modificación de datos | Help

`ROOT - ADMIN`

- Manejo de usuarios | Sistema CRUD | Todos los archivos y carpetas | Permisos | Grupos | Help

## MODELO DE DATOS

`USUARIO`

- id
- nombre usuario
- email
- contraseña
- grupo (ref: Grupo.id)
- rol (tipo: String, enum: [ invitado, regular, admin ])

`GRUPO`

- id
- nombre

`COMANDO`

- id
- nombre
- descripción

`ARCHIVO`

- id
- nombre
- dueño (ref: Usuario.id)
- tipo (tipo: String, enum: [ archivo, carpeta ])
- padre (ref: Archivo.id)
- permisos (tipo: Number, enum: [ 0, 2, 3 ])

## COMANDOS

## | TIPO - INVITADO |

- Primer vistazo o entrada a la "PÁGINA INICIAL"

|   Comandos  | Función                                                               |
|  ---------  | --------                                                              | 
|  `register` | *Registro de usuario con `{ nombre usuario, email y contraseña }`*    |
|   `login`   | *Login en HiInit con credeciales `{ email y contraseña }`*            |
|    `help`   | *Solo **lista** de comandos con nombres y funciones*                  |
|    `exit`   | *Vuelve a la `página inicial`*                                        |

## | TIPO - USUSARIO |

|   Comandos  | Función                                                    |
|  ---------  | --------                                                   |
|    `pwd`    | *`Muestra` el directorio actual*                           |
|     `ls`    | *Lista los `archivos del directorio`*                      |
|  `desktop`  | *Redirige al usuario a su carpeta `Escritorio`*            |
|  `download` | *`Descarga` de archivo específico o documento*             |
|   `upload`  | *`Subida` de archivo específico o documento*               |
|   `delete`  | *`Borra` el archivo del propio usuario*                    |
|    `help`   | *Solo **lista** los comandos con nombres y funciones*      |
|    `exit`   | *Deslogeo de sesión y `retorno` a la página inicial*       |


## | TIPO - ADMINISTRADOR (ROOT) |

|   Comandos  | Función                                                    |
|  ---------  | --------                                                   |
|    `sudo`   | *Entrar en modo `ADMINISTRADOR`*                           |
|    `pwd`    | *`Muestra` el directorio actual*                           |
|     `ls`    | *Lista los `archivos del directorio`*                      |
|  `desktop`  | *Redirige al usuario a su carpeta `Escritorio`*            |
|  `download` | *`Descarga` de archivo específico o documento*             |
|   `upload`  | *`Subida` de archivo específico o documento*               |
|   `delete`  | *`Borra` el archivo del propio usuario*                    |
|    `help`   | *Solo **lista** los comandos con nombres y funciones*      |
|    `exit`   | *Deslogeo de sesión y `retorno` a la página inicial*       |

## FIGMA - COMPONENTES

`PÁGINA INICIAL`

![INICIAL](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/4a4d3c48-c489-4c9d-9c46-59ef278338e1)

- Página de inicio a la APP con información de contacto: email, GitHub y perfil de Linkedin.
- Formato de la barra de comandos: **guest@hiinit-guest**
- Cuando presionamos `ENTER` en la página de inicio, podemos entrar al apartado de Registro o de Login con las intrucciones:  *"Escribe el comando login o register para cambiar entre los diferentes componentes de login o registro"*
- Podemos escribir el comando `HELP` para que nos muestre el listado de comandos
- Con el comando `EXIT` podremos regresar a la página de inicio **solo en modo invitado**
- Entrar al siguiente componente -> **LOGIN | REGISTRO**

<br>

`REGISTRO -> En modo "INVITADO"`

![REGISTER](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/0cfbb82d-5257-40a3-8a35-1a8cef199e06)

- ***register => nombre de usuario + email + contraseña***
- Una vez que nos hayamos registrado, el texto desaparecerá y aparecerá una nueva barra de comandos para poder hacer el login
- Interfaz de errores: manejamos errores del tipo usuario en pantalla mediante elementos HTML
- Entry the next component -> **LOGIN**

<br>

`LOGIN -> En modo "INVITADO"`

![LOGIN](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/d9098538-35ae-4b73-8446-409f4cea064c)

- ***login => email + contraseña***
- Cuando ingresamos nuestras credenciales, la barra de comandos nos mostrará el nombre de usuario al lado de la categoría `user` o `admin` con su color indicativo
- Interfaz de errores: manejamos errores del tipo usuario en pantalla mediante elementos HTML
- Entrar al siguiente componente -> **ESCRITORIO**
  
<br>

`ESCRITORIO -> Con "USUARIO" logeado`

![desktop](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/f525a6f5-fcd3-4c07-a7f0-da5a36d5220f)

- Solo se accede mediante logeo
- Grupo `localhost` por defecto
- Formato de la barra de comandos: **usuario@grupo-rol**
- El comando `pwd` nos indicará el directorio actual desde la carpeta raíz: `C:\Desktop`
- Podrán visualizar sus comandos con el comando `help`
- Podremos subir o descargar archivos con los comandos `upload` o `download`
- Los `permisos` estarán relacionados al tipo de grupo establecido por el ADMIN
- Los usuarios del mismo grupo podrán `visualizar archivos de cada uno` y `descargarlos`
- En la página `Profile`, los usuarios podrán modificar el email y el password de su cuenta
- En todos los casos, tenemos el comando `logout` para salir de la sesión y volver a la **PÁGINA INICIAL**

<br>

`ADMINISTRADOR -> Con "ADMIN" logeado`

![SUDO](https://github.com/b00tc4mp/isdi-parttime-202309/assets/133054841/6088b75e-d89f-4085-bb53-435054f38f93)

- Grupo `root` por defecto
- Solo se accede mediante el ADMIN logeado a través del comando `sudo`
- El **ADMIN** puede `crear, borrar o modificar GRUPOS` y `asignar usuarios` en ellos
- También podrán listar usuarios y `borrarlos`
- Tienen la posibilidad de `crear` otro **ADMIN** (pero no podrán eliminarse entre ellos)
  
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
