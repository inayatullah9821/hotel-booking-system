#  Hotel Booking System (Node.js + MongoDB)

A headless API for managing hotels, pricing, and bookings with support for special day pricing.  
Built using **Node.js**, **Express**, **MongoDB**, and **GeoJSON** for location-based hotel search.

Deployed link: [https://hotel-booking-system-odqd.onrender.com/](https://hotel-booking-system-odqd.onrender.com/)  
Swagger Docs: [https://hotel-booking-system-odqd.onrender.com/api-docs](https://hotel-booking-system-odqd.onrender.com/api-docs)

---

## ⚙️ Technologies Used
- **Node.js** (Express.js framework)
- **MongoDB** with **Mongoose ODM**
- **GeoCoding** for real coordinate-based hotel search/creation - reverse co ordinate checking
- **Swagger** (API documentation & testing)
- **Postman** (optional testing)

---

## 🚀 Local Setup Guide

1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/hotel-booking-system.git
cd hotel-booking-system
```
2️⃣ Install dependencies
```bash
npm install
```
3️⃣ Setup environment variables
Create a .env file in the root directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=somesecreat
JWT_EXPIRE=1d
SWAGGER_URL=/api-docs
DEFAULT_ADMIN_EMAIL=superadmin@schbang.com
ADMIN_PASSWORD=superAdmin@321
GEOCODE_API_KEY=68c3f842c3267988477712hgnc...
```
4️⃣ Access API

Swagger Docs: http://localhost:5000/api-docs

Or test using Postman

###  Assumptions Made
1. Special price = hiked price (it will always be greater than the default price).

2. Stay calculation → Last day (checkout) is excluded. Price is calculated per night.

3. At the same coordinates, two hotels cannot exist. Hotels may share the same name but must have different coordinates.
Search API Response includes:
a. Total price
b. Date-wise price breakdown

4. Only valid coordinates are accepted for hotel creation/search.

📂 Project Structure
```
hotel-booking-system/
│── src/
│   ├── config/        # DB & environment configs
│   ├── controllers/   # Response control
│   ├── services/   # Business logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routes
│   ├── middlewares/   # Auth, validation
│   ├── utils/         # Helpers
│── .env               # Environment variables
│── package.json
│── app.js
│── server.js
│── README.md

```
🧪 Testing

Run locally using Swagger: http://localhost:5000/api-docs

Or use the deployed Swagger Docs: https://hotel-booking-system-odqd.onrender.com/api-docs
