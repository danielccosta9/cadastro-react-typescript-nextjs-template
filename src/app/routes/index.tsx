import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,
  DetalheDepacientes,
  ListagemDaAgenda,
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
        icon: 'event_available',
        path: '/agenda',
        label: 'Agenda',
      },
      {
        icon: 'accessible',
        path: '/paciente',
        label: 'Paciente',
      },
      {
        icon: 'local_hospital',
        path: '/hospital',
        label: 'Hospital',
      },
    ]);
  }, [ setDrawerOptions]);

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agenda" element={<ListagemDaAgenda />} />
      <Route path="/paciente" element={<ListagemDePacientes />} />
      <Route path="/paciente/detalhe/:id" element={<DetalheDepacientes />} />
      <Route path="/hospital" element={<ListagemDeHospitais />} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};