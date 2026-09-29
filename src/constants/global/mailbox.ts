export const MAILBOX_CONTENT = {
    title: "Buzon Ciudadano",
    description: "Estamos a cualquier sugerencia, felicitacion o observacion dirigida a nosotros",
    imageURL:"https://cochabamba.bo/img/noticias/XApapGO21aPYGwIPs14pbmNwTikKkRsK4Ywgh7qm.jpeg",
    imageAlt: "Buzon Ciudadano",
    form:{
        fullNameLabel: "Nombre Completo",
        fullNamePlaceholder:"Ej. Emiliano Gomez",
        emailLabel:"Correo Electronico",
        emailPlaceholder:"emiliano@gmail.com",
        typeLabel: "Tipo de mensaje",
        typePlaceholder: "Selecciona una opcion",
        messageLabel:"Mensaje",
        cancelButton:"Cancelar",
        submitButton:"Enviar",
        loadingText:"Enviando",
        successTitle: "¡Gracias por escribirnos!",
        successMessage: "Mensaje enviado correctamente",
        errorTitle: "No se pudo enviar",
        errorMessage: "No pudimos enviar tu mensaje. Intenta nuevamente."
    }
};

/** Tipos de mensaje que el ciudadano puede enviar. `value` es lo que recibe el servicio. */
export const MAILBOX_MESSAGE_TYPES = [
    { value: "sugerencia", label: "Sugerencia" },
    { value: "felicitacion", label: "Felicitación" },
] as const;
