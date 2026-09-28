import { email } from "astro:schema";

export const MAILBOX_CONTENT ={
    title: "Buzon Ciudadano",
    description: "Estamos a cualquier sugerencia, felicitacion o observacion dirigida a nosotros",
    imageURL:"https://cochabamba.bo/img/noticias/XApapGO21aPYGwIPs14pbmNwTikKkRsK4Ywgh7qm.jpeg",
    imageAlt: "Buzon Ciudadano",
    form:{
        fullNameLabel: "Nombre Completo",
        fullNamePlaceholder:"Ej. Emiliano Gomez",
        emailLabel:"Correo Electronico",
        emailPlaceholder:"emiliano@gmail.com",
        messageLabel:"Mensaje",
        cancelButton:"Cancelar",
        submitButton:"Enviar",
        loadingText:"Enviando",
        successMessage: "Mensaje enviado correctamente"
    }
};