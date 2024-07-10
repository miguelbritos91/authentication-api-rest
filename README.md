
---

# API REST de Autenticación Simple

## Descripción

Esta es una API REST simple para autenticación de usuarios con `username` y `password` usando JSON Web Tokens (JWT) y cookies de sesión. La API permite a los usuarios registrarse, iniciar sesión y cerrar sesión, y utiliza cookies para manejar la autenticación en el lado del cliente.

## Tecnologías Utilizadas

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Cookies
- EJS (Embedded JavaScript templates)
- bcrypt (para hashing de contraseñas)
- db-local (simulación de base de datos local)

## Estructura del Proyecto

```
/project-root
├── config.js
├── errors-message.js
├── user-repository.js
├── views/
│   ├── dashboard.ejs
│   ├── login.ejs
│   └── register.ejs
├── package.json
├── .env
└── index.js (o server.js)
```

## Endpoints

### Registro de Usuario

- **URL**: `/register`
- **Método**: `POST`
- **Descripción**: Registra un nuevo usuario.
- **Body**:
  ```json
  {
    "username": "example",
    "password": "password123",
    "name": "John",
    "lastname": "Doe",
    "birthdate": "1990-01-01"
  }
  ```

### Inicio de Sesión

- **URL**: `/login`
- **Método**: `POST`
- **Descripción**: Inicia sesión con un usuario existente.
- **Body**:
  ```json
  {
    "username": "example",
    "password": "password123"
  }
  ```

### Cerrar Sesión

- **URL**: `/logout`
- **Método**: `POST`
- **Descripción**: Cierra sesión del usuario actual.
- **Header**: 
  ```json
  {
    "Cookie": "access_token=<JWT>"
  }
  ```

### Página Principal (Dashboard)

- **URL**: `/`
- **Método**: `GET`
- **Descripción**: Muestra el dashboard si el usuario está autenticado.

### Página de Inicio de Sesión

- **URL**: `/login`
- **Método**: `GET`
- **Descripción**: Muestra la página de inicio de sesión si el usuario no está autenticado.

### Página de Registro

- **URL**: `/register`
- **Método**: `GET`
- **Descripción**: Muestra la página de registro.

## Configuración

### Variables de Entorno

Para mayor seguridad y para ocultar las credenciales, debes crear un archivo `.env` en el directorio raíz del proyecto. Este archivo contendrá las variables de entorno necesarias para la configuración del servidor.

### Ejemplo de `.env`

```env
PORT=3000
SALT=10  # Usa un valor mayor en producción para mayor seguridad
NODE_ENV=production
SECRET_TOKEN=unaClaveMuySeguraQueDebesGenerarYNoCompartir
```

### Ejemplo de `config.js`

El archivo `config.js` contiene valores de configuración de prueba. Para mejorar la seguridad de tu aplicación, debes añadir un archivo `.env` en la raíz del proyecto con los valores apropiados para cada variable.

```javascript
import 'dotenv/config'

export const { 
    PORT = 3000,
    SALT = 4, // Este valor es solo para pruebas. Usa un valor mayor en producción.
    NODE_ENV = 'dev',
    SECRET_TOKEN = 'c>5s=cB;w?@h9<@L]%F"_[SQQ_a"B{`Rw/=5n$O#/RTyT+)OwWPiNdMDoW&z^Y@' // Valor de prueba
} = process.env
```

### Instrucciones para Configurar el Archivo `.env`

1. Crea un archivo `.env` en el directorio raíz del proyecto.
2. Añade las siguientes variables con los valores apropiados:
   - `PORT`: El puerto en el que el servidor escuchará (por ejemplo, 3000).
   - `SALT`: El número de rondas de sal para el hashing de contraseñas (recomendado 10 en producción).
   - `NODE_ENV`: El entorno en el que se ejecuta la aplicación (`production`, `development`).
   - `SECRET_TOKEN`: Una clave secreta segura para firmar los tokens JWT.

## Ejecución

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Crea el archivo `.env` en el directorio raíz con las variables de entorno necesarias.
4. Inicia el servidor con `npm start`.

## Uso

- Para registrar un nuevo usuario, envía una solicitud POST a `/register` con el cuerpo especificado.
- Para iniciar sesión, envía una solicitud POST a `/login` con el cuerpo especificado.
- Una vez autenticado, el usuario será redirigido al dashboard (`/`).
- Para cerrar sesión, envía una solicitud POST a `/logout`.

---