import { BrowserRouter } from 'react-router-dom';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from 'primereact/api';
import axios from 'axios';
import { AppRoutes } from './routes';
import { toastService } from './lib/toast';

import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './styles/global.scss';

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        const text = Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Erro inesperado');
        toastService.error(text);
      } else {
        toastService.error('Erro inesperado');
      }
    },
  }),
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 2 },
  },
});

const App = () => (
  <PrimeReactProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  </PrimeReactProvider>
);

export default App;
