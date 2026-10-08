export type ResultMessage = { kind: 'ok' | 'error'; text: string };

export function messageOf(err: unknown): string {
    return err instanceof Error ? err.message : 'Ocurrió un error inesperado';
}