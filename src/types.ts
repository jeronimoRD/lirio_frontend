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
  bio: string;
  /** IDs de las categorías de estilos que el usuario eligió al registrarse. */
  preferredCategories: string[];
  /** Solo lo incluye la lista de admin (login/registro no). */
  createdAt?: string;
  /** Último inicio de sesión (solo lista de admin). */
  lastLogin?: string;
}

/** Tipos de prenda del post. Los valores coinciden con el enum del backend. */
export const GARMENT_TYPES = ['SHIRT', 'PANTS', 'SHOES'] as const;
export type GarmentType = (typeof GARMENT_TYPES)[number];

/** Una publicación creada por un usuario. */
export interface Post {
  id: string;
  title: string;
  image: string;
  description: string;
  userId: string;
  createdAt: string;
  /** IDs de los estilos (categorías) del outfit. */
  categoryIds: string[];
  /** Número total de likes */
  likesCount?: number;
  /** Indica si el usuario actual ha dado like */
  isLikedByMe?: boolean;
  /** Lista de usuarios que han dado like (opcional) */
  likedBy?: string[];
  /** Indica si el usuario actual ha guardado el post */
  isSavedByMe?: boolean;
  /** Lista de usuarios que han guardado el post (opcional) */
  savedBy?: string[];
  /** Tipo de prenda principal del post */
  garmentType?: GarmentType;
}

/** Pieza de un outfit: un post elegido para un tipo de prenda. */
export interface OutfitItem {
  postId: string;
  garmentType: GarmentType;
  /** Null si el post ya no existe. */
  title: string | null;
  /** Null si el post ya no existe. */
  image: string | null;
  /** Falso si el dueño ya no puede usar esta prenda. */
  isAvailable: boolean;
}

/** Combinación de hasta una prenda por tipo, creada por un usuario. */
export interface Outfit {
  id: string;
  name: string;
  userId: string;
  isPublic: boolean;
  /** Falso si alguna pieza ya no está disponible. */
  isAvailable: boolean;
  /** Categorías de las piezas disponibles, para filtrar en explorar. */
  categoryIds: string[];
  items: OutfitItem[];
  createdAt?: string;
}

/** Categoría de los posts (outfits). La gestiona el admin. */
export interface Category {
  id: string;
  name: string;
}

// --- Reportes --------------------------------------------------------------

/** Lo que se puede reportar. Hoy la app solo expone posts; user queda para el futuro. */
export type ReportTargetType = 'POST' | 'USER';

export const REPORT_REASONS = [
  'SPAM',
  'INAPPROPRIATE',
  'HARASSMENT',
  'FAKE_ACCOUNT',
  'COPYRIGHT',
  'OTHER',
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  SPAM: 'Spam',
  INAPPROPRIATE: 'Contenido inapropiado',
  HARASSMENT: 'Acoso',
  FAKE_ACCOUNT: 'Cuenta falsa',
  COPYRIGHT: 'Derechos de autor',
  OTHER: 'Otro',
};

export const REPORT_STATUSES = ['PENDING', 'RESOLVED', 'DISMISSED'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'Pendiente',
  RESOLVED: 'Resuelto',
  DISMISSED: 'Descartado',
};

/** Contenido reportado, resuelto por el servidor para poder mostrarlo. */
export interface ReportedTarget {
  type: ReportTargetType;
  /** Título del post, si el objetivo es una publicación. */
  title?: string;
  /** URL de la imagen del post, si el objetivo es una publicación. */
  image?: string;
  /** Autor del post reportado. */
  ownerId?: string;
  /** Nombre de usuario, si el objetivo es una cuenta. */
  userName?: string;
  /** El contenido ya no existe (se borró aparte). */
  deleted?: boolean;
}

/** Un reporte tal como lo guarda el servidor. */
export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
  target: ReportedTarget;
}

/** Lo que el usuario llena al reportar. */
export interface NewReport {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
}

/** Acciones que el admin puede aplicar al resolver un reporte. */
export type ReportAction = 'DELETE_POST' | 'DELETE_USER';
