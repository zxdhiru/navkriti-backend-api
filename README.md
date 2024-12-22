## 🛠️ API Endpoints

### **Auth Service**
| Endpoint               | Method | Description                          |
|------------------------|--------|--------------------------------------|
| `/auth/register`       | POST   | Create a new user.                   |
| `/auth/login`          | POST   | Login with email/phone and password. |
| `/auth/google-login`   | POST   | Login with Google OAuth.             |
| `/auth/logout`         | POST   | Logout user.                         |
| `/auth/me`             | GET    | Get logged-in user details.          |

### **Product Service**
| Endpoint                     | Method | Description                           |
|------------------------------|--------|---------------------------------------|
| `/products`                  | GET    | Fetch all products.                   |
| `/products/:id`              | GET    | Fetch single product details.         |
| `/products/:id/reviews`      | GET    | Fetch reviews for a product.          |
| `/products/:id/reviews`      | POST   | Add a review.                         |
| `/reviews/:reviewId`         | PUT    | Edit a review.                        |
| `/reviews/:reviewId`         | DELETE | Delete a review.                      |

### **Cart Service**
| Endpoint       | Method | Description                           |
|----------------|--------|---------------------------------------|
| `/cart`        | GET    | Fetch user’s cart.                   |
| `/cart`        | POST   | Add item to cart.                     |
| `/cart/:itemId`| PUT    | Update item quantity in cart.         |
| `/cart/:itemId`| DELETE | Remove item from cart.                |

### **Order Service**
| Endpoint             | Method | Description                           |
|----------------------|--------|---------------------------------------|
| `/orders`            | GET    | Fetch all user orders.               |
| `/orders/:id`        | GET    | Fetch order details.                 |
| `/orders`            | POST   | Place a new order.                   |
| `/orders/:id/cancel` | POST   | Cancel an order.                     |
| `/orders/:id/track`  | GET    | Track order status.                  |

### **Address Service**
| Endpoint          | Method | Description                           |
|-------------------|--------|---------------------------------------|
| `/addresses`      | GET    | Fetch all user addresses.            |
| `/addresses`      | POST   | Add a new address.                   |
| `/addresses/:id`  | PUT    | Edit an address.                     |
| `/addresses/:id`  | DELETE | Remove an address.                   |

### **Coupon Service**
| Endpoint               | Method | Description                           |
|------------------------|--------|---------------------------------------|
| `/coupons/validate`    | POST   | Validate and apply a coupon.         |
