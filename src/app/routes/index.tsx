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
                label: 'Home',
                icon: 'home',
                path: '/home',
            },
        ]);
    }, [setDrawerOptions]);

    return (
        <Routes>
            <Route path="/home" element={
               <Dashboard />
            } />
            
            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    );
}