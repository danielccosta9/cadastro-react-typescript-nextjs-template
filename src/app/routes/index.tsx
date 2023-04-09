import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  ListagemDePacientes,
  ListagemDeHospitais,
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
      {
        icon: 'local_hospital',
        path: '/hospitais',
        label: 'Hospitais',
      },
    ]);
  }, [ setDrawerOptions]);

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pacientes" element={<ListagemDePacientes />} />
      <Route path="/hospitais" element={<ListagemDeHospitais />} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};