// Foto local del login, del mismo modo que el resto del sitio (ver
// `src/utils/images.ts`). Antes venía del deploy viejo de Netlify (503).
import { alcalde } from "@utils";

export const LOGIN_CONTENT = {
    badge: 'Seguridad Municipal',
    title: 'Acceso Administrativo',
    subtitle: 'Gestor de contenido',
    description:
        'Ingresa tus credenciales autorizadas para gestionar y actualizar los contenidos y proyectos del portal.',
    imageURL: alcalde("alcalde.jpg"),
    imageAlt: 'Manfred Reyes Villa',
    form: {
        usernameLabel: 'Usuario',
        usernamePlaceholder: 'usuario',
        passwordLabel: 'Contraseña',
        passwordPlaceholder: '••••••••',
        showPassword: 'Mostrar',
        hidePassword: 'Ocultar',
        submitButton: 'Ingresar al sistema',
        loadingText: 'Verificando credenciales...',
        backToHome: 'Volver a la página principal',
        unexpectedError: 'Ocurrió un error inesperado al procesar la solicitud.',
    },
};
