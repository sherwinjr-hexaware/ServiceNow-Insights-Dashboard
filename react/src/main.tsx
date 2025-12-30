import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import BreakpointsProvider from 'providers/BreakpointsProvider';

import SettingsPanelProvider from 'providers/SettingsPanelProvider';

import SettingsProvider from 'providers/SettingsProvider';

import ThemeProvider from 'providers/ThemeProvider';

import router from 'routes/router';

import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
<StrictMode>
<SettingsProvider>
<ThemeProvider>
<BreakpointsProvider>
<SettingsPanelProvider>
<RouterProvider router={router} />
</SettingsPanelProvider>
</BreakpointsProvider>
</ThemeProvider>
</SettingsProvider>
</StrictMode>

);
 