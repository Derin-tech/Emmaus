-- Phase 1: Secure Authentication & Identity Pipeline
-- PostgreSQL Database Schema

-- Create Enum type for account status
CREATE TYPE account_status_enum AS ENUM ('pending', 'active');

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    cet_email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    otp_hash VARCHAR(255),
    otp_expiry TIMESTAMP WITH TIME ZONE,
    account_status account_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on cet_email for fast lookup during Primary Auth
CREATE INDEX IF NOT EXISTS idx_users_cet_email ON users(cet_email);

-- Create index on phone_number for lookup during Secondary Auth / OTP verification
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
