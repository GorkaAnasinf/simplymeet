const sanitize = (value?: string) => value?.trim().replace(/\/+$/, "");

export const odooConfig = {
  url: sanitize(process.env.EXPO_PUBLIC_ODOO_URL),
  db: process.env.EXPO_PUBLIC_ODOO_DB?.trim(),
  username: process.env.EXPO_PUBLIC_ODOO_USERNAME?.trim(),
  password: process.env.EXPO_PUBLIC_ODOO_PASSWORD?.trim(),
};

export function isOdooConfigured() {
  return Boolean(odooConfig.url && odooConfig.db && odooConfig.username && odooConfig.password);
}
