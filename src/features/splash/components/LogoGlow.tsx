import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";

import { splashColors } from "../theme/splashColors";

const LOGO_SIZE = 110;
const RING_SIZE = LOGO_SIZE + 24;

/**
 * Logo "S" con un anillo luminoso que pulsa.
 * Aparece con scale+fade al montar.
 */
export function LogoGlow() {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.9)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrada del logo
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulso del anillo luminoso (loop infinito)
    const ringPulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.12,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.7,
            duration: 1600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 0.95,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.25,
            duration: 1600,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    // Inicia el pulso tras la entrada
    setTimeout(() => ringPulse.start(), 500);

    return () => ringPulse.stop();
  }, [scale, opacity, ringScale, ringOpacity]);

  return (
    <Animated.View
      style={[styles.wrapper, { opacity, transform: [{ scale }] }]}
    >
      {/* Anillo con glow */}
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />

      {/* Círculo interior con la letra */}
      <View style={styles.logoCircle}>
        <Text style={styles.logoLetter}>S</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RING_SIZE / 2,
    borderWidth: 2,
    borderColor: splashColors.glow,
    // Sombra simulando glow
    shadowColor: splashColors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  logoCircle: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: "rgba(14, 165, 233, 0.10)",
    borderWidth: 1.5,
    borderColor: "rgba(14, 165, 233, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontSize: 48,
    fontWeight: "800",
    color: splashColors.glow,
    // Sombra de texto para efecto neon
    textShadowColor: splashColors.glowSoft,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
});
