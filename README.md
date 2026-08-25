# BRilianShop Backend

REST API untuk aplikasi e-commerce **BRilianShop** yang dibangun menggunakan Express.js, PostgreSQL, dan Sequelize ORM.

## Features

- Register, login, forgot password, dan JWT authentication
- Role authorization untuk user dan admin
- Product dan category management
- Wishlist dan shopping cart
- Checkout menggunakan transaction dan row locking
- Order history dan order management
- User profile dan address management
- Upload gambar menggunakan Cloudinary
- Admin pagination, search, dan filter
- Real-time notification menggunakan WebSocket
- Swagger API documentation
- Sequelize model validation dan connection pool
- Unit testing menggunakan Jest
- Docker support

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JSON Web Token
- bcrypt
- Cloudinary
- Multer
- WebSocket
- Swagger
- Jest
- Docker

## Installation

```bash
git clone https://github.com/muhammadwahyupratamaa/koda-b8-backendjs.git
cd koda-b8-backendjs
npm install
```

Buat file `.env`:

```env
PORT=8081

DB_HOST=localhost
DB_PORT=5432
DB_NAME=brilianshop
DB_USER=postgres
DB_PASSWORD=your_database_password

JWT_KEY=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Jalankan migration:

```bash
npx sequelize-cli db:migrate
```

Jalankan aplikasi:

```bash
npm run dev
```

Server berjalan di:

```text
http://localhost:8081
```

## API Documentation

Swagger UI:

```text
http://localhost:8081/docs
```

## Main Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login user |
| GET | `/products` | Get all products |
| GET | `/categories` | Get all categories |
| GET/POST | `/wishlist` | Manage wishlist |
| GET/POST | `/cart` | Manage shopping cart |
| POST | `/checkout` | Create order |
| GET | `/checkout/orders` | Get order history |
| GET/PUT | `/profile` | Manage user profile |
| GET/POST | `/addresses` | Manage user addresses |
| GET/POST | `/admin/products` | Manage products |
| GET | `/admin/orders` | Manage orders |

Endpoint yang dilindungi membutuhkan JWT:

```http
Authorization: Bearer <token>
```

## Testing

```bash
npm test
```

## Related Repository

Frontend: [koda-b8-react](https://github.com/muhammadwahyupratamaa/koda-b8-react)

## Author

**Muhammad Wahyu Pratama**

GitHub: [muhammadwahyupratamaa](https://github.com/muhammadwahyupratamaa)