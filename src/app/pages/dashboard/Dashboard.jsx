import { LayoutBaseDePagina } from '@/app/shared/layouts';
import { CardDashboard } from './card-list/index';
import { Box, Paper } from '@mui/material';


export const Dashboard = () => {

  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginTop: '3rem',
        }}        
      >
        <CardDashboard />
      </Box>

    </LayoutBaseDePagina>
  );
};