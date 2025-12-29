import { useEffect, useLayoutEffect } from 'react';

import { Outlet, useLocation } from 'react-router-dom';

import { useSettingsContext } from 'providers/SettingsProvider';

import { REFRESH } from 'reducers/SettingsReducer';

import SettingPanelToggler from 'components/settings-panel/SettingPanelToggler';

import SettingPanel from 'components/settings-panel/SettingsPanel';

import { AuthProvider } from 'providers/AuthProvider';

const App = () => {

  const { pathname } = useLocation();

  const { configDispatch } = useSettingsContext();

  // Scroll to top on route change

  useEffect(() => {

    window.scrollTo(0, 0);

  }, [pathname]);

  // Refresh settings configuration on mount

  useLayoutEffect(() => {

    configDispatch({ type: REFRESH });

  }, [configDispatch]);

  return (
<AuthProvider>

      {/* The Outlet renders the matched child route from router.tsx */}
<Outlet />

      {/* Template specific UI components */}
<SettingPanel />
<SettingPanelToggler />
</AuthProvider>

  );

};

export default App;
 