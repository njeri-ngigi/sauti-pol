import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { Provider } from 'react-redux';
import store from '@/store/store';
import { Bounce, ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/providers/AuthProvider';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer
          limit={3}
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          pauseOnFocusLoss={false}
          transition={Bounce}
          closeOnClick
          pauseOnHover
          draggable
        />
      </AuthProvider>
    </Provider>
  );
}

// TODO
// can we guard all pages with auth?
