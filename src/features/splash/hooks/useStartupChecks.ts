import { useEffect, useRef, useState, useCallback } from "react";
import { Animated } from "react-native";

/** Paso individual de inicialización */
export interface StartupStep {
  label: string;
  done: boolean;
}

/** Definición interna de cada comprobación simulada */
interface CheckDef {
  label: string;
  /** Duración en ms que tarda esta comprobación */
  duration: number;
}

// Comprobaciones simuladas (~6 s en total)
const CHECKS: CheckDef[] = [
  { label: "Conectando con el servidor…", duration: 1600 },
  { label: "Verificando base de datos…", duration: 1500 },
  { label: "Cargando configuración…", duration: 1500 },
  { label: "Preparando tu experiencia…", duration: 1400 },
];

/**
 * Hook que simula las comprobaciones de arranque.
 * Devuelve el progreso animado (0→1), los pasos y si ya terminó.
 */
export function useStartupChecks() {
  const progress = useRef(new Animated.Value(0)).current;
  const [steps, setSteps] = useState<StartupStep[]>(
    CHECKS.map((c) => ({ label: c.label, done: false }))
  );
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [finished, setFinished] = useState(false);

  /** Marca un paso como completado */
  const completeStep = useCallback(
    (index: number) => {
      setSteps((prev) =>
        prev.map((s, i) => (i === index ? { ...s, done: true } : s))
      );
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    const totalDuration = CHECKS.reduce((sum, c) => sum + c.duration, 0);
    let elapsed = 0;

    // Pequeña pausa inicial antes de empezar las comprobaciones
    const initialDelay = setTimeout(() => {
      if (cancelled) return;

      // Recorre cada comprobación secuencialmente
      CHECKS.reduce<Promise<void>>(
        (chain, check, idx) =>
          chain.then(
            () =>
              new Promise<void>((resolve) => {
                if (cancelled) return resolve();
                setCurrentIndex(idx);

                // Anima el progreso hasta el porcentaje acumulado
                elapsed += check.duration;
                const target = elapsed / totalDuration;

                Animated.timing(progress, {
                  toValue: target,
                  duration: check.duration,
                  useNativeDriver: false,
                }).start(() => {
                  if (cancelled) return resolve();
                  completeStep(idx);
                  resolve();
                });
              })
          ),
        Promise.resolve()
      ).then(() => {
        if (!cancelled) {
          // Breve pausa final antes de indicar que terminó
          setTimeout(() => {
            if (!cancelled) setFinished(true);
          }, 400);
        }
      });
    }, 600);

    return () => {
      cancelled = true;
      clearTimeout(initialDelay);
    };
  }, [completeStep, progress]);

  return { progress, steps, currentIndex, finished };
}
