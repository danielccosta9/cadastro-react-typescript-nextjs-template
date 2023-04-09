import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  ListagemDePacientes,
} from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'dashboard',
        path: '/dashboard',
        label: 'Dashboard',
      },
      {
        icon: 'people',
        path: '/pacientes',
        label: 'Pacientes',
      },
    ]);
  }, [ setDrawerOptions]);

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pacientes" element={<ListagemDePacientes />} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};