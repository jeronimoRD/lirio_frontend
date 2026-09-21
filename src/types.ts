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

/** Una publicación creada por un usuario. */
export interface Post {
  id: string;
  title: string;
  image: string;
  description: string;
  userId: string;
  createdAt: string;
  /** ID de la categoría del outfit (opcional hasta que todos los posts la tengan). */
  categoryId?: string;
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
