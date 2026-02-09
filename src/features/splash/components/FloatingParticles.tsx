import { useEffect, useRef, useMemo } from "react";
import { Animated, StyleSheet, View, Dimensions } from "react-native";

import { splashColors } from "../theme/splashColors";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

/** Cantidad de partículas flotantes */
const PARTICLE_COUNT = 18;

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

/** Genera datos aleatorios para cada partícula */
function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * SCREEN_W,
    y: Math.random() * SCREEN_H,
    size: 2 + Math.random() * 3,
    opacity: 0.08 + Math.random() * 0.18,
    duration: 4000 + Math.random() * 6000,
  }));
}

/**
 * Fondo con partículas flotantes que suben lentamente,
 * dando un efecto de "cosmos" sutil.
 */
export function FloatingParticles() {
  const particles = useMemo(() => generateParticles(), []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => (
        <SingleParticle key={i} data={p} />
      ))}
    </View>
  );
}

function SingleParticle({ data }: { data: Particle }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(data.opacity)).current;

  useEffect(() => {
    // Movimiento ascendente infinito
    const drift = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -SCREEN_H * 0.25,
          duration: data.duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: data.duration,
          useNativeDriver: true,
        }),
      ])
    );

    // Parpadeo suave
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: data.opacity * 0.3,
          duration: data.duration * 0.6,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: data.opacity,
          duration: data.duration * 0.4,
          useNativeDriver: true,
        }),
      ])
    );

    drift.start();
    blink.start();

    return () => {
      drift.stop();
      blink.stop();
    };
  }, [data, translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: data.x,
          top: data.y,
          width: data.size,
          height: data.size,
          borderRadius: data.size / 2,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    backgroundColor: splashColors.particle,
  },
});
