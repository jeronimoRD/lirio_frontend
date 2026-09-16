# Lirio & Hibisco — Frontend

Aplicación móvil hecha con **Expo + React Native**, conectada a un backend propio con **Node.js/Express** y **MongoDB**.

Este proyecto está dividido en **dos repositorios separados**:

| Repositorio | Qué contiene |
|---|---|
| [`LirioHibisco-Frontend`](https://github.com/jeronimoRD/LirioHibisco-Frontend) *(este repo)* | La app (Expo) |
| [`lirio_backend`](https://github.com/isatm/lirio_backend) | La API (Node + MongoDB) |

Para correr el proyecto completo necesitás clonar **ambos** repositorios.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 18 o superior, para evitar errores de versionamiento e incompatibilidad
- [MongoDB](https://www.mongodb.com/try/download/community) corriendo localmente, o una URI de MongoDB Atlas
- La app [Expo Go](https://expo.dev/go) instalada en tu celular (para probar rápido), **o** Android Studio si querés usar un emulador
- Git (Git Bash o PowerShell, cualquiera de los dos sirve)
- Una cuenta de GitHub con acceso a ambos repositorios

---

## 1. Cloná el backend y levantalo

```bash
git clone https://github.com/isatm/lirio_backend.git
cd lirio_backend
npm install
```

Creá un archivo `.env` dentro de esta carpeta con:

```dotenv
MONGODB_URI=mongodb://usuario:contraseña@localhost:27017/nombre-de-tu-basededatos
JWT_SECRET=una-clave-larga-y-dificil-de-adivinar
```

| Variable | Qué es | Cómo conseguirla |
|---|---|---|
| `MONGODB_URI` | Cadena de conexión a tu base de datos MongoDB | Si usás MongoDB local: `mongodb://localhost:27017/nombre-db`. Si usás Atlas, la URI te la da el panel de Atlas. |
| `JWT_SECRET` | Clave usada para firmar los tokens de autenticación | Cualquier string largo y aleatorio, o el que te haya pasado el desarrollador del backend. |

Corré el servidor:

```bash
npm run dev
```

Por defecto debería quedar escuchando en `http://localhost:3000`. Dejá esta terminal abierta.

---

## 2. Cloná el frontend y levantalo

En **otra terminal**:

```bash
git clone https://github.com/jeronimoRD/LirioHibisco-Frontend.git
cd LirioHibisco-Frontend
npm install
```

Creá un archivo `.env` dentro de esta carpeta con:

```dotenv
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000
```

### ⚠️ Cómo obtener `TU_IP_LOCAL` (importante, esto rompe muy seguido)

El valor correcto de `EXPO_PUBLIC_API_URL` **depende de dónde estés probando la app**:

| Dónde corrés la app | Qué poner en `EXPO_PUBLIC_API_URL` |
|---|---|
| **Navegador Web** (`npm run web`) | `http://localhost:3000` |
| **Celular físico** con Expo Go (misma red WiFi que tu PC) | `http://TU_IP_LOCAL:3000` |
| **Emulador de Android** | `http://10.0.2.2:3000` (IP especial que Android usa para referirse a tu PC) |

Para conseguir tu IP local (necesaria para celular físico):

- **Windows:** abrí PowerShell y corré `ipconfig`. Buscá "Dirección IPv4" dentro de tu adaptador WiFi.
- **Mac/Linux:** corré `ifconfig` en la terminal. Buscá `inet` dentro de tu interfaz de red activa (ej. `en0` en Mac).

Tu celular y tu PC tienen que estar conectados a la **misma red WiFi** para que esto funcione.

Corré la app:

```bash
npx expo start
```

Desde ahí podés:
- Apretar `w` para abrir en el navegador
- Apretar `a` con un emulador Android ya prendido
- Escanear el QR con la app Expo Go en tu celular

---

## Scripts disponibles (frontend)

| Comando | Qué hace |
|---|---|
| `npm start` / `npx expo start` | Levanta el servidor de desarrollo de Expo |
| `npm run web` | Abre la app en el navegador |
| `npm run android` | Compila y corre en un emulador/dispositivo Android conectado |
| `npm run lint` | Corre ESLint + Prettier en modo chequeo |
| `npm run format` | Corre ESLint + Prettier y corrige automáticamente lo que puede |

---

## Problemas comunes

**"No se pudo conectar con el backend" / respuesta vacía al hacer login:**
Casi siempre es `EXPO_PUBLIC_API_URL` mal seteado para la plataforma donde estás probando, o el backend no está corriendo. Revisá la tabla de la sección 2 y confirmá que la terminal del backend siga abierta.

**Errores de versión al abrir con Expo Go:**
Corré `npx expo install --check` para ver qué paquetes no coinciden con el SDK del proyecto, y `npx expo-doctor` para un diagnóstico más completo.

**Cambios en variables de entorno no se reflejan:**
Las variables `EXPO_PUBLIC_*` se leen al arrancar el bundler, no en caliente. Cortá el servidor (`Ctrl+C`) y volvé a correr `npx expo start --clear`.

**El proyecto no levanta después de instalar dependencias nuevas:**
Probá `npx expo start --clear` para limpiar la caché de Metro.
