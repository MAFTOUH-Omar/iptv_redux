import { Provider } from 'react-redux';
import { store } from './redux/store';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import { Demo } from './Demo';
// import { PackageList } from './components/PackageList';
// import { PackageDetail } from './components/PackageDetail';
// import PackageBouquet from './components/PackageBouquet';
// import TemplatesList from './components/TemplateList';
import { TemplateDetail } from './components/TemplateDetail';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <Demo /> */}
      {/* <PackageList /> */}
      {/* <PackageDetail id={1} /> */}
      {/* <PackageBouquet /> */}
      {/* <TemplatesList /> */}
      <TemplateDetail />
    </Provider>
  </StrictMode>
)