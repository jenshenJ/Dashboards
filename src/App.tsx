import { ThemeProvider } from '@gravity-ui/uikit';

import { AsideHeader } from './ui/components/AsideHeader/AsideHeader.tsx';

import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';

import './App.scss'
import { AuthProvider } from './ui/auth/AuthContext.tsx';


function App() {
  return (
    <ThemeProvider theme='light'>
      <AuthProvider>
        <AsideHeader/>
      </AuthProvider>
    </ThemeProvider>
  )
}
export default App;
