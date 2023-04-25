import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import {
  Dashboard,

  DetalheDeAgenda,
  DetalheDeHospital,
  DetalheDePacientes,
  
  ListagemDaAgenda,
  ListagemDeHospitais,
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
      <Route path="/hospital" element={<ListagemDeHospitais />} />
      <Route path="/paciente" element={<ListagemDePacientes />} />

      <Route path="/agenda/detalhe/:id" element={<DetalheDeAgenda />} />
      <Route path="/hospital/detalhe/:id" element={<DetalheDeHospital />} />
      <Route path="/paciente/detalhe/:id" element={<DetalheDePacientes />} />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};