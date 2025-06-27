#cotel-back

Backend for the Cotel lending platform, built with Node.js, Express, and JSON Server.

## Installation
1. Clone the repository.
2. Install dependencies: npm install.
3. Create a .env file with the PORT and INITIAL_BANK_CAPITAL variables.
4. Start the server: npm start.

## Endpoints
- **POST /api/users**: Create a new user and loan request.
- **GET /api/users**: List all users.
- **GET /api/loans**: List all loans.
- **PATCH /api/loans/:id**: Pay a loan.
- **GET /api/bank**: Get the bank's capital.
- **PATCH /api/bank**: Update the bank's capital.