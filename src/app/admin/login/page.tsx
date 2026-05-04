'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';
import styles from '../admin.module.css';

const initialState = { error: '' };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <div className={styles.loginLogoTitle}>🪨 Moorti India</div>
          <div className={styles.loginLogoSub}>Content Management System</div>
        </div>

        <form action={formAction}>
          {state?.error && (
            <div className={styles.loginError} role="alert">
              {state.error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className={styles.formLabel} htmlFor="admin-username">
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              className={styles.formInput}
              placeholder="Enter your username"
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className={styles.formLabel} htmlFor="admin-password">
              Admin Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              className={styles.formInput}
              placeholder="Enter your admin password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.loginSubmit}
            id="admin-login-submit"
            disabled={isPending}
          >
            {isPending ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
