/**
 * El vocabulario de la app, en inglés.
 *
 * El backend habla español (`nombre`, `correo`, `clave`...). Esa traducción
 * ocurre en un solo sitio, `src/api/`, y de ahí para acá todo se llama igual.
 * Así, si el servidor renombra un campo, solo cambia el archivo que traduce.
 *
 * Los VALORES de las listas (SOLICITANTE, ALTA, RED...) sí van en español:
 * no son nombres de código, son los datos que el servidor guarda y devuelve.
 */

/** Roles del sistema. El backend asigna USER por defecto al registrarse. */
export const ROLES = ['USER', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

/** Usuario de la sesión. Nunca incluye la contraseña ni su hash. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** Una publicación creada por un usuario. */
export interface Post {
  id: string;
  title: string;
  image: string;
  description: string;
  userId: string;
  createdAt: string;
}

/** Categoría de los posts (outfits). La gestiona el admin. */
export interface Category {
  id: string;
  name: string;
}
