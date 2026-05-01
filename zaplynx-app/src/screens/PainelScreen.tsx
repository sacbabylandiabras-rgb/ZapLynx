import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Logo } from '../components/Logo';
import { KpiCard } from '../components/KpiCard';
import { colors } from '../theme';
import { useAuth } from '../AuthContext';
import { usePainelData, formatBRL } from '../lib/useDashboardData';

export function PainelScreen() {
  const { logout } = useAuth();
  const { data: d } = usePainelData();

  const fmtBRL = (cents: number) => {
    const reais = Math.floor(cents / 100);
    const cents2 = String(cents % 100).padStart(2, '0');
    return { intPart: 'R$ ' + reais.toLocaleString('pt-BR'), decPart: ',' + cents2 };
  };
  const pix = fmtBRL(d.pixGerado);
  const ven = fmtBRL(d.vendaAprovada);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.blob1} />
      {/* NAV */}
      <View style={styles.nav}>
        <Logo size="sm" />
        <View style={styles.navRight}>
          <View style={styles.proBadge}><Text style={styles.proBadgeText}>PRO</Text></View>
          <TouchableOpacity style={styles.avatarBtn} onPress={logout}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>⎋</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Painel</Text>
        <Text style={styles.pageSub}>Visão geral das suas métricas</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* KPIs */}
        <View style={styles.row3}>
          <KpiCard label="Campanhas" value={String(d.campaigns)} sub="Criadas" accentColor={colors.purple} />
          <KpiCard label="Modelos" value={String(d.templates)} sub="Templates" accentColor={colors.blue} />
          <KpiCard label="Contatos" value={String(d.contacts)} sub="Alcançados" accentColor={colors.orange} />
        </View>

        {/* Financeiro */}
        <View style={styles.row2}>
          <View style={[styles.finCard, { flex: 1 }]}>
            <Text style={styles.finLabel}>● Pix gerado</Text>
            <Text style={[styles.finVal, { color: colors.green }]}>{pix.intPart}</Text>
            <Text style={styles.finSub}>{pix.decPart} neste período</Text>
          </View>
          <View style={{ width: 6 }} />
          <View style={[styles.finCard, { flex: 1 }]}>
            <Text style={styles.finLabel}>● Venda aprovada</Text>
            <Text style={[styles.finVal, { color: colors.purple }]}>{ven.intPart}</Text>
            <Text style={styles.finSub}>{ven.decPart} neste período</Text>
          </View>
        </View>

        {/* CPA */}
        <View style={styles.cpaCard}>
          <View>
            <Text style={styles.cpaLabel}>CPA — Custo por aquisição</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 6 }}>
              <Text style={[styles.cpaVal, { color: colors.blue }]}>{d.cpa.toFixed(4).replace('.', ',')}</Text>
              <Text style={styles.cpaUnit}> venda / msg</Text>
            </View>
          </View>
          <View style={styles.cpaIcon}>
            <Text style={{ color: colors.blue, fontSize: 22 }}>↗</Text>
          </View>
        </View>

        {/* Mensagens */}
        <View style={styles.row4}>
          {[
            { v: String(d.total), l: 'Total', c: '#fff', bar: 'rgba(255,255,255,0.2)' },
            { v: String(d.sent), l: 'Enviadas', c: colors.blue, bar: colors.blue },
            { v: String(d.delivered), l: 'Entregues', c: colors.green, bar: colors.green },
            { v: String(d.failed), l: 'Falhas', c: colors.red, bar: colors.red },
          ].map((item) => (
            <View key={item.l} style={styles.msgCard}>
              <View style={[styles.msgBar, { backgroundColor: item.bar }]} />
              <Text style={[styles.msgVal, { color: item.c }]}>{item.v}</Text>
              <Text style={styles.msgLabel}>{item.l}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Volume de mensagens</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {['7d', '30d', '90d'].map((p) => (
                <View key={p} style={[styles.pill, p === '30d' && styles.pillActive]}>
                  <Text style={[styles.pillText, p === '30d' && styles.pillTextActive]}>{p}</Text>
                </View>
              ))}
            </View>
          </View>
          <Svg width="100%" height={96} viewBox="0 0 340 96" preserveAspectRatio="none">
            <Defs>
              <SvgGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#7c5cfc" stopOpacity={0.32} />
                <Stop offset="100%" stopColor="#7c5cfc" stopOpacity={0} />
              </SvgGradient>
              <SvgGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#34c759" stopOpacity={0.18} />
                <Stop offset="100%" stopColor="#34c759" stopOpacity={0} />
              </SvgGradient>
            </Defs>
            <Line x1={0} y1={16} x2={340} y2={16} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Line x1={0} y1={48} x2={340} y2={48} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Line x1={0} y1={80} x2={340} y2={80} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Path d="M16,82 C40,80 65,72 95,55 C125,38 150,18 185,10 C215,4 255,3 324,2 L324,96 L16,96Z" fill="url(#ga)" />
            <Path d="M16,82 C40,80 65,72 95,55 C125,38 150,18 185,10 C215,4 255,3 324,2" fill="none" stroke="#9d7bfa" strokeWidth={1.8} />
            <Circle cx={16} cy={82} r={2.5} fill="#9d7bfa" />
            <Circle cx={95} cy={55} r={2.5} fill="#9d7bfa" />
            <Circle cx={185} cy={10} r={2.5} fill="#9d7bfa" />
            <Circle cx={324} cy={2} r={2.5} fill="#9d7bfa" />
            <Path d="M16,88 C60,87 100,84 145,79 C190,74 230,67 275,63 C300,61 315,60 324,59 L324,96 L16,96Z" fill="url(#gb)" />
            <Path d="M16,88 C60,87 100,84 145,79 C190,74 230,67 275,63 C300,61 315,60 324,59" fill="none" stroke="#34c759" strokeWidth={1.2} strokeDasharray="4,3" />
          </Svg>
          <View style={styles.axisRow}>
            {['26/04', '27/04', '28/04', '29/04', '30/04'].map((d) => (
              <Text key={d} style={styles.axisText}>{d}</Text>
            ))}
          </View>
          <View style={styles.legend}>
            {[{ c: '#9d7bfa', l: 'Enviadas' }, { c: '#34c759', l: 'Entregues' }, { c: '#ff453a', l: 'Erros' }].map((i) => (
              <View key={i.l} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: i.c }]} />
                <Text style={styles.legendText}>{i.l}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  blob1: { position: 'absolute', top: -120, left: -100, width: 420, height: 420, borderRadius: 210, backgroundColor: 'rgba(200,80,220,0.15)' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 10 },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  proBadge: { backgroundColor: 'rgba(124,92,252,0.25)', borderWidth: 0.5, borderColor: 'rgba(124,92,252,0.45)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  proBadgeText: { color: '#b09afa', fontSize: 10, fontWeight: '500', letterSpacing: 0.5 },
  avatarBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  pageHeader: { paddingHorizontal: 18, paddingBottom: 12 },
  pageTitle: { color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  pageSub: { color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 3 },
  scroll: { flex: 1, paddingHorizontal: 14 },
  row3: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  row2: { flexDirection: 'row', marginBottom: 6 },
  finCard: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.cardBorder, borderRadius: 8, padding: 13 },
  finLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  finVal: { fontSize: 17, fontWeight: '700', fontFamily: 'Courier New', letterSpacing: -0.3 },
  finSub: { color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 3 },
  cpaCard: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.cardBorder, borderRadius: 8, padding: 13, marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cpaLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  cpaVal: { fontSize: 20, fontWeight: '700', fontFamily: 'Courier New', letterSpacing: -0.3 },
  cpaUnit: { color: 'rgba(255,255,255,0.25)', fontSize: 11 },
  cpaIcon: { width: 44, height: 44, borderRadius: 8, backgroundColor: 'rgba(56,189,248,0.1)', borderWidth: 0.5, borderColor: 'rgba(56,189,248,0.2)', alignItems: 'center', justifyContent: 'center' },
  row4: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  msgCard: { flex: 1, backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.cardBorder, borderRadius: 8, padding: 10, alignItems: 'center', overflow: 'hidden' },
  msgBar: { position: 'absolute', top: 0, left: 0, right: 0, height: 2 },
  msgVal: { fontSize: 19, fontWeight: '700', fontFamily: 'Courier New', marginTop: 4 },
  msgLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 5 },
  chartCard: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.09)', borderRadius: 8, padding: 14, marginBottom: 8 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  chartTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6 },
  pill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4 },
  pillActive: { backgroundColor: 'rgba(124,92,252,0.2)', borderWidth: 0.5, borderColor: 'rgba(124,92,252,0.3)' },
  pillText: { fontSize: 10, color: 'rgba(255,255,255,0.25)' },
  pillTextActive: { color: '#b09afa' },
  axisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  axisText: { color: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'Courier New' },
  legend: { flexDirection: 'row', gap: 14, marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.06)' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 16, height: 2, borderRadius: 1 },
  legendText: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
});
