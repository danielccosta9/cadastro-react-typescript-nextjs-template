'use client';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../shared/contexts';
import { useEffect } from 'react';
import { Dashboard } from '../pages';

export const AppRoutes = () => {
    const { setDrawerOptions } = useDrawerContext();

    useEffect(() => {
        setDrawerOptions([
            {
                label: 'Dashboard',
                icon: 'dashboard',
                path: '/dashboard',
            },
        ]);
    }, [setDrawerOptions]);

    return (
        <Routes>
            <Route path="/dashboard" element={
               <Dashboard />
            } />
            
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}