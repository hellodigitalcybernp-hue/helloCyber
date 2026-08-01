# HelloDigitalCyber

A full website for a local digital service center — CV writing, NID form fill-up,
ward/union document support, passport form fill-up, and other digital services —
built with **Node.js, Express and MongoDB**. Every piece of content (services,
prices, requirements, homepage text, contact info, and customer requests) is
managed from a built-in **Admin Panel** — no code changes needed to update the site.

## Features

**Public website**
- Home page (hero, featured services, "how it works", call-to-action)
- Services page with category filters
- Service detail page showing price, duration, requirements checklist, and a
  request form (visitors submit their name/phone/notes to request a service)
- About page and Contact page (with a contact form)
- Fully responsive, custom-designed (no template look), zero external icon
  dependency (inline SVG icons)

**Admin Panel** (`/admin`)
- Secure login (hashed passwords via bcrypt, session-based auth)
- Dashboard with live stats (services, active services, requests, new requests)
- **Services**: add / edit / delete / activate-deactivate, upload an image,
  set price, duration, category, icon, requirements checklist, featured flag,
  and display order
- **Requests & Messages**: view every service request and contact form
  submission, update its status (New / In Progress / Completed / Cancelled),
  or delete it
- **Site Settings**: edit the homepage hero title/subtitle, About text, and
  all contact details (phone, WhatsApp, email, address, opening hours, map
  embed) — all reflected instantly on the live site
- **My Account**: change admin display name, username, and password

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- EJS templates + `express-ejs-layouts`
- `express-session` + `connect-mongo` (sessions stored in MongoDB)
- `bcryptjs` for password hashing
- `multer` for service image uploads
- `method-override` for PUT/DELETE forms
- `connect-flash` for one-time success/error messages

No frontend framework/build step is required — everything is server-rendered.

## Project Structure

```
hellodigitalcyber/
├── config/db.js               MongoDB connection
├── middleware/
│   ├── auth.js                requireAdmin / redirectIfLoggedIn guards
│   └── upload.js               multer config for service images
├── models/
│   ├── Admin.js
│   ├── Service.js
│   ├── Message.js              (requests / contact submissions)
│   └── Setting.js              (singleton, editable site content)
├── routes/
│   ├── public.js                home/services/about/contact
│   └── admin.js                 login, dashboard, CRUD, settings
├── utils/icons.js               inline SVG icon set
├── views/                       EJS templates (public + admin)
├── public/
│   ├── css/style.css            public site design
│   ├── css/admin.css            admin panel design
│   ├── js/main.js
│   └── uploads/services/        uploaded service images
├── seed.js                       creates default admin + sample services
├── server.js                     app entry point
└── .env.example
```

## Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- A running MongoDB instance (local `mongod`, or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Install dependencies
```bash
cd hellodigitalcyber
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env` and edit the values:
```bash
cp .env.example .env
```
```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/hellodigitalcyber
SESSION_SECRET=change-this-to-a-long-random-secret
SITE_NAME=HelloDigitalCyber
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@12345
```
> Change `SESSION_SECRET` and `ADMIN_PASSWORD` before going live.

### 4. Seed the database
Creates the default admin account, default site settings, and 8 sample
services (CV writing, NID correction, ward document, passport form fill-up,
birth/death registration, online form fill-up, photocopy/print, photo editing):
```bash
npm run seed
```

### 5. Run the server
```bash
npm start
# or, for auto-restart on file changes:
npm run dev
```
Visit:
- Website: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login
  (login with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` from your `.env`)

## Managing Content

Everything below is done from the Admin Panel — **no code editing required**:

| To change...                              | Go to                        |
|--------------------------------------------|-------------------------------|
| Add/edit/remove a service, price, image    | Admin → Services              |
| View/respond to customer requests          | Admin → Requests & Messages   |
| Homepage headline, About text              | Admin → Site Settings         |
| Phone, WhatsApp, email, address, map       | Admin → Site Settings         |
| Admin username/password                    | Admin → My Account            |

## Notes for Production

- Set `NODE_ENV=production` and put the app behind a reverse proxy (Nginx) with HTTPS.
- Set `cookie.secure = true` in `server.js`'s session config once served over HTTPS.
- Use a strong, unique `SESSION_SECRET` and admin password.
- Consider adding rate-limiting (e.g. `express-rate-limit`) on `/admin/login` and
  the public request/contact forms.
- Back up the `public/uploads/services` folder along with your MongoDB database.
