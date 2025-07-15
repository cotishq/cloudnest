# CloudNest

CloudNest is a full-stack cloud-based file storage and sharing application. Upload, organize, star, and manage your files with a simple, responsive interface—built for modern users who need privacy, speed, and reliability.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

---

## Introduction

CloudNest is a Dropbox-inspired file management platform where users can upload files, create nested folders, share public links, and manage starred or trashed content. It’s lightweight, fast, and fully responsive.

---

## Features

- Folder-based file organization with nested structure
- File uploads with support for previews
- Star and unstar important files
- Soft delete to trash with restore option
- Public file sharing via unique links
- Search files by name
- Read-only demo mode without sign-in
- Mobile-friendly layout with dark mode support

---

## Live Demo

- Production: [https://cloudnest-navy.vercel.app](https://cloudnest-navy.vercel.app)
- Demo Mode: [https://cloudnest-navy.vercel.app/demo](https://cloudnest-navy.vercel.app/demo)

---

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui


### Backend
- Prisma ORM
- REST API Routes in Next.js
- PostgreSQL 

### Authentication & Media
- Clerk for authentication
- ImageKit for file hosting
- Zod for schema validation

### Deployment
- Vercel (CI/CD and hosting)

---

## Installation


# Clone the repository
git clone https://github.com/cotishq/cloudnest.git
cd cloudnest

# Install dependencies
npm install

# Create your environment variables
cp .env.example .env
# Fill in required keys: DATABASE_URL, CLERK keys, IMAGEKIT keys, etc.

# Push Prisma schema
npx prisma db push

# Start the development server
npm run dev


# 4. Push the Prisma schema
npx prisma db push

# 5. Start the development server
npm run dev

## Usage
- Register or sign in using Clerk

- Upload files and organize them in folders

- Toggle starred or trash status

- Share files publicly via generated links

- Access the read-only demo without authentication

## Folder Structure
.
├── app/                # App routes (dashboard, api, share, demo)
├── components/         # UI components and layouts
├── lib/                # Database, ImageKit, Clerk utilities
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets
├── package.json        # Scripts and dependencies

## Contributing
Contributions are welcome.

- Open issues for bug reports or feature suggestions

- Fork the repo and submit a pull request

- Share ideas and feedback to improve CloudNest


Built by Tanishq




