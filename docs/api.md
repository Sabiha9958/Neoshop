# NeoShop API Documentation v1.0.0

![NeoShop API](https://img.shields.io/badge/NeoShop-API%20v1.0.0-00f5ff?style=for-the-badge&logo=api)

## 🚀 Overview

Welcome to the NeoShop API - a futuristic e-commerce platform built for the cyber age. This RESTful API provides comprehensive endpoints for managing products, users, orders, and administrative functions.

## 🌐 Base Configuration

### Base URL
Development: http://localhost:5000/api
Production: https://api.neoshop.com/api

### API Version
Current Version: `v1.0.0`

### Content Type
All requests and responses use `application/json` content type.

### Rate Limiting
- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Admin endpoints**: 200 requests per 15 minutes per IP

## 🔐 Authentication

### Authentication Methods
NeoShop API uses JWT (JSON Web Token) based authentication.

### Headers Required
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

### Token Lifecycle
- **Expiration**: 7 days
- **Refresh**: Automatic refresh on valid requests
- **Storage**: Client-side (localStorage/sessionStorage)

---

## 📋 API Endpoints

### 🔑 Authentication Endpoints

#### **POST** `/auth/register`
Create a new user account.

**Request Body:**
{
"name": "John Doe",
"email": "john@example.com",
"password": "securePassword123"
}

**Validation Rules:**
- `name`: 2-50 characters, required
- `email`: Valid email format, unique, required
- `password`: Minimum 6 characters, required

**Response (201):**
{
"success": true,
"message": "User registered successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "64a7b8c9d12e3f4567890123",
"name": "John Doe",
"email": "john@example.com",
"role": "user",
"preferences": {
"theme": "dark",
"currency": "INR",
"language": "en"
}
}
}

#### **POST** `/auth/login`
Authenticate existing user.

**Request Body:**
{
"email": "john@example.com",
"password": "securePassword123"
}

**Response (200):**
{
"success": true,
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "64a7b8c9d12e3f4567890123",
"name": "John Doe",
"email": "john@example.com",
"role": "user",
"lastLogin": "2024-01-15T10:30:00.000Z"
}
}

#### **GET** `/auth/me` 🔒
Get current authenticated user profile.

**Headers Required:** `Authorization: Bearer <token>`

**Response (200):**






