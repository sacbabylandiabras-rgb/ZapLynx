import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

export interface PainelData {
  campaigns: number;
  templates: number;
  contacts: number;
  total: number;
  sent: number;
  delivered: number;
  failed: number;
  pixGerado: number; // em centavos
  vendaAprovada: number; // em centavos
  cpa: number;
}

export interface PagamentosData {
  saldoDisponivel: number;
  liquidoTotal: number;
  sacadoTotal: number;
  vendasAprovadas: number;
  volumeAprovado: number;
  taxaAprovacao: number;
  ticketMedio: number;
  extrato: ExtratoItem[];
}

export interface ExtratoItem {
  id: string;
  type: 'in' | 'out';
  name: string;
  date: string;
  amount: number; // centavos, positivo
  status: 'approved' | 'pending' | 'rejected';
}

const FEE_PCT = 0.0699;
const FEE_FIXED = 199; // centavos

export function usePainelData() {
  const [data, setData] = useState<PainelData>({
    campaigns: 0, templates: 0, contacts: 0,
    total: 0, sent: 0, delivered: 0, failed: 0,
    pixGerado: 0, vendaAprovada: 0, cpa: 0,
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [c, t, total, sent, delivered, failed, phones, txs] = await Promise.all([
        supabase.from('campaigns').select('id', { count: 'exact', head: true }),
        supabase.from('message_templates').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('campaign_sends').select('id', { count: 'exact', head: true }),
        supabase.from('campaign_sends').select('id', { count: 'exact', head: true }).in('status', ['sent', 'delivered']),
        supabase.from('campaign_sends').select('id', { count: 'exact', head: true }).in('status', ['sent', 'delivered']),
        supabase.from('campaign_sends').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
        supabase.from('campaign_sends').select('phone').limit(1000),
        supabase.from('gateway_transactions').select('amount,status').limit(1000),
      ]);

      const pixGerado = (txs.data || []).reduce((s, r: any) => s + (r.amount || 0), 0);
      const vendaAprovada = (txs.data || [])
        .filter((r: any) => ['approved', 'paid', 'completed'].includes(r.status))
        .reduce((s, r: any) => s + (r.amount || 0), 0);
      const totalSends = total.count || 0;
      const approvedTx = (txs.data || []).filter((r: any) => ['approved', 'paid', 'completed'].includes(r.status)).length;
      const cpa = approvedTx > 0 && totalSends > 0 ? totalSends / approvedTx : 0;

      setData({
        campaigns: c.count || 0,
        templates: t.count || 0,
        contacts: new Set((phones.data || []).map((p: any) => p.phone)).size,
        total: totalSends,
        sent: sent.count || 0,
        delivered: delivered.count || 0,
        failed: failed.count || 0,
        pixGerado,
        vendaAprovada,
        cpa,
      });
    } catch (e) {
      console.warn('painel load error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load };
}

export function usePagamentosData() {
  const [data, setData] = useState<PagamentosData>({
    saldoDisponivel: 0, liquidoTotal: 0, sacadoTotal: 0,
    vendasAprovadas: 0, volumeAprovado: 0, taxaAprovacao: 0, ticketMedio: 0,
    extrato: [],
  });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const [txRes, wdRes] = await Promise.all([
        supabase.from('gateway_transactions')
          .select('id,amount,fee,net,status,customer_name,created_at')
          .order('created_at', { ascending: false })
          .limit(500),
        supabase.from('gateway_withdrawals')
          .select('id,amount,status,created_at')
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      const txs = txRes.data || [];
      const wds = wdRes.data || [];
      const isApproved = (s: string) => ['approved', 'paid', 'completed'].includes(s);

      const txs30 = txs.filter((t: any) => t.created_at >= since);
      const aprovadas30 = txs30.filter((t: any) => isApproved(t.status));
      const volumeAprovado = aprovadas30.reduce((s, t: any) => s + (t.amount || 0), 0);
      const taxaAprovacao = txs30.length > 0 ? (aprovadas30.length / txs30.length) * 100 : 0;
      const ticketMedio = aprovadas30.length > 0 ? volumeAprovado / aprovadas30.length : 0;

      const liquidoTotal = txs.filter((t: any) => isApproved(t.status))
        .reduce((s, t: any) => s + (t.net || (t.amount - (t.fee || 0))), 0);
      const sacadoTotal = wds.filter((w: any) => isApproved(w.status))
        .reduce((s, w: any) => s + (w.amount || 0), 0);
      const sacadoPendente = wds.filter((w: any) => w.status === 'pending')
        .reduce((s, w: any) => s + (w.amount || 0), 0);
      const saldoDisponivel = Math.max(0, liquidoTotal - sacadoTotal - sacadoPendente);

      const extrato: ExtratoItem[] = [
        ...wds.map((w: any) => ({
          id: 'w-' + w.id,
          type: 'out' as const,
          name: 'Saque PIX',
          date: w.created_at,
          amount: w.amount || 0,
          status: (isApproved(w.status) ? 'approved' : w.status === 'rejected' ? 'rejected' : 'pending') as any,
        })),
        ...txs.map((t: any) => ({
          id: 't-' + t.id,
          type: 'in' as const,
          name: t.customer_name || 'Cliente',
          date: t.created_at,
          amount: t.amount || 0,
          status: (isApproved(t.status) ? 'approved' : t.status === 'rejected' ? 'rejected' : 'pending') as any,
        })),
      ].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 50);

      setData({
        saldoDisponivel, liquidoTotal, sacadoTotal,
        vendasAprovadas: aprovadas30.length,
        volumeAprovado, taxaAprovacao, ticketMedio,
        extrato,
      });
    } catch (e) {
      console.warn('pagamentos load error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, reload: load };
}

export interface TelegramData {
  bots: number;
  msgsHoje: number;
  conversas: number;
  vendasAprovadasMes: number;
}

export function useTelegramData() {
  const [data, setData] = useState<TelegramData>({ bots: 0, msgsHoje: 0, conversas: 0, vendasAprovadasMes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const startMonth = new Date();
        startMonth.setDate(1);
        startMonth.setHours(0, 0, 0, 0);
        const startToday = new Date();
        startToday.setHours(0, 0, 0, 0);

        // Tabelas telegram podem não existir nesse projeto — usar try/catch silencioso
        let bots = 0, msgsHoje = 0, conversas = 0;
        try {
          const r = await (supabase as any).from('telegram_bots').select('id', { count: 'exact', head: true });
          bots = r.count || 0;
        } catch {}
        try {
          const r = await (supabase as any).from('telegram_messages')
            .select('chat_id', { count: 'exact' })
            .gte('created_at', startToday.toISOString());
          msgsHoje = r.count || 0;
          conversas = new Set((r.data || []).map((x: any) => x.chat_id)).size;
        } catch {}

        const txs = await supabase.from('gateway_transactions')
          .select('id,status', { count: 'exact' })
          .gte('created_at', startMonth.toISOString())
          .in('status', ['approved', 'paid', 'completed']);

        setData({
          bots,
          msgsHoje,
          conversas,
          vendasAprovadasMes: txs.count || 0,
        });
      } catch (e) {
        console.warn('telegram load', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading };
}

export const formatBRL = (cents: number) => {
  const v = (cents / 100);
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const formatDateBR = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yy} · ${hh}:${mi}`;
};
