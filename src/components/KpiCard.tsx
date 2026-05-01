import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  accentColor?: string;
}

export function KpiCard({ label, value, sub, color = '#fff', accentColor = colors.purple }: KpiCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.topBar, { backgroundColor: accentColor }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  label: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 7,
    marginTop: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Courier New',
    letterSpacing: -0.5,
  },
  sub: {
    color: colors.textDim,
    fontSize: 9,
    marginTop: 4,
  },
});
