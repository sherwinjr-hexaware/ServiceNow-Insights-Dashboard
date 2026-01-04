import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import BreakpointsProvider from 'providers/BreakpointsProvider';
import { RefreshProvider } from 'providers/RefreshProvider';
import SettingsPanelProvider from 'providers/SettingsPanelProvider';
import SettingsProvider from 'providers/SettingsProvider';
import ThemeProvider from 'providers/ThemeProvider';
// Import RefreshProvider
import router from 'routes/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ThemeProvider>
        <BreakpointsProvider>
          <SettingsPanelProvider>
            <RefreshProvider>
              {' '}
              {/* Wrap RouterProvider with RefreshProvider */}
              <RouterProvider router={router} />
            </RefreshProvider>
          </SettingsPanelProvider>
        </BreakpointsProvider>
      </ThemeProvider>
    </SettingsProvider>
  </StrictMode>,
);
