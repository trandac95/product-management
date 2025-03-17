# NestJS Product Management System API

## Project Overview

This is a RESTful API built with NestJS for Product Management System application. The API provides essential features such as user management, authentication, and product management with pagination, search, and sorting capabilities. The project is designed with a clear modular architecture, supports multiple languages, and is optimized with caching.

### Key Features

- **Authentication**: Login, registration, token refresh
- **User Management**: View and update profile information
- **Product Management**: CRUD operations, search, pagination, sorting
- **Internationalization**: Support for English and Vietnamese
- **Caching**: Redis implementation for performance optimization
- **Product Likes**: Feature for users to like/unlike products
- **Swagger**: Automated API documentation

## Libraries Used

| Library | Version | Description |
|---------|---------|-------------|
| NestJS | ^10.x | Node.js framework for building efficient and reliable server-side applications |
| MongoDB | ^6.x | NoSQL database |
| Mongoose | ^7.x | ODM (Object Data Modeling) for MongoDB and Node.js |
| nestjs-i18n | ^10.x | Internationalization module for NestJS |
| @nestjs/jwt | ^10.x | JWT module for authentication |
| @nestjs/passport | ^10.x | Passport module for authentication |
| @nestjs/swagger | ^7.x | Module for automatic API documentation |


## Installation and Setup

### System Requirements

- Node.js (>= 16.x)
- MongoDB (>= 5.x)
- Redis (>= 6.x)

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/trandac95/product-management.git
cd product-management
```

2. **Configure environment**

Create a `.env` file from the `.env.example`:

```bash
cp .env.example .env
```

Update the environment variables in the `.env` file:

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```


### Using Docker (optional)

1. **Run with Docker Compose**

```bash
docker-compose up -d
```

2. **Stop containers**

```bash
docker-compose down
```


## Caching Strategy

The application implements a robust caching mechanism using Redis to optimize performance and reduce database load.

### Implementation Details

1. **Cache Module Configuration**:
   - The application uses `@nestjs/cache-manager` with Redis store
   - Cache TTL (Time-To-Live) is configurable via environment variables
   - Maximum cache size is also configurable to prevent memory issues

2. **Cached Endpoints**:
   - Product listings with pagination
   - Product search results
   - Frequently accessed product details
   - Category and subcategory listings

3. **Cache Invalidation**:
   - Automatic invalidation when products are created, updated, or deleted
   - Selective invalidation for specific products or categories
   - TTL-based expiration for time-sensitive data

## Optimization Strategies

The application employs several optimization strategies to ensure high performance and scalability:

### Database Optimization

1. **Indexing**:
   - Text indexes on product names and descriptions for efficient search
   - Compound indexes for frequently queried fields
   - Sparse indexes for optional fields

2. **Query Optimization**:
   - Projection to return only necessary fields
   - Pagination to limit result size
   - Lean queries when full Mongoose documents aren't needed


## Product Like Feature

The application includes a feature allowing users to like and unlike products, with the following capabilities:

### Implementation Details

1. **Like/Unlike Functionality**:
   - Toggle-based approach (like if not liked, unlike if already liked)
   - Separate endpoint for checking like status

2. **Data Structure**:
   - Products store an array of user IDs who liked them
   - Users can retrieve their liked products list

3. **Performance Considerations**:
   - Optimized queries for like status checking
   - Cached like counts for popular products

### API Endpoints

- `POST /products/:id/like` - Like/unlike a product (toggle)
- `GET /products/:id/like-status` - Check if current user has liked a product
- `GET /users/liked-products` - Get all products liked by current user



### Key Architectural Components

1. **Base Classes**: Abstract classes that provide common functionality for controllers, services, and repositories, promoting code reuse and consistency.

2. **Module Structure**: Each feature is encapsulated in its own module with controllers, services, repositories, and DTOs, following the NestJS modular architecture.

3. **Repository Pattern**: Data access is abstracted through repositories, providing a clean separation between business logic and data access.

4. **Dependency Injection**: NestJS's dependency injection is used throughout the application for loose coupling and better testability.

5. **Middleware Pipeline**: Request processing follows a clear pipeline with guards, interceptors, and filters handling cross-cutting concerns.

## API Endpoints

The API provides the following endpoints, organized by module:

### Authentication

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|--------------|--------------|----------|
| POST | `/auth/register` | Register a new user | No | `{ email, password, name }` | `{ success, message, data: { user, tokens } }` |
| POST | `/auth/login` | Login with credentials | No | `{ email, password }` | `{ success, message, data: { user, tokens } }` |
| POST | `/auth/refresh-token` | Refresh access token | No | `{ refreshToken }` | `{ success, message, data: { accessToken, refreshToken } }` |
| POST | `/auth/logout` | Logout user | Yes | None | `{ success, message }` |
| GET | `/auth/test-i18n` | Test i18n functionality | No | None | Internationalization test data |

### Users

| Method | Endpoint | Description | Auth Required | Request Body | Response |
|--------|----------|-------------|--------------|--------------|----------|
| GET | `/users/profile` | Get current user profile | Yes | None | `{ success, message, data: User }` |
| PUT | `/users/profile` | Update user profile | Yes | `{ name, email, password }` | `{ success, message, data: User }` |
| GET | `/users/liked-products` | Get products liked by user | Yes | None | `{ success, message, data: Product[], pagination }` |

