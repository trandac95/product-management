# Product Management App

A modern web application for managing products with features like product listing, search, and like functionality.

## Features

- Display products in a card view
- Infinite scrolling for product loading
- Search functionality
- Product addition (for authenticated users)
- Like feature with optimistic UI updates
- Authentication system (login/register)
- Responsive design

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- TanStack Query for data fetching and caching
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <https://github.com/trandac95/product-management.git>
cd product-management/client
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Replace the URL with your actual API endpoint.

### Running the Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

The application expects the following API endpoints:

- `GET /products?page=1&limit=10` - Get paginated products
- `GET /products/search?q=query&page=1&limit=10` - Search products
- `POST /products` - Add a new product
- `POST /products/:id/like` - Like a product
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /users/profile` - Get current user info

## License



MIT
