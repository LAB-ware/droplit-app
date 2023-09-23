import './App.scss';

import { useNavigate } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import config from '../config';
import Header from '../components/Header/Header';
import Routes from '../components/Routes';

const oktaAuth = new OktaAuth(config.oidc);

function App() {
  const navigate = useNavigate();

  const restoreOriginalUri = (_oktaAuth, originalUri) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Header />
      <div class='content'>
        <Routes />
      </div>
    </Security>
  );
}

export default App;
