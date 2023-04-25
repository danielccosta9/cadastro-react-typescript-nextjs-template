import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { HospitalService } from "@/app/shared/services/api/hospital/HospitalService";
import { FerramentasDeDetalhe } from '@/app/shared/components';
import { LayoutBaseDePagina } from '@/app/shared/layouts';
import { IVFormErrors, VForm, VTextField, useVForm } from '@/app/shared/forms';
import { Form } from '@unform/web';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';


interface IFormData {
  hospitalNome: string;
  hospitalEstado: string;
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  hospitalNome: yup.string().required('Nome é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
  hospitalEstado: yup.string().required('Estado é obrigatório').min(2, 'Estado deve ter no mínimo 2 caracteres'),
});

export const DetalheDeHospital: React.FC = () => {
  const { id = 'novo' } = useParams<'id'>();
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);
      HospitalService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
            navigate('/hospital');
          } else {
            setNome(result.hospitalNome);
            console.log(result);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        hospitalNome: '',
        hospitalEstado: '',
      });
    }
  }, [formRef, navigate, id]);

  const handleSave = (dados: IFormData) => {

    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'novo') {
          HospitalService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/hospital');
                } else {
                  navigate(`/hospital/detalhe/${result}`);
                }
              }
            });
        } else {
          HospitalService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/hospital');
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
      HospitalService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/hospital');
          }
        });
    }
  };


  return (
    <LayoutBaseDePagina
      titulo={id === 'novo' ? 'Novo Hospital' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Novo'
          mostrarBotaoNovo={id !== 'novo'}
          mostrarBotaoApagar={id !== 'novo'}

          aoClicarEmVoltar={() => navigate('/hospital')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/hospital/detalhe/novo')}
          aoClicarEmSalvar={() => formRef.current?.submitForm()}
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
            <Typography variant="h6" component="div" sx={{ p: 2 }}> Cadastrar Hospital </Typography>
          </Grid>
          
          <Grid container direction="row" padding={2} spacing={2}>
            <Grid item xs={12} sm={6}>
              <VTextField
                name='hospitalNome'
                label='Nome'
                variant='outlined'
                fullWidth
                disabled={isLoading}
                onChange={(e) => { setNome(e.target.value); }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <VTextField
                name='hospitalEstado'
                label='Estado'
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