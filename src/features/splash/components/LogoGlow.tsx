import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

import { useAppTheme } from "../../../shared/theme/appTheme";

const LOGO_SIZE = 110;
const RING_SIZE = LOGO_SIZE + 24;

export function LogoGlow() {
  const { palette } = useAppTheme();
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.9)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
      ]),
    );

    const timeout = setTimeout(() => ringPulse.start(), 500);
    return () => {
      clearTimeout(timeout);
      ringPulse.stop();
    };
  }, [opacity, ringOpacity, ringScale, scale]);

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ scale }] }]}>
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
            borderColor: palette.glow,
            shadowColor: palette.glow,
          },
        ]}
      />

      <View style={[styles.logoCircle, { borderColor: palette.glowSoft }]}>
        <Svg width={92} height={40} viewBox="0 0 92 40">
          <Circle cx={14} cy={20} r={12} fill={palette.glow} />
          <Circle cx={38} cy={20} r={12} fill={palette.glowLight} />
          <Circle cx={62} cy={20} r={12} fill={palette.glow} />
          <Circle cx={84} cy={20} r={8} fill={palette.glowLight} />
          <SvgText x={8} y={25} fontSize={12} fontWeight="700" fill={palette.textBright}>
            odoo
          </SvgText>
        </Svg>
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 12,
  },
  logoCircle: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    backgroundColor: "rgba(113, 75, 103, 0.12)",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
