import { LayoutBaseDePagina } from '@/app/shared/layouts';
import { FerramentasDeDetalhe } from '@/app/shared/components';
import { CardDashboard } from './card-list/index';


export const Dashboard = () => {

  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
      barraDeFerramentas={
        <FerramentasDeDetalhe 
          mostrarBotaoSalvar
          mostrarBotaoSalvarEFechar
          />
      }
    >
      <CardDashboard />
      
    </LayoutBaseDePagina>
  );
};