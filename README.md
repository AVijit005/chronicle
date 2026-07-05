# Chronicle

Chronicle is a modern, premium full-stack application designed to help you document, track, and explore your personal media journeys. Whether you are cataloging movies, curating video game progress, or journaling your thoughts on literature, Chronicle provides a unified, cinematic interface to centralize your digital experiences.

## Overview

Moving beyond simple lists, Chronicle focuses on the *experience* of media consumption. It offers deep analytics, timeline-based history, personal journaling, and a visually stunning interface that treats your media history as an evolving story. Version 1.0.0 represents the fully integrated production release, connecting a robust React frontend to a scalable NestJS backend.

## Features

- **Cinematic Media Library:** A premium, visually rich catalog for tracking diverse media formats.
- **Dynamic Dashboard:** Real-time synchronization of active journeys, streaks, and daily focuses.
- **Personal Journal & Timeline:** Document quotes, rate experiences, and map out your engagement history chronologically.
- **Yearly Wrapped & Analytics:** Beautiful data visualizations detailing your consumption patterns.
- **Global Search:** Lightning-fast command palette for navigating content seamlessly.
- **Collections & Franchises:** Group related media into custom galleries.

## Screenshots

![Dashboard Overview](./docs/images/screenshot-dashboard-placeholder.png)
*The main user dashboard featuring active journeys and statistics.*

![Media Detail View](./docs/images/screenshot-media-placeholder.png)
*The cinematic media detail view with interactive progress tracking.*

![Yearly Wrapped](./docs/images/screenshot-wrapped-placeholder.png)
*Personalized analytics and yearly review slides.*

## Technology Stack

### Frontend
* **Core:** React, TypeScript, Vite
* **Routing:** TanStack Router (File-based, type-safe routing)
* **State Management:** TanStack React Query
* **Styling:** Tailwind CSS, Framer Motion, Radix UI

### Backend
* **Framework:** NestJS
* **Language:** TypeScript
* **Validation:** class-validator, class-transformer

### Database
* **Primary Store:** PostgreSQL
* **ORM:** Prisma

### Authentication
* Session-based secure authentication

### Storage
* Local and cloud-compatible static asset serving

### Deployment
* **Frontend:** Vercel (Recommended)
* **Backend:** Render / Railway (Recommended)
* **Database:** Supabase / Neon / RDS

## Architecture

The application follows a strictly decoupled client-server architecture. The frontend relies on an adapter layer to format and normalize API responses, ensuring UI components are insulated from backend DTO structure changes.

```text
[ Frontend Application ]
          ↓
[ TanStack React Query ] (Caching, Deduping, Server State)
          ↓
[ Axios API Client & Adapters ] (Type mapping)
          ↓
         HTTP
          ↓
[ NestJS Backend ] (Controllers, Services, Auth Guards)
          ↓
[ Prisma ORM ] (Type-safe queries)
          ↓
[ PostgreSQL Database ]
```

## Folder Structure

```text
chronicle/
├── src/
│   ├── components/      # Reusable React components (UI, layout, features)
│   ├── hooks/           # React Query hooks and custom logic
│   ├── lib/             # Utility functions, API clients, and type adapters
│   ├── routes/          # TanStack Router file-based routing
│   └── routeTree.gen.ts # Auto-generated router configuration
├── backend/             # (Assuming standard mono-repo or paired repo setup)
│   ├── src/             # NestJS application source
│   ├── prisma/          # Prisma schema and migrations
│   └── ...
├── public/              # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* PostgreSQL instance (local or cloud)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/chronicle.git
cd chronicle
npm install
```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:3000/api

# Backend
DATABASE_URL="postgresql://user:password@localhost:5432/chronicle?schema=public"
JWT_SECRET="your-super-secret-key"
```

### Database Setup

Ensure your PostgreSQL instance is running, then initialize the database:

```bash
# Navigate to the backend or prisma directory
npx prisma generate
npx prisma db push
```

### Prisma Migration

For production or structured schema changes, use migrations:

```bash
npx prisma migrate dev --name init
```

### Running Frontend

Start the Vite development server:

```bash
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

### Running Backend

Start the NestJS development server:

```bash
# Assuming backend is in a separate directory or script
npm run start:dev
```
*The API will be available at `http://localhost:3000`.*

### Running Full Stack

If configured concurrently in a monorepo setup:

```bash
npm run dev:all
```

## Development Workflow

1. **Routing:** Add new files to `src/routes/` to automatically generate new pages via TanStack Router.
2. **Data Fetching:** Create or update hooks in `src/hooks/` utilizing React Query. Ensure data passes through the adapter layer in `src/lib/adapters/`.
3. **Components:** Build reusable components in `src/components/ui/` and feature-specific components in their respective domain folders (e.g., `src/components/media/`).

## Build Commands

Create a production-ready build of the frontend:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Testing

*(Configure testing frameworks as needed)*

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

## Deployment

Please refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for comprehensive instructions on deploying Chronicle to production environments like Vercel, Render, and Docker.

## Production Notes

* Ensure `VITE_API_BASE_URL` is set to the production backend URL.
* The frontend uses strict null-checking and adapter patterns. Do not bypass the adapter layer when connecting new API endpoints.
* Database migrations must be run before initiating a new deployment of the backend.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Designed and developed for users who love their media. 
Powered by React, NestJS, and the open-source community.
