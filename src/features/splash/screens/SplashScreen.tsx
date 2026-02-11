import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

import { useAppTheme } from "../../../shared/theme/appTheme";
import { FloatingParticles } from "../components/FloatingParticles";
import { LogoGlow } from "../components/LogoGlow";
import { ProgressBar } from "../components/ProgressBar";
import { StepList } from "../components/StepList";
import { useStartupChecks } from "../hooks/useStartupChecks";

const { height: SCREEN_H } = Dimensions.get("window");

interface SplashScreenProps {
  onFinished: () => void;
  checkDatabaseConnection: () => Promise<boolean>;
}

export function SplashScreen({ onFinished, checkDatabaseConnection }: SplashScreenProps) {
  const { palette, mode } = useAppTheme();
  const { progress, steps, currentIndex, finished, hasErrors } = useStartupChecks({
    checkDatabaseConnection,
  });

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(14)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const versionOpacity = useRef(new Animated.Value(0)).current;

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
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      <LinearGradient
        colors={[palette.gradientStart, palette.gradientMid, palette.gradientEnd]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <FloatingParticles />

      <View style={styles.content}>
        <View style={styles.brandArea}>
          <LogoGlow />

          <Animated.Text
            style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }], color: palette.textBright }]}
          >
            SimplyMeet
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity, color: palette.textMuted }]}>
            Tu agenda inteligente
          </Animated.Text>
        </View>

        <View style={styles.progressArea}>
          <ProgressBar progress={progress} />
          <StepList steps={steps} currentIndex={currentIndex} />
          {hasErrors ? <Text style={[styles.warning, { color: palette.errorText }]}>No se pudo validar Odoo. Revisa la configuracion.</Text> : null}
        </View>

        <Animated.Text style={[styles.version, { opacity: versionOpacity, color: palette.textSubtle }]}>v1.0.0</Animated.Text>
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
    letterSpacing: 1.5,
    marginTop: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  progressArea: {
    alignItems: "center",
  },
  warning: {
    marginTop: 10,
    color: "#FCA5A5",
    fontSize: 12,
  },
  version: {
    fontSize: 11,
    fontWeight: "300",
  },
});
