import fs from 'fs';
import path from 'path';

export type AccountStatus = 'pending' | 'active';

export interface DBUser {
  id: string;
  cet_email: string;
  phone_number: string | null;
  otp_hash: string | null;
  otp_expiry: string | null; // ISO timestamp
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readUsers(): DBUser[] {
  try {
    ensureDB();
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DBUser[];
  } catch (error) {
    console.error('Error reading users DB:', error);
    return [];
  }
}

function writeUsers(users: DBUser[]): void {
  try {
    ensureDB();
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users DB:', error);
  }
}

export const db = {
  getUserByEmail(cet_email: string): DBUser | null {
    const users = readUsers();
    return users.find(u => u.cet_email.toLowerCase() === cet_email.toLowerCase()) || null;
  },

  getUserById(id: string): DBUser | null {
    const users = readUsers();
    return users.find(u => u.id === id) || null;
  },

  createUser(cet_email: string): DBUser {
    const users = readUsers();
    const existing = users.find(u => u.cet_email.toLowerCase() === cet_email.toLowerCase());
    if (existing) return existing;

    const newUser: DBUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      cet_email: cet_email.toLowerCase(),
      phone_number: null,
      otp_hash: null,
      otp_expiry: null,
      account_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);
    return newUser;
  },

  updateUserOtp(id: string, phone_number: string, otp_hash: string, otp_expiry: string): DBUser | null {
    const users = readUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      phone_number,
      otp_hash,
      otp_expiry,
      updated_at: new Date().toISOString(),
    };
    writeUsers(users);
    return users[index];
  },

  activateUser(id: string): DBUser | null {
    const users = readUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      account_status: 'active',
      updated_at: new Date().toISOString(),
    };
    writeUsers(users);
    return users[index];
  },
};
