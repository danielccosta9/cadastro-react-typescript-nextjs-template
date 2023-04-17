import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PacienteService } from '@/app/shared/services/api/paciente/PacienteService';
import { FerramentasDeDetalhe } from '@/app/shared/components';
import { LayoutBaseDePagina } from '@/app/shared/layouts';


export const DetalheDepacientes: React.FC = () => {
  const { paciente_id = 'novo' } = useParams<'paciente_id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (paciente_id !== 'novo') {
      setIsLoading(true);

      PacienteService.getById(Number(paciente_id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/pacientes');
          } else {
            setNome(result.paciente_nome);
            console.log(result);
          }
        });
    }
  }, [navigate, paciente_id]);


  const handleSave = () => {
    console.log('Save');
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      PacienteService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/pacientes');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={paciente_id === 'novo' ? 'Novo pessoa' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Novo'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={paciente_id !== 'novo'}
          mostrarBotaoApagar={paciente_id !== 'novo'}

          aoClicarEmSalvar={handleSave}
          aoClicarEmSalvarEFechar={handleSave}
          aoClicarEmVoltar={() => navigate('/pacientes')}
          aoClicarEmApagar={() => handleDelete(Number(paciente_id))}
          aoClicarEmNovo={() => navigate('/pacientes/detalhe/novo')}
        />
      }
    >

      {isLoading && (
        <LinearProgress variant='indeterminate' />
      )}

      <p>DetalheDePacientes {paciente_id}</p>
    </LayoutBaseDePagina>
  );
};