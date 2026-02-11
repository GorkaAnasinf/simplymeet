import { odooConfig, isOdooConfigured } from "./odooConfig";
import { OdooEmployee, OdooMeeting } from "./types";

type JsonRpcResponse<T> = {
  result?: T;
  error?: {
    message?: string;
    data?: { message?: string };
  };
};

let requestId = 1;
const RPC_TIMEOUT_MS = 15000;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toOdooDatetime(date: Date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  // Odoo espera datetime "naive" sin zona horaria.
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function callJsonRpc<T>(params: Record<string, unknown>) {
  if (!isOdooConfigured()) {
    throw new Error("Configura EXPO_PUBLIC_ODOO_URL, DB, USERNAME y PASSWORD.");
  }

  const endpoint = `${odooConfig.url}/jsonrpc`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params,
        id: requestId++,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Tiempo de espera agotado al consultar Odoo. Intenta de nuevo.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Odoo devolvio HTTP ${response.status}.`);
  }

  const data = (await response.json()) as JsonRpcResponse<T>;
  if (data.error) {
    throw new Error(data.error.data?.message || data.error.message || "Error desconocido de Odoo.");
  }

  if (!data.result) {
    throw new Error("Respuesta vacia de Odoo.");
  }

  return data.result;
}

async function authenticate() {
  const uid = await callJsonRpc<number>({
    service: "common",
    method: "authenticate",
    args: [odooConfig.db, odooConfig.username, odooConfig.password, {}],
  });

  if (!uid) {
    throw new Error("No se pudo autenticar contra Odoo.");
  }

  return uid;
}

async function executeKw<T>(uid: number, model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}) {
  return callJsonRpc<T>({
    service: "object",
    method: "execute_kw",
    args: [odooConfig.db, uid, odooConfig.password, model, method, args, kwargs],
  });
}

type RawEmployee = {
  id: number;
  name: string;
  work_email?: string;
  image_128?: string | false;
  user_id?: [number, string] | false;
};

type RawMeeting = {
  id: number;
  name: string;
  start: string;
  stop: string;
  user_id?: [number, string] | false;
  partner_ids?: number[];
  location?: string | false;
  videocall_location?: string | false;
  description?: string | false;
};

type RawPartner = {
  id: number;
  name: string;
};

export async function checkOdooConnection() {
  await authenticate();
  return true;
}

export async function listEmployees() {
  const uid = await authenticate();
  const rows = await executeKw<RawEmployee[]>(
    uid,
    "hr.employee",
    "search_read",
    [[["user_id", "!=", false]]],
    {
      fields: ["id", "name", "work_email", "image_128", "user_id"],
      order: "name asc",
      limit: 200,
    }
  );

  return rows.map<OdooEmployee>((row) => ({
    id: row.id,
    name: row.name,
    workEmail: row.work_email || undefined,
    image128: row.image_128 || undefined,
    userId: row.user_id ? row.user_id[0] : undefined,
  }));
}

export async function listMeetingsForDay(userId: number, day: Date) {
  const uid = await authenticate();

  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(day);
  end.setHours(23, 59, 59, 0);

  const rows = await executeKw<RawMeeting[]>(
    uid,
    "calendar.event",
    "search_read",
    [[["user_id", "=", userId], ["start", ">=", toOdooDatetime(start)], ["start", "<=", toOdooDatetime(end)]]],
    {
      fields: ["id", "name", "start", "stop", "user_id", "partner_ids", "location", "videocall_location", "description"],
      order: "start asc",
      limit: 200,
    }
  );

  const partnerIds = Array.from(new Set(rows.flatMap((row) => row.partner_ids ?? [])));
  let partnerMap = new Map<number, string>();

  if (partnerIds.length > 0) {
    const partners = await executeKw<RawPartner[]>(
      uid,
      "res.partner",
      "search_read",
      [[["id", "in", partnerIds]]],
      {
        fields: ["id", "name"],
        limit: 500,
      }
    );
    partnerMap = new Map(partners.map((partner) => [partner.id, partner.name]));
  }

  return rows.map<OdooMeeting>((row) => ({
    id: row.id,
    title: row.name,
    start: row.start,
    end: row.stop,
    organizer: row.user_id ? row.user_id[1] : undefined,
    attendees: (row.partner_ids ?? []).map((partnerId) => partnerMap.get(partnerId)).filter((name): name is string => Boolean(name)),
    meetingUrl: row.videocall_location || undefined,
    location: row.location || undefined,
    description: row.description || undefined,
  }));
}
