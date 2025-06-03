# Car Dealership API

A RESTful API for a car dealership system built with Express.js, TypeScript, and MongoDB.

## Features

- User Authentication (Admin, Manager, Customer)
- Car Management
- Category Management
- Purchase Management
- Role-based Access Control
- Input Validation
- Error Handling
- MongoDB Integration
- TypeScript Support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd car-dealership-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/car-dealership
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Build the project:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

For development with hot-reload:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register/customer` - Register a new customer
- `POST /api/auth/register/manager` - Register a new manager (Admin only)
- `POST /api/auth/login/customer` - Customer login
- `POST /api/auth/login/manager` - Manager login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### Cars

- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create a new car (Admin/Manager only)
- `GET /api/cars/:id` - Get car by ID
- `PUT /api/cars/:id` - Update car (Admin/Manager only)
- `DELETE /api/cars/:id` - Delete car (Admin/Manager only)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (Admin/Manager only)
- `GET /api/categories/:id` - Get category by ID
- `PUT /api/categories/:id` - Update category (Admin/Manager only)
- `DELETE /api/categories/:id` - Delete category (Admin/Manager only)

### Purchases

- `POST /api/purchases` - Create a new purchase (Customer only)
- `GET /api/purchases/my-purchases` - Get customer's purchases
- `GET /api/purchases` - Get all purchases (Admin/Manager only)
- `GET /api/purchases/:id` - Get purchase by ID (Admin/Manager only)

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── enums/         # TypeScript enums
├── interfaces/    # TypeScript interfaces
├── middleware/    # Custom middleware
├── models/        # Mongoose models
├── routes/        # API routes
├── schemas/       # Mongoose schemas and validation
├── services/      # Business logic
├── utils/         # Utility functions
└── app.ts         # Express app setup
```

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server with hot-reload
- `npm run build` - Build the TypeScript code
- `npm run seed:admin` - Seed the admin user

## Error Handling

The API uses a centralized error handling mechanism. All errors are caught and formatted appropriately before being sent to the client.

## Validation

Input validation is handled using Zod schemas. All incoming requests are validated against predefined schemas before being processed.

## Authentication

JWT (JSON Web Tokens) are used for authentication. Protected routes require a valid JWT token in the Authorization header.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
