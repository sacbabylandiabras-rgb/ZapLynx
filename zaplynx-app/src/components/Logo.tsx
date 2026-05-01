import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

interface LogoProps {
  size?: 'sm' | 'lg';
}

export function Logo({ size = 'sm' }: LogoProps) {
  const iconSize = size === 'lg' ? 72 : 26;
  const boltSize = size === 'lg' ? 38 : 14;
  const fontSize = size === 'lg' ? 30 : 16;
  const borderRadius = size === 'lg' ? 18 : 7;

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconBox, { width: iconSize, height: iconSize, borderRadius }]}>
        <Svg width={boltSize} height={boltSize} viewBox="0 0 38 38">
          <Defs>
            <SvgGradient id="bolt" x1="22" y1="2" x2="14" y2="36" gradientUnits="userSpaceOnUse">
              <Stop offset="0%" stopColor="#f0abfc" />
              <Stop offset="50%" stopColor="#d946ef" />
              <Stop offset="100%" stopColor="#a855f7" />
            </SvgGradient>
          </Defs>
          <Path d="M22 4L10 21h9l-3 13 12-17h-9l3-13z" fill="url(#bolt)" />
        </Svg>
      </View>
      <View style={styles.textRow}>
        <Text style={[styles.zap, { fontSize }]}>ZAP</Text>
        <Text style={[styles.lynx, { fontSize }]}>LYNX</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBox: {
    backgroundColor: '#1e1a35',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRow: { flexDirection: 'row' },
  zap: { color: '#fff', fontWeight: '700', letterSpacing: -0.3 },
  lynx: { fontWeight: '700', letterSpacing: -0.3, color: '#c084fc' },
});
