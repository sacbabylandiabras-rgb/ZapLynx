import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Line, Circle, Text as SvgText } from 'react-native-svg';
import { Logo } from '../components/Logo';
import { colors } from '../theme';
import { useTelegramData } from '../lib/useDashboardData';

export function TelegramScreen() {
  const { data: t } = useTelegramData();
  const kpis = [
    { label: 'Bots', value: String(t.bots), sub: 'Conectados', bar: colors.purple, valColor: undefined as string | undefined },
    { label: 'Msgs hoje', value: String(t.msgsHoje), sub: 'Recebidas', bar: colors.blue, valColor: undefined },
    { label: 'Conversas', value: String(t.conversas), sub: 'Únicas', bar: '#64748b', valColor: undefined },
    { label: 'Vnd. Aprov.', value: String(t.vendasAprovadasMes), sub: 'Este mês', bar: colors.green, valColor: colors.green },
  ];
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.nav}>
        <Logo size="sm" />
        <View style={styles.pollingBadge}>
          <Text style={styles.pollingText}>POLLING ON</Text>
        </View>
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Telegram</Text>
        <Text style={styles.pageSub}>Bots e mensagens recebidas</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* KPIs */}
        <View style={styles.row4}>
          {kpis.map((k) => (
            <View key={k.label} style={styles.kpiCard}>
              <View style={[styles.kpiBar, { backgroundColor: k.bar }]} />
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <Text style={[styles.kpiVal, { color: k.valColor || '#fff' }]}>{k.value}</Text>
              <Text style={styles.kpiSub}>{k.sub}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Volume — últimos 14 dias</Text>
          <Svg width="100%" height={70} viewBox="0 0 340 70">
            <Line x1={0} y1={18} x2={340} y2={18} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Line x1={0} y1={45} x2={340} y2={45} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Line x1={0} y1={64} x2={340} y2={64} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <Circle cx={170} cy={64} r={3} fill="#9d7bfa" />
            <Line x1={170} y1={18} x2={170} y2={64} stroke="rgba(157,123,250,0.2)" strokeWidth={1} strokeDasharray="3,3" />
            <SvgText x={170} y={12} fontSize={8} fill="rgba(255,255,255,0.25)" textAnchor="middle" fontFamily="Courier New">17/04 · 0</SvgText>
          </Svg>
          <View style={styles.axisRow}>
            {['17/04', '21/04', '25/04', '30/04'].map((d) => (
              <Text key={d} style={styles.axisText}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Bot */}
        <Text style={styles.sectionLabel}>Seus bots</Text>
        <View style={styles.botCard}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>Z</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.botName}>zaplynx</Text>
            <Text style={styles.botHandle}>@zaplynx_bot · 3d atrás</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>ativo</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 10 },
  pollingBadge: { backgroundColor: 'rgba(52,199,89,0.1)', borderWidth: 0.5, borderColor: 'rgba(52,199,89,0.25)', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 },
  pollingText: { color: colors.green, fontSize: 11, fontWeight: '500', letterSpacing: 0.3 },
  pageHeader: { paddingHorizontal: 18, paddingBottom: 12 },
  pageTitle: { color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  pageSub: { color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 3 },
  scroll: { flex: 1, paddingHorizontal: 14 },
  row4: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  kpiCard: { flex: 1, backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.cardBorder, borderRadius: 8, padding: 10, overflow: 'hidden' },
  kpiBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  kpiLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 8, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5, marginTop: 4 },
  kpiVal: { fontSize: 18, fontWeight: '700', fontFamily: 'Courier New' },
  kpiSub: { color: 'rgba(255,255,255,0.25)', fontSize: 8, marginTop: 3 },
  chartCard: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.09)', borderRadius: 8, padding: 14, marginBottom: 8 },
  chartTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  axisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  axisText: { color: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'Courier New' },
  sectionLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  botCard: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.cardBorder, borderRadius: 8, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11 },
  botAvatar: { width: 36, height: 36, borderRadius: 6, backgroundColor: '#6c4af2', alignItems: 'center', justifyContent: 'center' },
  botAvatarText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  botName: { color: '#fff', fontSize: 13, fontWeight: '500' },
  botHandle: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Courier New', marginTop: 2 },
  activeBadge: { backgroundColor: 'rgba(52,199,89,0.1)', borderWidth: 0.5, borderColor: 'rgba(52,199,89,0.2)', borderRadius: 3, paddingHorizontal: 7, paddingVertical: 2 },
  activeBadgeText: { color: colors.green, fontSize: 10, fontWeight: '500' },
});
