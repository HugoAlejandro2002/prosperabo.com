export const enviorment = process.env.NODE_ENV || 'development';

export const db = {
  db_url: process.env.DATABASE_URL || 'DATABASE_URL',
  shadow_db_url: process.env.SHADOW_DATABASE_URL || 'SHADOW_DATABASE_URL',
};

export const googleClient = {
  g_client_id: String(process.env.GOOGLE_CLIENT_ID) || 'GOOGLE_CLIENT_ID',
  g_client_secret: String(process.env.GOOGLE_CLIENT_SECRET) || 'GOOGLE_CLIENT_SECRET',
};

export const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'NEXTAUTH_SECRET';

export const nextAuthUrl = process.env.NEXTAUTH_URL || 'NEXTAUTH_URL';

export const resendApi = process.env.RESEND_API_KEY || 'RESEND_API_KEY';

export const bank = {
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT || 'NEXT_PUBLIC_BANK_ACCOUNT',
  name: process.env.NEXT_PUBLIC_BANK_NAME || 'NEXT_PUBLIC_BANK_NAME',
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'NEXT_PUBLIC_COMPANY_NAME',
};
// Can't change it on next.config.js
export const baseUrl = process.env.BASE_URL || 'BASE_URL';

export const apiVersion = process.env.API_VERSION || 'API_VERSION';

export const publicApiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'NEXT_PUBLIC_API_VERSION';

export const baseApiUrl = process.env.BASE_API_URL || 'BASE_API_URL';

export const publicApiUrl = process.env.NEXT_PUBLIC_API_URL || 'NEXT_PUBLIC_API_URL';

export const publicStoragePaymentUrl = process.env.NEXT_PUBLIC_STORAGE_PAYMENT_URL || 'NEXT_PUBLIC_STORAGE_PAYMENT_URL';
