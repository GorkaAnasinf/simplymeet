import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { splashColors } from "../theme/splashColors";

const { width: SCREEN_W } = Dimensions.get("window");
const BAR_WIDTH = SCREEN_W * 0.72;
const BAR_HEIGHT = 4;
const BAR_RADIUS = BAR_HEIGHT / 2;

interface ProgressBarProps {
  /** Animated.Value entre 0 y 1 */
  progress: Animated.Value;
}

/**
 * Barra de progreso estilizada con relleno degradado y glow.
 */
export function ProgressBar({ progress }: ProgressBarProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      delay: 800,
      useNativeDriver: false,
    }).start();
  }, [fadeIn]);

  // Interpolación del ancho del fill
  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      {/* Track de fondo */}
      <View style={styles.track}>
        {/* Fill animado */}
        <Animated.View style={[styles.fillWrapper, { width: fillWidth }]}>
          <LinearGradient
            colors={[splashColors.glow, splashColors.glowLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </Animated.View>
      </View>

      {/* Glow debajo de la barra */}
      <Animated.View
        style={[
          styles.glowBar,
          {
            width: fillWidth,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BAR_WIDTH,
    alignItems: "flex-start",
  },
  track: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    backgroundColor: splashColors.progressTrack,
    overflow: "hidden",
  },
  fillWrapper: {
    height: BAR_HEIGHT,
    borderRadius: BAR_RADIUS,
    overflow: "hidden",
  },
  fill: {
    flex: 1,
    borderRadius: BAR_RADIUS,
  },
  glowBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: splashColors.progressGlow,
    marginTop: -2,
    // Sombra para el efecto glow
    shadowColor: splashColors.glow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
});
