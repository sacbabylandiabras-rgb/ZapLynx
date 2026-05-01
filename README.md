# Zaplynx Pay — Mobile (Expo / React Native)

App iOS/Android conectado ao Supabase do ZapLynx. Login real (mesmo login do painel web) e dados ao vivo.

## Setup

```bash
npm install
npx expo start
```

## Build iOS (EAS)

```bash
npm run build:ios
```

## Estrutura

- `src/lib/supabase.ts` — Cliente Supabase (URL + anon key públicas).
- `src/AuthContext.tsx` — Login/logout via `supabase.auth.signInWithPassword`.
- `src/lib/useDashboardData.ts` — Hooks `usePainelData`, `usePagamentosData`, `useTelegramData`.
- `src/screens/LoginScreen.tsx` — Login real.
- `src/screens/PainelScreen.tsx` — Métricas reais (campanhas, modelos, contatos, mensagens, financeiro, CPA).
- `src/screens/PagamentosScreen.tsx` — Saldo, vendas, taxa, ticket, extrato real.
- `src/screens/TelegramScreen.tsx` — Bots e vendas aprovadas do mês.

## Notas

- Todas as queries respeitam RLS (Row-Level Security) do Supabase: cada usuário vê apenas seus próprios dados.
- Os valores monetários no banco estão em centavos.
- Cálculo de saldo: `liquidoTotal - sacadoTotal - sacadoPendente`.
- Taxa: 6.99% + R$ 1,99 por transação (referência usada apenas no admin web).
