import { Provider } from 'react-redux';
import { store } from './redux/store';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Demo } from './Demo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Demo />
    </Provider>
  </StrictMode>
)