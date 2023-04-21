import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { PacienteService } from "@/app/shared/services/api/paciente/PacienteService";
import { FerramentasDeDetalhe } from '@/app/shared/components';
import { LayoutBaseDePagina } from '@/app/shared/layouts';


interface IFormData {
  paciente_nome: string;
  paciente_cpf: string;
  paciente_nascimento: string;
  paciente_telefone: string;
  paciente_residencia: string;
  paciente_comorbidades: string;
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  paciente_nome: yup.string().required('O nome é obrigatório').min(3, 'O nome deve ter no mínimo 3 caracteres'),
  paciente_cpf: yup.string().required('O CPF é obrigatório').min(14, 'O CPF deve ter no mínimo 11 caracteres'),
  paciente_nascimento: yup.string().required('A data de nascimento é obrigatória'),
  paciente_telefone: yup.string().required('O telefone é obrigatório').min(14, 'O telefone deve ter no mínimo 11 caracteres'),
  paciente_residencia: yup.string().required('A residência é obrigatória').min(3, 'A residência deve ter no mínimo 3 caracteres'),
  paciente_comorbidades: yup.string().required('As comorbidades são obrigatórias').min(3, 'As comorbidades devem ter no mínimo 3 caracteres'),

});

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
            navigate('/paciente');
          } else {
            setNome(result.paciente_nome);
          }
        });
    }
  }, [navigate, paciente_id]);


  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      PacienteService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/paciente');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={paciente_id === 'novo' ? 'Novo Paciente' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Novo'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={paciente_id !== 'novo'}
          mostrarBotaoApagar={paciente_id !== 'novo'}

          aoClicarEmVoltar={() => navigate('/paciente')}
          aoClicarEmApagar={() => handleDelete(Number(paciente_id))}
          aoClicarEmNovo={() => navigate('/paciente/detalhe/novo')}
        />
      }
    >
      <p>
        Detalhe de Paciente: {paciente_id}
      </p>
    </LayoutBaseDePagina>
  );
};