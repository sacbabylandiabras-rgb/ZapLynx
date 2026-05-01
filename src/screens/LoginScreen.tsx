import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useAuth } from '../AuthContext';
import { colors } from '../theme';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) setError(res.error || 'E-mail ou senha incorretos.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.blob1} />
      <View style={styles.blob2} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.iconBox}>
              <Svg width={38} height={38} viewBox="0 0 38 38">
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
              <Text style={styles.zap}>ZAP</Text>
              <Text style={styles.lynx}>LYNX</Text>
            </View>
            <Text style={styles.tagline}>Gateway e automação inteligente para o seu negócio</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="rgba(255,255,255,0.2)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Senha</Text>
            <View style={styles.pwdWrap}>
              <TextInput
                style={[styles.input, { paddingRight: 46 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.2)"
                secureTextEntry={!showPwd}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPwd(!showPwd)}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>{showPwd ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
              <LinearGradient
                colors={['#9333ea', '#c026d3', '#db2777']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.loginBtn}
              >
                <Text style={styles.loginBtnText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  blob1: {
    position: 'absolute', top: -120, left: '50%', marginLeft: -210,
    width: 420, height: 420, borderRadius: 210,
    backgroundColor: 'rgba(200,80,220,0.18)',
  },
  blob2: {
    position: 'absolute', bottom: -60, left: '50%', marginLeft: -170,
    width: 340, height: 340, borderRadius: 170,
    backgroundColor: 'rgba(130,60,200,0.12)',
  },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },
  logoSection: { alignItems: 'center', marginTop: 80, marginBottom: 52 },
  iconBox: {
    width: 72, height: 72, borderRadius: 18,
    backgroundColor: '#1e1a35',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  textRow: { flexDirection: 'row' },
  zap: { color: '#fff', fontSize: 30, fontWeight: '700', letterSpacing: -1 },
  lynx: { fontSize: 30, fontWeight: '700', letterSpacing: -1, color: '#c084fc' },
  tagline: { color: 'rgba(255,255,255,0.22)', fontSize: 12, textAlign: 'center', marginTop: 10, lineHeight: 18, maxWidth: 220 },
  form: { width: '100%' },
  fieldLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 7 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8, padding: 14,
    color: '#fff', fontSize: 15,
  },
  pwdWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 13, top: 14 },
  forgot: { alignSelf: 'flex-end', marginTop: 8, marginBottom: 28 },
  forgotText: { color: 'rgba(180,100,240,0.7)', fontSize: 12 },
  errorText: { color: '#ff6b6b', fontSize: 12, textAlign: 'center', marginBottom: 12 },
  loginBtn: { borderRadius: 8, paddingVertical: 15, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: '600', letterSpacing: 0.2 },
});
