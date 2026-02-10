import { useEffect, useRef, useState, useCallback } from "react";
import { Animated } from "react-native";

export interface StartupStep {
  label: string;
  done: boolean;
  failed?: boolean;
}

interface UseStartupChecksParams {
  checkDatabaseConnection: () => Promise<boolean>;
}

const STEP_DURATION = 1200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useStartupChecks({ checkDatabaseConnection }: UseStartupChecksParams) {
  const progress = useRef(new Animated.Value(0)).current;
  const [steps, setSteps] = useState<StartupStep[]>([
    { label: "Conectando con el servidor...", done: false },
    { label: "Verificando base de datos...", done: false },
    { label: "Cargando configuracion...", done: false },
    { label: "Preparando tu experiencia...", done: false },
  ]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [finished, setFinished] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const completeStep = useCallback((index: number, success = true) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, done: success, failed: !success } : step))
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await sleep(450);
      if (cancelled) return;

      for (let index = 0; index < steps.length; index += 1) {
        setCurrentIndex(index);
        const stepStart = Date.now();
        let success = true;

        if (index === 1) {
          success = await checkDatabaseConnection();
          if (!success) setHasErrors(true);
        }

        const elapsed = Date.now() - stepStart;
        const remaining = Math.max(250, STEP_DURATION - elapsed);
        await sleep(remaining);
        if (cancelled) return;

        completeStep(index, success);

        Animated.timing(progress, {
          toValue: (index + 1) / steps.length,
          duration: 450,
          useNativeDriver: false,
        }).start();
      }

      await sleep(350);
      if (!cancelled) setFinished(true);
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [checkDatabaseConnection, completeStep, progress, steps.length]);

  return { progress, steps, currentIndex, finished, hasErrors };
}
