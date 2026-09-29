# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## CMS, base de datos y Docker

Los `src/constants` son el contenido por defecto; lo que se edita en el panel se guarda en PostgreSQL y lo sobrescribe.

```bash
cp .env.example .env     # ajusta contraseñas y ADMIN_SECRET_CODE
npm run db:up            # levanta Postgres en Docker (puerto 5434)
npm run db:setup         # crea la base, aplica db.sql y crea el administrador
npm run dev              # panel en /admin/<ADMIN_SECRET_CODE>
```

Todo en contenedores: `npm run docker:up` (sitio en http://localhost:4321).
Si ya tienes un Postgres propio, apunta `DATABASE_URL` a él y ejecuta solo `npm run db:setup`.
