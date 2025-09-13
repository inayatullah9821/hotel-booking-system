# Hotel Booking System (Node.js + MongoDB)

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

### Assumptions Made

1. Special price = hiked price (it will always be greater than the default price).

2. Stay calculation → Last day (checkout) is excluded. Price is calculated per night.

3. At the same coordinates, two hotels cannot exist. Hotels may share the same name but must have different coordinates.
   Search API Response includes:
   a. Total price

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

## Or use the deployed Swagger Docs: https://hotel-booking-system-odqd.onrender.com/api-docs

## 📦 Sample API Usage

### 1. Register User

**Request**

```http
POST /api/auth/register
Content-Type: application/json

{
	"firstName": "Amit",
	"lastName": "Sharma",
	"email": "amit@example.com",
	"password": "test123",
	"mobileNumber": "9876543210"
}
```

**Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1b...",
    "email": "amit@example.com",
    "role": "user"
  }
}
```

---

**Request**

```http
POST /api/auth/login
Content-Type: application/json

{
	"email": "amit@example.com",
	"password": "test123"
}
```

**Response**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1b...",
    "email": "amit@example.com",
    "role": "user"
  }
}
```

---

### 3. Create Hotel (Admin Only)

**Request**

```http
POST /api/hotels/create
Authorization: Bearer <admin_token>
Content-Type: application/json

{
	"name": "Taj Palace",
	"coordinates": { "latitude": 19.0760, "longitude": 72.8777 },
	"address": "Apollo Bunder, Colaba, Mumbai",
	"roomsAvailable": 20,
	"defaultPrice": 4500,
	"photos": ["https://example.com/photo1.jpg"],
	"amenities": ["WiFi", "Pool"]
}
```

**Response**

```json
{
  "message": "Hotel created successfully",
  "data": {
    "name": "Taj Palace",
    "location": { "type": "Point", "coordinates": [72.8777, 19.076] },
    "roomsAvailable": 20,
    "defaultPricePerNight": 4500
    // ...other fields
  }
}
```

---

### 4. Search Hotels

**Request**

```http
POST /api/hotels/search
Content-Type: application/json

{
    "longitude": 72.82,
    "latitude": 18.9432,
    "fromDate": "2025-09-14",
    "toDate": "2025-09-18",
    "page": 1,
    "limit": 5,
    "radius": 5000
}
```

**Response**

```json
{
    "message": "Hotels fetched successfully",
    "data": {
        "page": 1,
        "limit": 10,
        "totalHotelsCount": 1,
        "hotels": [
            {
                "_id": "68c51daa75369cc006376778",
                "name": "Marine Drive (South Mumbai)",
                "location": {
                    "coordinates": [
                        72.8258,
                        18.9432
                    ],
                    "type": "Point"
                },
                "address": "Tatva Day Spa, 67/69, Maharshi Karve Road, Navjeevan Wadi, C Ward, Zone 1, Mumbai, Maharashtra, 400020, India",
                "roomsAvailable": 2,
                "defaultPricePerNight": 500,
                "photos": [
                    "https://firstimage.com"
                ],
                "amenities": [
                    "kitchen"
                ],
                "distance": 610.6814914669166,
                "totalPrice": 4000,
                "priceByDates": {
                    "2025-09-14": 500,
                    "2025-09-15": 1500,
                    "2025-09-16": 1500,
                    "2025-09-17": 500
                }
            }
        ]
    }
}
```

---

### 5. Update Special Price (Admin Only)

**Request**

```http
POST /api/hotels/special-price/update
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "hotelId": "68c51daa75369cc006376778",
    "startDate": "2025-09-15",
    "endDate": "2025-09-16",
    "price" : 1500,
    "specialPriceReason": "this is reason for hike"
}
```

**Response**

```json
{
  "message": "Special prices updated successfully"
}
```
