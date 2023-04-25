import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { Form } from '@unform/web';
import * as yup from 'yup';

import { PacienteService } from "@/app/shared/services/api/paciente/PacienteService";
import { FerramentasDeDetalhe } from '@/app/shared/components';
import { LayoutBaseDePagina } from '@/app/shared/layouts';
import { IVFormErrors, VTextField, useVForm } from '@/app/shared/forms';


interface IFormData {
  pacienteNome: string;
  pacienteCPF: string;
  pacienteNascimento: string;
  pacienteTelefone: string;
  pacienteResidencia: string;
  pacienteComorbidade: string;
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  pacienteNome: yup.string().required('O nome é obrigatório').min(3, 'O nome deve ter no mínimo 3 caracteres'),
  pacienteCPF: yup.string().required('O CPF é obrigatório').min(14, 'O CPF deve ter no mínimo 11 caracteres'),
  pacienteNascimento: yup.string().required('A data de nascimento é obrigatória'),
  pacienteTelefone: yup.string().required('O telefone é obrigatório').min(14, 'O telefone deve ter no mínimo 11 caracteres'),
  pacienteResidencia: yup.string().required('A residência é obrigatória').min(3, 'A residência deve ter no mínimo 3 caracteres'),
  pacienteComorbidade: yup.string().required('A comorbidade é obrigatória').min(3, 'A comorbidade deve ter no mínimo 3 caracteres'),

});

export const DetalheDePacientes: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);
      PacienteService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (isSaveAndClose()) {
              navigate('/paciente');
            } else {
              setNome(result.pacienteNome);
              formRef.current?.setData(result);
              navigate(`/paciente/detalhe/${result}`);
            }
          }
        });
    } else {
      formRef.current?.setData({
        pacienteNome: '',
        pacienteCPF: '',
        pacienteNascimento: '',
        pacienteTelefone: '',
        pacienteResidencia: '',
        pacienteComorbidade: '',
      });
    }
  }, [formRef, navigate, id, isSaveAndClose]);

  const handleSave = (dados: IFormData) => {

    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'novo') {
          PacienteService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/paciente');
                } else {
                  navigate(`/paciente/detalhe/${result}`);
                }
              }
            });
        } else {
          PacienteService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/paciente');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErrors = {};

        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };



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
      titulo={id === 'novo' ? 'Novo Paciente' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Novo'
          mostrarBotaoNovo={id !== 'novo'}
          mostrarBotaoApagar={id !== 'novo'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/paciente')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/paciente/detalhe/novo')}
        />
      }
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">

          {isLoading && (
            <Grid item >
              <LinearProgress />
            </Grid>
          )}

          <Grid item>
            <Typography variant="h6" component="div" sx={{ p: 2 }}> Cadastrar Paciente </Typography>
          </Grid>

          <Grid container direction="row" padding={2} spacing={2}>
            <Grid item xs={12} sm={6}>
              <VTextField
                name='pacienteNome'
                label='Nome'
                variant='outlined'
                fullWidth
                disabled={isLoading}
                onChange={(e) => { setNome(e.target.value) }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <VTextField
                name='pacienteNascimento'
                label='Data de Nascimento'
                variant='outlined'
                fullWidth
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <VTextField
                name='pacienteCPF'
                label='CPF'
                variant='outlined'
                fullWidth
                disabled={isLoading}
              />
            </Grid>

          </Grid>
          <Grid container direction="row" padding={2} spacing={2}>

            <Grid item xs={12} sm={3}>
              <VTextField
                name='pacienteTelefone'
                label='Telefone'
                variant='outlined'
                fullWidth
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <VTextField
                name='pacienteResidencia'
                label='Residência'
                variant='outlined'
                fullWidth
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <VTextField
                name='pacienteComorbidade'
                label='Comorbidade'
                variant='outlined'
                fullWidth
                disabled={isLoading}
              />
            </Grid>
          </Grid>
        </Box>
      </Form>
    </LayoutBaseDePagina >
  );
};