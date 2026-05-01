import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Line, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../components/Logo';
import { colors } from '../theme';
import { useAuth } from '../AuthContext';
import { usePagamentosData, formatBRL, formatDateBR } from '../lib/useDashboardData';

export function PagamentosScreen() {
  const [saqueVisible, setSaqueVisible] = useState(false);
  const [extratoVisible, setExtratoVisible] = useState(false);
  const [saqueVal, setSaqueVal] = useState('');
  const [saqueSuccess, setSaqueSuccess] = useState(false);
  const { user } = useAuth();
  const { data: pg } = usePagamentosData();

  const saldoReais = pg.saldoDisponivel / 100;
  const validSaque = parseFloat(saqueVal) >= 10 && parseFloat(saqueVal) <= saldoReais;

  const metrics = [
    { label: 'Vendas aprovadas', value: String(pg.vendasAprovadas), sub: 'últimos 30 dias', color: colors.green },
    { label: 'Volume aprovado', value: formatBRL(pg.volumeAprovado), sub: 'R$ · 30 dias', color: colors.purple },
    { label: 'Taxa aprovação', value: pg.taxaAprovacao.toFixed(1).replace('.', ',') + '%', sub: 'últimos 30 dias', color: colors.blue },
    { label: 'Ticket médio', value: formatBRL(pg.ticketMedio), sub: 'R$ por venda', color: colors.yellow },
  ];

  const openSaque = () => { setSaqueVal(''); setSaqueSuccess(false); setSaqueVisible(true); };
  const confirmarSaque = () => { if (validSaque) setSaqueSuccess(true); };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.nav}>
        <Logo size="sm" />
      </View>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Pagamentos</Text>
        <Text style={styles.pageSub}>{user?.email || ''}</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Balance */}
        <View style={styles.balCard}>
          <Text style={styles.balLabel}>Saldo disponível para saque</Text>
          <Text style={styles.balVal}>R$ {formatBRL(pg.saldoDisponivel)}</Text>
          <Text style={styles.balSub}>Líquido R$ {formatBRL(pg.liquidoTotal)} · Sacado R$ {formatBRL(pg.sacadoTotal)}</Text>
          <View style={styles.balBtns}>
            <TouchableOpacity style={{ flex: 1 }} onPress={openSaque} activeOpacity={0.85}>
              <LinearGradient colors={['#6c4af2', '#8b68f5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnPrimary}>
                <Text style={styles.btnPrimaryText}>Solicitar saque</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSecondary, { flex: 1 }]} onPress={() => setExtratoVisible(true)}>
              <Text style={styles.btnSecondaryText}>Extrato</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Metrics */}
        <View style={styles.row2}>
          {metrics.map((m, i) => (
            <View key={m.label} style={[styles.metricCard, i % 2 === 0 ? { marginRight: 3 } : { marginLeft: 3 }]}>
              <Text style={styles.metricLabel}>● {m.label}</Text>
              <Text style={[styles.metricVal, { color: m.color }]}>{m.value}</Text>
              <Text style={styles.metricSub}>{m.sub}</Text>
            </View>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Volume de vendas — 30 dias</Text>
          <Svg width="100%" height={90} viewBox="0 0 340 90" preserveAspectRatio="none">
            <Defs>
              <SvgGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#34c759" stopOpacity={0.28} />
                <Stop offset="100%" stopColor="#34c759" stopOpacity={0} />
              </SvgGradient>
            </Defs>
            <Line x1={0} y1={18} x2={340} y2={18} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Line x1={0} y1={50} x2={340} y2={50} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Line x1={0} y1={80} x2={340} y2={80} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
            <Path d="M16,82 L34,10 L52,65 L80,72 L108,74 L136,72 L170,68 L200,58 L224,52 L252,60 L280,67 L310,72 L324,74 L324,90 L16,90Z" fill="url(#gc)" />
            <Path d="M16,82 L34,10 L52,65 L80,72 L108,74 L136,72 L170,68 L200,58 L224,52 L252,60 L280,67 L310,72 L324,74" fill="none" stroke="#34c759" strokeWidth={1.8} />
            <Circle cx={34} cy={10} r={3} fill="#34c759" />
            <Circle cx={224} cy={52} r={2.5} fill="#34c759" />
          </Svg>
          <View style={styles.axisRow}>
            {['01/04', '08/04', '15/04', '22/04', '30/04'].map((d) => (
              <Text key={d} style={styles.axisText}>{d}</Text>
            ))}
          </View>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* MODAL SAQUE */}
      <Modal visible={saqueVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalNav}>
            <TouchableOpacity onPress={() => setSaqueVisible(false)}>
              <Text style={styles.backBtn}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Solicitar saque</Text>
            <View style={{ width: 60 }} />
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <View style={styles.saldoBox}>
                <Text style={styles.saldoLabel}>Disponível para saque</Text>
                <Text style={styles.saldoVal}>R$ {formatBRL(pg.saldoDisponivel)}</Text>
                <Text style={styles.saldoSub}>Mínimo R$ 10,00</Text>
              </View>
              <Text style={styles.formLabel}>Valor do saque (R$)</Text>
              <TextInput
                style={styles.formInput}
                value={saqueVal}
                onChangeText={setSaqueVal}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor="rgba(255,255,255,0.2)"
              />
              <Text style={[styles.formHint, { color: parseFloat(saqueVal) > 1.47 ? colors.red : 'rgba(255,204,0,0.7)' }]}>
                {parseFloat(saqueVal) > 1.47 ? 'Valor maior que o saldo (R$ 1,47)' : 'Saldo insuficiente — mínimo R$ 10,00'}
              </Text>
              <Text style={styles.formLabel}>Chave PIX de destino</Text>
              <TextInput style={[styles.formInput, { color: 'rgba(255,255,255,0.5)' }]} value="zaplynx2.0@gmail.com" editable={false} />
              <View style={styles.infoBox}>
                {[['Tipo de chave', 'E-mail'], ['Prazo', '1–3 dias úteis'], ['Taxa', 'Grátis']].map(([l, v]) => (
                  <View key={l} style={styles.infoRow}>
                    <Text style={styles.infoL}>{l}</Text>
                    <Text style={[styles.infoV, l === 'Taxa' && { color: colors.green }]}>{v}</Text>
                  </View>
                ))}
              </View>
              {!saqueSuccess ? (
                <TouchableOpacity onPress={confirmarSaque} disabled={!validSaque} activeOpacity={0.85}>
                  <LinearGradient colors={validSaque ? ['#6c4af2', '#8b68f5'] : ['#333', '#444']} style={styles.confirmBtn}>
                    <Text style={styles.confirmBtnText}>Confirmar saque</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.successBox}>
                  <Text style={styles.successIcon}>✓</Text>
                  <Text style={styles.successTitle}>Solicitação enviada!</Text>
                  <Text style={styles.successSub}>Seu saque foi solicitado e será processado em 1–3 dias úteis via PIX.</Text>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* MODAL EXTRATO */}
      <Modal visible={extratoVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalNav}>
            <TouchableOpacity onPress={() => setExtratoVisible(false)}>
              <Text style={styles.backBtn}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Extrato</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.extSummary}>
              {[{ v: 'R$' + formatBRL(pg.volumeAprovado), l: 'Recebido', c: colors.green }, { v: 'R$' + formatBRL(pg.sacadoTotal), l: 'Sacado', c: colors.purple }, { v: 'R$' + formatBRL(pg.saldoDisponivel), l: 'Saldo', c: colors.yellow }].map((s) => (
                <View key={s.l} style={styles.extSumCard}>
                  <Text style={[styles.extSumVal, { color: s.c }]}>{s.v}</Text>
                  <Text style={styles.extSumLabel}>{s.l}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.monthLabel}>Movimentações</Text>
            {pg.extrato.length === 0 && (
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', paddingVertical: 24 }}>
                Nenhuma movimentação ainda.
              </Text>
            )}
            {pg.extrato.map((item, i) => {
              const ok = item.status === 'approved';
              const pending = item.status === 'pending';
              const sign = item.type === 'out' ? '- ' : '+ ';
              const amountColor = item.type === 'out' ? colors.red : (ok ? colors.green : '#fff');
              return (
                <View key={item.id} style={[styles.extRow, i === pg.extrato.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={[styles.extIcon, { backgroundColor: ok ? 'rgba(52,199,89,0.08)' : 'rgba(255,204,0,0.08)' }]}>
                    <Text style={{ color: ok ? colors.green : colors.yellow, fontSize: 14 }}>{item.type === 'out' ? '↓' : '↑'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.extName}>{item.name}</Text>
                    <Text style={styles.extDate}>{formatDateBR(item.date)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.extAmt, { color: amountColor }]}>{sign}R$ {formatBRL(item.amount)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: ok ? 'rgba(52,199,89,0.12)' : 'rgba(255,204,0,0.1)' }]}>
                      <Text style={[styles.statusText, { color: ok ? colors.green : colors.yellow }]}>{ok ? 'Aprovado' : pending ? 'Pendente' : 'Rejeitado'}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
            <View style={{ height: 32 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: { paddingHorizontal: 18, paddingVertical: 10 },
  pageHeader: { paddingHorizontal: 18, paddingBottom: 12 },
  pageTitle: { color: '#fff', fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  pageSub: { color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 3 },
  scroll: { flex: 1, paddingHorizontal: 14 },
  balCard: { backgroundColor: 'rgba(108,74,242,0.12)', borderWidth: 0.5, borderColor: 'rgba(108,74,242,0.25)', borderRadius: 8, padding: 18, marginBottom: 8 },
  balLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '400', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 },
  balVal: { color: '#fff', fontSize: 36, fontWeight: '300', fontFamily: 'Courier New', letterSpacing: -1.5 },
  balSub: { color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'Courier New', marginTop: 6 },
  balBtns: { flexDirection: 'row', gap: 8, marginTop: 14 },
  btnPrimary: { borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  btnSecondary: { backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  btnSecondaryText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '500' },
  row2: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  metricCard: { width: '50%', backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.cardBorder, borderRadius: 8, padding: 14, marginBottom: 6 },
  metricLabel: { color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: '400', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  metricVal: { fontSize: 17, fontWeight: '700', fontFamily: 'Courier New', letterSpacing: -0.3 },
  metricSub: { color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 4 },
  chartCard: { backgroundColor: colors.card, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.09)', borderRadius: 8, padding: 14, marginBottom: 8 },
  chartTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14 },
  axisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  axisText: { color: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'Courier New' },
  // Modal
  modalSafe: { flex: 1, backgroundColor: colors.bg },
  modalNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.07)' },
  backBtn: { color: colors.purple, fontSize: 14, fontWeight: '500' },
  modalTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  modalScroll: { flex: 1, padding: 16 },
  saldoBox: { backgroundColor: 'rgba(108,74,242,0.12)', borderWidth: 0.5, borderColor: 'rgba(108,74,242,0.3)', borderRadius: 10, padding: 16, marginBottom: 18, alignItems: 'center' },
  saldoLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 6 },
  saldoVal: { color: '#fff', fontSize: 32, fontWeight: '300', fontFamily: 'Courier New', letterSpacing: -1 },
  saldoSub: { color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'Courier New', marginTop: 4 },
  formLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 7 },
  formInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 13, color: '#fff', fontSize: 15, fontFamily: 'Courier New', marginBottom: 6 },
  formHint: { fontSize: 11, marginBottom: 14 },
  infoBox: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: 12, marginBottom: 18 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.05)' },
  infoL: { color: 'rgba(255,255,255,0.35)', fontSize: 12 },
  infoV: { color: '#fff', fontSize: 12, fontFamily: 'Courier New' },
  confirmBtn: { borderRadius: 8, paddingVertical: 15, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  successBox: { backgroundColor: 'rgba(52,199,89,0.08)', borderWidth: 0.5, borderColor: 'rgba(52,199,89,0.25)', borderRadius: 10, padding: 20, alignItems: 'center' },
  successIcon: { fontSize: 32, color: colors.green, marginBottom: 12 },
  successTitle: { color: colors.green, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  successSub: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', lineHeight: 18 },
  // Extrato
  extSummary: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  extSumCard: { flex: 1, backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.cardBorder, borderRadius: 8, padding: 11, alignItems: 'center' },
  extSumVal: { fontSize: 16, fontWeight: '600', fontFamily: 'Courier New' },
  extSumLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 4 },
  monthLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  extRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, gap: 10, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.05)' },
  extIcon: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  extName: { color: '#fff', fontSize: 13, fontWeight: '500' },
  extDate: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'Courier New', marginTop: 2 },
  extAmt: { fontSize: 13, fontWeight: '600', fontFamily: 'Courier New' },
  statusBadge: { borderRadius: 3, paddingHorizontal: 7, paddingVertical: 2, marginTop: 3 },
  statusText: { fontSize: 10, fontWeight: '500' },
});
