npm install express mongoose dotenv bcryptjs jsonwebtoken helmet cors
npm install --save-dev nodemon


to create a secret key , run on terminal this command "node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
"


create a post request on postman to register a user
http://localhost:5000/api/auth/register
POST  - body - raw 
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "mypassword"
}

verify if you can login with same credentials 
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "mypassword"
}

create a procuct 
POST http://localhost:5000/api/products
Authorization: Bearer your_jwt_token_here
Content-Type: application/json

{
  "name": "Laptop",
  "description": "Gaming Laptop",
  "price": 1200,
  "stock": 10
}

create an order 
POST http://localhost:5000/api/orders
Authorization: Bearer your_jwt_token_here
Content-Type: application/json

{
  "userId": "your_user_id",
  "products": [
    { "productId": "your_product_id", "quantity": 2 }
  ],
  "total": 2400
}