# 🚗 RentalCar — Premium Full-Stack Car Rental Platform

RentalCar is a modern, state-of-the-art full-stack web application designed for renting cars, managing partner fleets, and handling admin operations. Built on the robust **MERN stack (MongoDB, Express, React, Node.js)**, the platform features responsive dashboards, interactive maps, secure identity verification uploads, inline real-time input validations, and theme-adaptive analytics visualizations.

---

## 📸 Key Features

### 👤 Customer Features
* **Interactive Geocoding Map**: Browse available cars dynamically scatter-mapped with Leaflet based on their locations.
* **Streamlined Booking & Checkout**: Complete bookings with strict validation for driving license details, identity documents, and emergency contacts.
* **Responsive Profile Dashboard**: Easy access to profile details and reservation logs with dynamic side drawer navigation menus.

### 💼 Owner Features
* **Fleet Management**: Add, update, and manage rental cars with details such as category, fuel type, description, and pricing.
* **Earnings & Booking Analytics**: Interactive Area and Pie charts to track monthly revenues and booking distribution.
* **Booking Approval Flow**: Manage pending client bookings and update booking statuses.

### 🛡️ Admin Features
* **Global Overview Panel**: Track total system users, partners, revenue, and active listings.
* **Visual Insights**: Monitor user registration metrics and car category distribution.
* **Verification & Security Management**: Moderate partner listings and system users.

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Core**: React 18, Vite (Fast Hot Module Replacement)
* **Styling**: Tailwind CSS for responsive and premium layout design.
* **Charts & Analytics**: Recharts (fully customized to support theme-adaptive, high-contrast tooltips in both Light & Dark modes).
* **Maps**: Leaflet & OpenStreetMap for smooth interactive pin-mapping.
* **Icons**: Material UI Icons (MUI).

### Backend (Server)
* **Runtime & Framework**: Node.js & Express
* **Database**: MongoDB (Object data modeling via Mongoose)
* **File Uploads**: Multer (configured with strict file size/format filters and automatic temp file deletion to prevent resource leaks).
* **Communication**: Nodemailer for automated booking state notifications and OTP confirmations.
* **Hosting Configuration**: Deployment ready via `vercel.json` for Serverless deployments.

---

## 📁 Project Structure

```bash
RentalCar/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/        # Media assets & SVG graphics
│   │   ├── components/    # Reusable components (Navbar, InteractiveMap, etc.)
│   │   ├── context/       # Global AppContext state providers
│   │   └── pages/         # Page Views (Car Details, Auth, Dashboards)
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── server/                 # Express Backend
    ├── configs/            # Database and nodemailer configurations
    ├── controllers/        # Business logic controllers
    ├── middleware/         # Auth, Upload, and Request filters
    ├── models/             # Mongoose schemas (User, Car, Booking)
    ├── routes/             # API Router endpoints
    ├── uploads/            # Temporary upload storage
    └── server.js           # Server bootstrap entry point
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB (Local Instance or Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanay09876/RentalCar.git
   cd RentalCar
   ```

2. **Configure Environment Variables:**

   * In `client/.env`:
     ```env
     VITE_BACKEND_URL=http://localhost:4000
     ```

   * In `server/.env`:
     ```env
     PORT=4000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     EMAIL_USER=your_email_for_mailer
     EMAIL_PASS=your_email_app_password
     ```

3. **Install Dependencies & Start the Backend:**
   ```bash
   cd server
   npm install
   npm start
   ```

4. **Install Dependencies & Start the Frontend:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 🛡️ Key Security & Validation Implementations

* **Inline Client-Side Validation**: Visual warnings rendered inline below fields dynamically (e.g. 10-digit phone verification, date boundaries check, etc.).
* **Backend Upload Security**: Strict MIME-type validations (PDF, JPEG, PNG, WEBP) capped at 5MB.
* **Auto Cleanup**: Server unlinks all intermediate multipart uploads on successful or failed booking responses, resolving filesystem degradation issues.
* **Dark Mode Tooltips**: High-contrast tooltip elements customized with CSS custom properties (`var(--color-bg)` / `var(--color-text)`) that display beautifully across system theme toggles.
