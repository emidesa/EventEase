/**
 * Écran d'inscription : prénom et nom, email, mot de passe et acceptation des conditions.
 * Si l'inscription réussit, l'utilisateur est connecté et l'app s'affiche automatiquement.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/components/auth/AuthScreen';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextField } from '@/components/ui/TextField';
import { colors, fonts, fontSizes } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { isValidEmail, PASSWORD_MIN_LENGTH } from '@/utils/validation';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { signUp } = useAuth();

  // Ce que l'utilisateur tape
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Messages d'erreur ('' = pas d'erreur)
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    // 1. On vérifie chaque champ
    let hasError = false;

    if (name.trim() === '') {
      setNameError(t('errors.required'));
      hasError = true;
    } else {
      setNameError('');
    }

    if (email.trim() === '') {
      setEmailError(t('errors.required'));
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError(t('errors.invalidEmail'));
      hasError = true;
    } else {
      setEmailError('');
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(t('errors.passwordTooShort'));
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!acceptedTerms) {
      setTermsError(t('errors.termsRequired'));
      hasError = true;
    } else {
      setTermsError('');
    }

    if (hasError) {
      return;
    }

    // 2. On essaie de créer le compte
    setLoading(true);
    try {
      await signUp(name, email, password);
    } catch (error) {
      if (error instanceof Error && error.message === 'emailTaken') {
        setEmailError(t('errors.emailTaken'));
      } else {
        setEmailError(t('errors.unknown'));
      }
      setLoading(false);
    }
  }

  return (
    <AuthScreen
      active="register"
      overline={t('auth.register.overline')}
      subtitle={t('auth.register.subtitle')}
    >
      <TextField
        label={t('auth.fields.name')}
        placeholder={t('auth.fields.namePlaceholder')}
        value={name}
        onChangeText={setName}
        error={nameError}
        autoCapitalize="words"
      />

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
        placeholder={t('auth.fields.passwordPlaceholder')}
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        secureTextEntry
        autoCapitalize="none"
      />

      <Checkbox
        checked={acceptedTerms}
        onPress={() => setAcceptedTerms(!acceptedTerms)}
        label={t('auth.register.acceptTerms')}
      />
      {termsError ? <Text style={styles.error}>{termsError}</Text> : null}

      <Button title={t('auth.register.submit')} onPress={handleRegister} loading={loading} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  error: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.small,
    color: colors.danger,
  },
});
