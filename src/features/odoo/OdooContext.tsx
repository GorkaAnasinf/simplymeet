import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { checkOdooConnection, listEmployees, listMeetingsForDay } from "./odooClient";
import { isOdooConfigured } from "./odooConfig";
import { OdooEmployee, OdooMeeting } from "./types";

const STORAGE_KEY = "simplymeet.selected_employee";

type OdooContextValue = {
  configured: boolean;
  selectedEmployee: OdooEmployee | null;
  employees: OdooEmployee[];
  employeesLoading: boolean;
  employeesError: string | null;
  checkDatabaseConnection: () => Promise<boolean>;
  loadEmployees: () => Promise<void>;
  selectEmployee: (employee: OdooEmployee) => Promise<void>;
  clearSelectedEmployee: () => Promise<void>;
  getMeetingsForDay: (day: Date) => Promise<OdooMeeting[]>;
};

const OdooContext = createContext<OdooContextValue | undefined>(undefined);

export function OdooProvider({ children }: PropsWithChildren) {
  const [selectedEmployee, setSelectedEmployee] = useState<OdooEmployee | null>(null);
  const [employees, setEmployees] = useState<OdooEmployee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const configured = isOdooConfigured();

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted || !raw) return;
        setSelectedEmployee(JSON.parse(raw) as OdooEmployee);
      })
      .catch(() => {
        if (mounted) setSelectedEmployee(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const checkDatabaseConnection = useCallback(async () => {
    if (!configured) return false;
    try {
      await checkOdooConnection();
      return true;
    } catch {
      return false;
    }
  }, [configured]);

  const loadEmployees = useCallback(async () => {
    if (!configured) {
      setEmployees([]);
      setEmployeesError("Falta configuracion de Odoo en variables de entorno.");
      return;
    }

    setEmployeesLoading(true);
    setEmployeesError(null);

    try {
      const rows = await listEmployees();
      setEmployees(rows);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo cargar la lista de empleados.";
      setEmployeesError(message);
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  }, [configured]);

  const selectEmployee = useCallback(async (employee: OdooEmployee) => {
    setSelectedEmployee(employee);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(employee));
  }, []);

  const clearSelectedEmployee = useCallback(async () => {
    setSelectedEmployee(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const getMeetingsForDay = useCallback(
    async (day: Date) => {
      if (!configured || !selectedEmployee?.userId) return [];
      return listMeetingsForDay(selectedEmployee.userId, day);
    },
    [configured, selectedEmployee?.userId]
  );

  const value = useMemo<OdooContextValue>(
    () => ({
      configured,
      selectedEmployee,
      employees,
      employeesLoading,
      employeesError,
      checkDatabaseConnection,
      loadEmployees,
      selectEmployee,
      clearSelectedEmployee,
      getMeetingsForDay,
    }),
    [
      configured,
      selectedEmployee,
      employees,
      employeesLoading,
      employeesError,
      checkDatabaseConnection,
      loadEmployees,
      selectEmployee,
      clearSelectedEmployee,
      getMeetingsForDay,
    ]
  );

  return <OdooContext.Provider value={value}>{children}</OdooContext.Provider>;
}

export function useOdoo() {
  const context = useContext(OdooContext);
  if (!context) {
    throw new Error("useOdoo debe usarse dentro de OdooProvider.");
  }
  return context;
}
