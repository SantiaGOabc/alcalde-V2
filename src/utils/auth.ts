export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthSession {
    user: {
        username: string;
        role: string;
        fullName: string;
    };
    token: string;
    timestamp: number;
}

export interface LoginResult {
    success: boolean;
    message: string;
    session?: AuthSession;
}

const STORAGE_KEY = 'alcalde_admin_session';

/**
 * Servicio de autenticación desacoplado.
 * Actualmente funciona en modo mock (sin base de datos) para desarrollo y prototipado.
 * Cuando se conecte un backend o API real, solo se modifica esta función reemplazando
 * el bloque mock por un fetch('/api/auth/login').
 */
export async function loginService(credentials: LoginCredentials): Promise<LoginResult> {
    // Simula latencia de red realista (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const cleanUsername = credentials.username.trim().toLowerCase();
    const cleanPassword = credentials.password.trim();

    // Credenciales válidas de prueba
    const validUsers = ['admin@cochabamba.bo', 'admin', 'alcaldia@cochabamba.bo'];
    const validPasswords = ['admin', 'admin123', 'cocha2026'];

    if (validUsers.includes(cleanUsername) && validPasswords.includes(cleanPassword)) {
        const session: AuthSession = {
            user: {
                username: cleanUsername,
                role: 'Administrador General',
                fullName: 'Administrador del Sistema',
            },
            token: `mock_jwt_token_${Date.now()}`,
            timestamp: Date.now(),
        };

        if (typeof window !== 'undefined') {
            const storage = credentials.rememberMe ? localStorage : sessionStorage;
            storage.setItem(STORAGE_KEY, JSON.stringify(session));
        }

        return {
            success: true,
            message: 'Acceso autorizado. Redirigiendo...',
            session,
        };
    }

    return {
        success: false,
        message: 'Usuario o contraseña incorrectos. Verifique sus credenciales.',
    };
}

export function getAuthSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export function logoutService(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
}
