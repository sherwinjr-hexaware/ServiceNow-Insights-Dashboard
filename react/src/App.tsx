import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from 'providers/AuthProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import { REFRESH } from 'reducers/SettingsReducer';
import SettingPanelToggler from 'components/settings-panel/SettingPanelToggler';
import SettingPanel from 'components/settings-panel/SettingsPanel';

const App = () => {
  const { pathname } = useLocation();

  const { configDispatch } = useSettingsContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    configDispatch({ type: REFRESH });
  }, [configDispatch]);

  return (
    <AuthProvider>
      <Outlet />

      <SettingPanel />
      <SettingPanelToggler />
    </AuthProvider>
  );
};

export default App;