### Products

| Method | Endpoint | Description | Auth Required | Request Body/Query | Response |
|--------|----------|-------------|--------------|--------------|----------|
| GET | `/products` | Get products with pagination | No | Query: `{ page, limit, search, category, subcategory, sortBy, sortOrder }` | `{ success, message, data: Product[], pagination }` |
| GET | `/products/search` | Search products | No | Query: `{ q, page, limit }` | `{ success, message, data: Product[], pagination }` |
| GET | `/products/:id` | Get product by ID | No | None | `{ success, message, data: Product }` |
| POST | `/products` | Create new product | Yes (Admin) | `{ name, price, description, category, subcategory, images }` | `{ success, message, data: Product }` |
| PUT | `/products/:id` | Update product | Yes (Admin) | `{ name, price, description, category, subcategory, images }` | `{ success, message, data: Product }` |
| DELETE | `/products/:id` | Delete product | Yes (Admin) | None | `{ success, message }` |
| POST | `/products/:id/like` | Like/unlike product | Yes | None | `{ success, message, data: { liked: boolean } }` |
| GET | `/products/:id/like-status` | Check if user liked product | Yes | None | `{ success, message, data: { liked: boolean } }` |

### Swagger Documentation

Complete API documentation is available via Swagger UI at `/api/docs` when the application is running.

## Internationalization (i18n)

The application supports multiple languages through the nestjs-i18n package, providing a seamless experience for users in different locales.

### Supported Languages

- English (`en`) - Default language
- Vietnamese (`vi`)

### Implementation Details

1. **Configuration**:
   The i18n module is configured in `app.module.ts`:

   ```typescript
   I18nModule.forRootAsync({
     loader: I18nJsonLoader,
     inject: [ConfigService],
     resolvers: [new HeaderResolver(['x-custom-lang'])],
     useFactory: (configService: ConfigService) => ({
       fallbackLanguage: configService.get<string>('app.fallbackLanguage'),
       loaderOptions: {
         path: path.join(__dirname, 'i18n/'),
         watch: true,
       },
     }),
   })
   ```

2. **Translation Files**:
   Translations are stored in JSON files organized by module and language:

   ```
   src/i18n/
   ├── en/
   │   ├── auth.json
   │   ├── common.json
   │   ├── product.json
   │   └── user.json
   └── vi/
       ├── auth.json
       ├── common.json
       ├── product.json
       └── user.json
   ```

3. **Usage in Controllers**:
   Translations can be accessed in controllers using the I18nService or I18nContext:

   ```typescript
   // Using I18nService
   constructor(private readonly i18nService: I18nService) {}
   
   async someMethod() {
     return {
       message: this.i18nService.translate('product.SUCCESS.CREATED')
     };
   }
   
   // Using I18nContext
   @Get()
   async someEndpoint(@I18n() i18n: I18nContext) {
     return {
       message: i18n.t('product.SUCCESS.RETRIEVED')
     };
   }
   ```

4. **Language Selection**:
   The application determines the language to use through:
   - The `x-custom-lang` header in API requests
   - Fallback to the default language if not specified

5. **Error Messages**:
   Error messages are also internationalized through the I18nExceptionFilter:

   ```typescript
   throw new BadRequestException('product.ERROR.NOT_FOUND');
   ```

6. **Testing i18n**:
   A test endpoint is available at `/auth/test-i18n` to verify i18n functionality.

### Example Translation Files

**English (en/product.json)**:
```json
{
  "SUCCESS": {
    "CREATED": "Product created successfully",
    "RETRIEVED": "Products retrieved successfully",
    "UPDATED": "Product updated successfully",
    "DELETED": "Product deleted successfully",
    "LIKED": "Product liked successfully",
    "UNLIKED": "Product unliked successfully"
  },
  "ERROR": {
    "NOT_FOUND": "Product not found",
    "INVALID_ID": "Invalid product ID",
    "UNAUTHORIZED": "You must be logged in to perform this action"
  }
}
```

**Vietnamese (vi/product.json)**:
```json
{
  "SUCCESS": {
    "CREATED": "Tạo sản phẩm thành công",
    "RETRIEVED": "Lấy danh sách sản phẩm thành công",
    "UPDATED": "Cập nhật sản phẩm thành công",
    "DELETED": "Xóa sản phẩm thành công",
    "LIKED": "Đã thích sản phẩm",
    "UNLIKED": "Đã bỏ thích sản phẩm"
  },
  "ERROR": {
    "NOT_FOUND": "Không tìm thấy sản phẩm",
    "INVALID_ID": "ID sản phẩm không hợp lệ",
    "UNAUTHORIZED": "Bạn phải đăng nhập để thực hiện hành động này"
  }
}
```

### Using i18n in API Requests

To specify the language in API requests, include the `x-custom-lang` header:

```bash
# English (default)
curl -X GET http://localhost:3000/api/products

# Vietnamese
curl -X GET http://localhost:3000/api/products -H "x-custom-lang: vi"
```