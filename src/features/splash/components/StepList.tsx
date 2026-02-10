import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Text } from "react-native";

import { splashColors } from "../theme/splashColors";
import type { StartupStep } from "../hooks/useStartupChecks";

interface StepListProps {
  steps: StartupStep[];
  currentIndex: number;
}

export function StepList({ steps, currentIndex }: StepListProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, i) => (
        <StepRow
          key={i}
          label={step.label}
          done={step.done}
          failed={step.failed}
          active={i === currentIndex}
          visible={i <= currentIndex}
        />
      ))}
    </View>
  );
}

interface StepRowProps {
  label: string;
  done: boolean;
  failed?: boolean;
  active: boolean;
  visible: boolean;
}

function StepRow({ label, done, failed, active, visible }: StepRowProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, opacity, translateX]);

  return (
    <Animated.View style={[styles.row, { opacity, transform: [{ translateX }] }]}>
      <View style={styles.indicator}>
        {failed ? (
          <Text style={styles.errorMark}>!</Text>
        ) : done ? (
          <Text style={styles.checkMark}>OK</Text>
        ) : active ? (
          <PulsingDot />
        ) : null}
      </View>

      <Text style={[styles.label, done && styles.labelDone, failed && styles.labelFailed, active && !done && styles.labelActive]}>
        {label}
      </Text>
    </Animated.View>
  );
}

function PulsingDot() {
  const scale = useRef(new Animated.Value(0.6)).current;
  const dotOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.6,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale, dotOpacity]);

  return <Animated.View style={[styles.dot, { opacity: dotOpacity, transform: [{ scale }] }]} />;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 10,
    minHeight: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  indicator: {
    width: 24,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    fontSize: 10,
    fontWeight: "700",
    color: splashColors.checkDone,
  },
  errorMark: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F87171",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: splashColors.glow,
  },
  label: {
    fontSize: 13,
    color: splashColors.textSubtle,
    fontWeight: "400",
  },
  labelActive: {
    color: splashColors.textMuted,
    fontWeight: "500",
  },
  labelDone: {
    color: splashColors.textMuted,
    fontWeight: "400",
  },
  labelFailed: {
    color: "#FCA5A5",
    fontWeight: "500",
  },
});
