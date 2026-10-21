/**
 * Écran de connexion : email + mot de passe.
 * Si la connexion réussit, Stack.Protected (dans _layout.tsx) affiche automatiquement l'app.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, PASSWORD_MIN_LENGTH } from '@/utils/validation';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuth();

  // Ce que l'utilisateur tape
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Messages d'erreur à afficher sous chaque champ ('' = pas d'erreur)
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    // 1. On vérifie les champs avant d'appeler le service
    let hasError = false;

    if (email.trim() === '') {
      setEmailError(t('errors.required'));
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError(t('errors.invalidEmail'));
      hasError = true;
    } else {
      setEmailError('');
    }

    if (password === '') {
      setPasswordError(t('errors.required'));
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      return; // on s'arrête là, les erreurs sont affichées
    }

    // 2. On essaie de se connecter
    setLoading(true);
    try {
      await signIn(email, password);
      // Pas besoin de naviguer : l'app s'affiche toute seule quand l'utilisateur est connecté
    } catch (error) {
      if (error instanceof Error && error.message === 'invalidCredentials') {
        setPasswordError(t('errors.invalidCredentials'));
      } else {
        setPasswordError(t('errors.unknown'));
      }
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      active="login"
      overline={t('auth.login.overline')}
      subtitle={t('auth.login.subtitle')}
    >
      <TextField
        label={t('auth.fields.email')}
        placeholder={t('auth.fields.emailPlaceholder')}
        value={email}
        onChangeText={setEmail}
        error={emailError}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextField
        label={t('auth.fields.password')}
        placeholder={t('auth.fields.passwordPlaceholder', { min: PASSWORD_MIN_LENGTH })}
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        secureTextEntry
        autoCapitalize="none"
      />

      <Button title={t('auth.login.submit')} onPress={handleLogin} loading={loading} />
    </AuthScreen>
  );
}
