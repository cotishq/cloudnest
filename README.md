# 🌩️ CloudNest – File Storage & Sharing App

CloudNest is a full-stack, cloud-based file storage and sharing application inspired by Dropbox. Users can securely upload, organize, star, and manage files inside nested folders with a clean modern UI.

> 🚀 Live: [https://cloudnest-navy.vercel.app](https://cloudnest-navy.vercel.app)  
> ✨ Try Demo (Read-Only): [https://cloudnest-navy.vercel.app/demo](https://cloudnest-navy.vercel.app/demo)

---

## 📦 Features

### ✅ Core Functionality
- 📁 Create folders and nested directory structures
- ⬆️ Upload files of any type with preview thumbnails
- 🔁 Navigate inside folders and backtrack the folder path
- ⭐ Star important files
- 🗑️ Soft delete files to Trash and restore them anytime

### 🧩 Sharing & Permissions
- 🔗 Generate public shareable links for files
- 🧪 `/demo` route for public read-only preview

### 🧠 UI/UX
- 🎯 Clean, responsive UI built with `shadcn/ui` and Tailwind CSS
- 🔍 Search files by name
- 💡 Skeleton loaders and toast notifications

### 🔐 Authentication
- 🧑‍💻 Clerk integration for secure sign-in and sign-up
- 👤 User-specific file access and isolation

---

## 🛠️ Tech Stack

| Frontend           | Backend             | Database     | Storage    | Auth     | Deployment |
|--------------------|---------------------|--------------|------------|----------|------------|
| Next.js 14 (AppDir)| API Routes (REST)   | PostgreSQL   | ImageKit   | Clerk    | Vercel     |
| Tailwind CSS       | Prisma ORM          | PlanetScale  | (Optional) | JWT Auth |            |
| shadcn/ui          | React Hook Form + Zod|              |            |          |            |

---

## ⚙️ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/cloudnest.git
cd cloudnest

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Add your DATABASE_URL, IMAGEKIT keys, and CLERK keys

# 4. Push the Prisma schema
npx prisma db push

# 5. Start the development server
npm run dev
