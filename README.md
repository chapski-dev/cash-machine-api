# Cash Machine API

This is a simple RESTful API for a cash machine system built with Node.js, Express.js, and PostgreSQL. It allows users to register, log in, check their balance, deposit, withdraw, transfer money to other users, and view their transaction history. The API uses JWT for authentication and PostgreSQL as the database.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-repo/cash-machine-api.git
   ```

2. Install dependencies:

   ```
   cd cash-machine-api
   yarn
   ```

3. Set up environment variables: Create a `.env` file in the root directory with the following:

   ```
   DATABASE=your_database_name
   DB_USER=your_database_user
   PASSWORD=your_database_password
   HOST=your_database_host
   PORT=3000
   SALT_ROUNDS=10
   ```

4. Start the server:

   ```
   yarn start
   ```

   Or, for development with auto-restart:

   ```
   yarn dev
   ```

## Usage

### Authentication

To access protected endpoints (e.g., cash machine operations), include the JWT token in the `Authorization` header as `Bearer <token>`. Obtain the token via the `/api/auth/login` or `/api/auth/register` endpoints.

### Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in and get access/refresh tokens
- `POST /api/auth/check-email`: Check if an email is registered
- `POST /api/auth/refresh-token`: Refresh the access token
- `POST /api/auth/delete-account`: Delete account
- `GET /api/cashmachine/history`: Get transaction history (authenticated)
- `GET /api/cashmachine/balance`: Get current balance (authenticated)
- `POST /api/cashmachine/deposit`: Deposit money (authenticated)
- `POST /api/cashmachine/withdraw`: Withdraw money (authenticated)
- `POST /api/cashmachine/transfer`: Transfer money to another user (authenticated)

For detailed endpoint information, see the API documentation.

## API Documentation

The API documentation is available at the `/api-docs` endpoint, powered by Swagger UI. Start the server and visit `http://localhost:3000/api-docs` to explore the interactive documentation.

## Development

- Run in development mode:

  ```
  yarn dev
  ```

- Build the project:

  ```
  yarn build
  ```

- Start the production server:

  ```
  yarn start:prod
  ```

## Notes

- Ensure your PostgreSQL database is running and configured correctly in the `.env` file.