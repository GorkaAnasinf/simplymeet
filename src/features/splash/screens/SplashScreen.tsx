import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

import { splashColors } from "../theme/splashColors";
import { FloatingParticles } from "../components/FloatingParticles";
import { LogoGlow } from "../components/LogoGlow";
import { ProgressBar } from "../components/ProgressBar";
import { StepList } from "../components/StepList";
import { useStartupChecks } from "../hooks/useStartupChecks";

const { height: SCREEN_H } = Dimensions.get("window");

interface SplashScreenProps {
  /** Se invoca cuando todas las comprobaciones han finalizado */
  onFinished: () => void;
}

/**
 * Splash Screen "Dark Cosmos"
 *
 * Simula comprobaciones de arranque con animaciones fluidas,
 * partículas flotantes, logo con glow y barra de progreso.
 */
export function SplashScreen({ onFinished }: SplashScreenProps) {
  const { progress, steps, currentIndex, finished } = useStartupChecks();

  // Animaciones de entrada/salida globales
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(14)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const versionOpacity = useRef(new Animated.Value(0)).current;

  // Entrada del título y subtítulo
  useEffect(() => {
    Animated.stagger(250, [
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          delay: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          delay: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(versionOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleOpacity, titleTranslateY, subtitleOpacity, versionOpacity]);

  // Fade‑out al terminar y notificar al padre
  useEffect(() => {
    if (!finished) return;
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 500,
      delay: 200,
      useNativeDriver: true,
    }).start(() => onFinished());
  }, [finished, screenOpacity, onFinished]);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar style="light" />

      {/* Fondo degradado */}
      <LinearGradient
        colors={[
          splashColors.gradientStart,
          splashColors.gradientMid,
          splashColors.gradientEnd,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Partículas flotantes */}
      <FloatingParticles />

      {/* Contenido centrado */}
      <View style={styles.content}>
        {/* Zona superior: Logo + títulos */}
        <View style={styles.brandArea}>
          <LogoGlow />

          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleTranslateY }],
              },
            ]}
          >
            SimplyMeet
          </Animated.Text>

          <Animated.Text
            style={[styles.subtitle, { opacity: subtitleOpacity }]}
          >
            Tu agenda inteligente
          </Animated.Text>
        </View>

        {/* Zona inferior: progreso + pasos */}
        <View style={styles.progressArea}>
          <ProgressBar progress={progress} />

          <StepList steps={steps} currentIndex={currentIndex} />
        </View>

        {/* Versión en la parte inferior */}
        <Animated.Text style={[styles.version, { opacity: versionOpacity }]}>
          v1.0.0
        </Animated.Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: SCREEN_H * 0.18,
    paddingBottom: SCREEN_H * 0.06,
  },
  brandArea: {
    alignItems: "center",
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: splashColors.textBright,
    letterSpacing: 1.5,
    marginTop: 8,
    // Sombra suave para profundidad
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: splashColors.textMuted,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  progressArea: {
    alignItems: "center",
  },
  version: {
    fontSize: 11,
    color: splashColors.textSubtle,
    fontWeight: "300",
  },
});
