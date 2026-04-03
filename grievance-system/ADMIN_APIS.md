# Admin API Reference

## Authentication
- **POST** `/api/auth/login` – Login (returns token, name, email, role)
- **POST** `/api/auth/send-otp` – Send OTP for registration `{ "email": "..." }`
- **POST** `/api/auth/register` – Register with OTP `{ "name", "email", "password", "phone?", "otp" }`

## Admin Endpoints (require ADMIN role, Bearer token)

### Complaints
- **GET** `/api/complaints/all` – List all complaints
- **PUT** `/api/complaints/{id}/status` – Update complaint status  
  Body: `{ "status": "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED", "remarks": "..." }`

### Departments
- **GET** `/api/departments` – List departments
- **POST** `/api/departments` – Create department  
  Body: `{ "name": "...", "description": "..." }`

## Admin Login
- **Email:** admin@jansamadhan.ai  
- **Password:** Admin@123  

The admin user is created automatically on first backend startup if it does not exist.
