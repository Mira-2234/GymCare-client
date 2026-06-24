# GymCare — Fitness & Gym Management Platform

GymCare is a full-stack fitness and gym management platform that connects **members**, **trainers**, and **admins** in one place. Members can discover and book fitness classes, join community discussions, and track their fitness journey. Trainers can publish classes, manage attendees, and share knowledge on the forum. Admins oversee the entire platform — users, classes, trainer applications, and community moderation.

---

## 🔗 Live Project

| Resource | Link |
|---|---|
| 🌐 Live Site | https://gym-care-client.vercel.app/|


---

## 📌 Purpose

GymCare was built to simulate a real-world, role-based fitness platform where three types of users — **Member, Trainer, and Admin** — each get a tailored dashboard and permission set. The project focuses on secure authentication, role-based access control, real-world payment integration, and a polished, fully responsive UI.

---

## ✨ Key Features

###  Member (User)
- Register/login with email-password or Google (via Better Auth).
- Browse, search, and filter approved fitness classes.
- View full class details and book a class via **Stripe** checkout.
- Add/remove classes from a personal **Favorites** list.
- Read, like/dislike, and comment on Community Forum posts.
- Apply to become a Trainer and track application status (Pending / Approved / Rejected) with admin feedback.
- Personal dashboard with booking & favorites statistics.

### Trainer
- Create, update, and delete their own fitness classes (auto-set to `Pending` until admin approval).
- View a list of attendees who booked each of their classes.
- Publish posts to the Community Forum.
- Manage their own forum posts.
- Dashboard overview with total classes created & total students enrolled.

###  Admin
- Manage all users — block/unblock and promote to Admin.
- Approve or reject trainer applications with feedback; demote trainers back to Users.
- Approve, reject, or delete submitted classes.
- Moderate the Community Forum (delete any post).
- View a read-only table of all Stripe transactions.
- Dashboard overview with platform-wide statistics and **Recharts** analytics (classes by category, users by role).

### 🔔 Notifications & Extras
- **In-app notification system** — users are notified the moment their trainer application is approved or rejected, with admin feedback included for rejections.
- **Dark / Light theme toggle** across the entire site.
- **JWT authentication** with HTTPOnly cookies, separate from the Better Auth session, used to protect role-sensitive dashboard APIs.
- **Soft-block system** — blocked users can still browse the platform but are prevented from booking, commenting, or applying as a trainer.
- Server-side **pagination** on the Community Forum and All Classes pages.
- Server-side **search** (`$regex`) and **category filtering** (`$in`) on the All Classes page.
- Fully responsive design across mobile, tablet, and desktop.

---

## 🧰 Tech Stack

**Frontend**
- Next.js (App Router)
- Tailwind CSS
- HeroUI
- Framer Motion (animations)
- Recharts (admin analytics)
- Better Auth (client)

**Backend**
- Node.js & Express.js
- MongoDB (native driver)
- JWT (`jsonwebtoken`) — HTTPOnly cookie-based auth for protected routes
- Stripe — payment processing
- `cors`, `cookie-parser`, `dotenv`

---

## 📦 Notable npm Packages

| Package | Purpose |
|---|---|
| `express` | Backend server & routing |
| `mongodb` | Database driver |
| `stripe` | Payment checkout & verification |
| `jsonwebtoken` | JWT generation & verification |
| `cookie-parser` | Reading HTTPOnly auth cookies |
| `cors` | Cross-origin request handling |
| `dotenv` | Environment variable management |
| `framer-motion` | UI animations |
| `recharts` | Admin dashboard charts |
| `@heroui/react` | UI components |
| `better-auth` | Authentication (credentials + Google) |

---

## 🔐 Environment Variables

**Server (`.env`)**
```
PORT=
MONGO_DB_URI=
JWT_SECRET=
STRIPE_SECRET=
CLIENT_URL=
NODE_ENV=
```

**Client (`.env.local`)**
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

> All sensitive keys (MongoDB URI, JWT secret, Stripe keys) are secured via environment variables and are never committed to the repository.

---

## 🗂️ Core Collections (MongoDB)

| Collection | Purpose |
|---|---|
| `user` | User accounts, roles (`user` / `trainer` / `admin`), and status |
| `classes` | Fitness classes with approval status & booking count |
| `bookings` | Paid class bookings (linked to Stripe transactions) |
| `favorites` | User-saved favorite classes |
| `forumPosts` | Community forum posts |
| `comments` | Comments on forum posts |
| `trainerApplications` | Trainer application requests & status |
| `notifications` | In-app notifications (e.g. trainer approval/rejection) |

---

## 🚀 Getting Started Locally

```bash
# Clone both repos
git clone <server-repo-url>
git clone <client-repo-url>

# Server
cd server
npm install
npm run dev   # or: node index.js

# Client
cd client
npm install
npm run dev
```

Make sure both `.env` files above are configured before running.

---

## 📄 License

This project was built for educational/assessment purposes.
