import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_MODEL } from '../../constants/models';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode:     false,
    sidebarOpen:  true,
    selectedModel: DEFAULT_MODEL,
  },
  reducers: {
    toggleDark(state)       { state.darkMode    = !state.darkMode; },
    toggleSidebar(state)    { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, { payload }) { state.sidebarOpen = payload; },
    setModel(state, { payload }) { state.selectedModel = payload; },
  },
});

export const { toggleDark, toggleSidebar, setSidebarOpen, setModel } = uiSlice.actions;
export default uiSlice.reducer;

// Selectors
export const selectDarkMode     = (s) => s.ui.darkMode;
export const selectSidebarOpen  = (s) => s.ui.sidebarOpen;
export const selectModel        = (s) => s.ui.selectedModel;
