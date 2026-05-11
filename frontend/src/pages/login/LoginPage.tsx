import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from './api/authApi';
import { Button } from '../../components/ui/Button';
import heroImg from '../../assets/imagem_med.png';
import logoImg from '../../assets/Logo.png';
import './styles.scss';

const schema = yup.object({
  username: yup.string().required('Obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
});

export const LoginPage = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: (data) => {
      setSession(data.access_token, data.user);
      navigate('/escolas', { replace: true });
    },
  });

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: schema,
    onSubmit: (values) => mutate(values),
  });

  return (
    <div className="login-page">
      {/* Background: foto + overlay teal + padrão de ícones */}
      <img src={heroImg} alt="" className="login-page__bg" />
      <div className="login-page__overlay" />
      <div className="login-page__pattern" aria-hidden="true">
        {Array.from({ length: 48 }).map((_, i) => (
          <LupaIcon key={i} />
        ))}
      </div>

      {/* Card centralizado */}
      <div className="login-page__card">
        <img src={logoImg} alt="Lupa" className="login-page__logo" />
        <h2 className="login-page__welcome">Bem-Vindo (a)</h2>

        <form onSubmit={formik.handleSubmit} noValidate className="login-page__form">
          {/* Usuário */}
          <div className="login-field">
            <label htmlFor="username" className="login-field__label">Usuário</label>
            <input
              id="username"
              className={[
                'login-field__input',
                formik.touched.username && formik.errors.username ? 'login-field__input--error' : '',
              ].filter(Boolean).join(' ')}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Digite o usuário"
              autoComplete="username"
            />
            {formik.touched.username && formik.errors.username && (
              <small className="login-field__error">{formik.errors.username}</small>
            )}
          </div>

          {/* Senha */}
          <div className="login-field">
            <label htmlFor="password" className="login-field__label">Senha</label>
            <div className="login-field__password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={[
                  'login-field__input',
                  formik.touched.password && formik.errors.password ? 'login-field__input--error' : '',
                ].filter(Boolean).join(' ')}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Placeholder"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-field__eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                tabIndex={-1}
              >
                <i className={`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`} />
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <small className="login-field__error">{formik.errors.password}</small>
            )}
          </div>

          {isError && <p className="login-page__error">Usuário ou senha inválidos</p>}

          <Button label="Entrar" type="submit" loading={isPending} fullWidth size="lg" />
        </form>

        <button type="button" className="login-page__forgot">
          Recuperar a senha
        </button>

        <div className="login-page__divider" />

        <button type="button" className="login-page__no-access">
          Não tem acesso?&nbsp;<strong>Clique aqui</strong>
        </button>
      </div>
    </div>
  );
};

// Ícone da lupa para o padrão de fundo
const LupaIcon = () => (
  <svg
    className="login-page__pattern-icon"
    viewBox="0 0 48 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="22" cy="22" r="16" stroke="white" strokeWidth="3.5" fill="none" />
    <circle cx="22" cy="22" r="7" fill="none" stroke="white" strokeWidth="3" />
    <circle cx="22" cy="22" r="3" fill="white" />
    <line x1="33" y1="33" x2="43" y2="45" stroke="white" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
