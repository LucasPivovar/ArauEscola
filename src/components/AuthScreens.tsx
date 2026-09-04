'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { RoleId } from '../types';

type AuthScreenProps = {
  initialRole: RoleId;
  onLogin: (role: RoleId) => void;
  onRecover: () => void;
};

export function AuthScreen({ initialRole, onLogin, onRecover }: AuthScreenProps) {
  const [identifier, setIdentifier] = useState('lucas.silva@classconecta.com.br');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Informe CPF/e-mail e senha para entrar.');
      return;
    }
    onLogin(initialRole);
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-label="Portal ClassConecta">
        <div className="brand-row auth-brand-centered">
          <img src="/classconecta-logo.png" alt="ClassConecta" className="auth-logo-img" />
        </div>

        <div className="auth-heading">
          <h1>Entrar na sua conta</h1>
          <p>Informe suas credenciais de acesso institucional.</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="floating-field">
            <input
              id="auth-identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder=" "
              autoComplete="username"
              required
            />
            <label htmlFor="auth-identifier">CPF ou e-mail</label>
          </div>

          <div className="floating-field">
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder=" "
              autoComplete="current-password"
              required
            />
            <label htmlFor="auth-password">Senha</label>
          </div>

          <div className="auth-actions-row">
            <label className="checkbox-line">
              <input type="checkbox" defaultChecked />
              <span>Lembrar-me</span>
            </label>
            <button type="button" onClick={onRecover}>
              Esqueci minha senha
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-action full-width" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}

type RecoverScreenProps = {
  onBack: () => void;
  onSubmit: () => void;
};

export function RecoverScreen({ onBack, onSubmit }: RecoverScreenProps) {
  const [email, setEmail] = useState('');

  return (
    <main className="auth-page">
      <section className="auth-card compact" aria-label="Recuperação de senha">
        <div className="brand-row auth-brand-centered">
          <img src="/classconecta-logo.png" alt="ClassConecta" className="auth-logo-img" />
        </div>
        <div className="auth-heading">
          <h1>Recuperar senha</h1>
          <p>Informe seu e-mail institucional para receber as instruções de acesso.</p>
        </div>
        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
            onBack();
          }}
        >
          <div className="floating-field">
            <input
              id="recover-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              autoComplete="email"
              required
            />
            <label htmlFor="recover-email">E-mail institucional</label>
          </div>

          <button className="primary-action full-width" type="submit">
            Enviar instruções
          </button>
          <button className="text-action" type="button" onClick={onBack}>
            Voltar para login
          </button>
        </form>
      </section>
    </main>
  );
}
