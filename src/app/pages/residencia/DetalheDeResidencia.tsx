import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { Form } from '@unform/web';
import * as yup from 'yup';

import { ResidenciaService } from "@/app/shared/services/api/residencia/ResidenciaService";
import { FerramentasDeDetalhe } from '@/app/shared/components';
import { LayoutBaseDePagina } from '@/app/shared/layouts';
import { IVFormErrors, VTextField, useVForm } from '@/app/shared/forms';


interface IFormData {
  tipo: string;
  nome: string;
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  tipo: yup.string().required('Opção de local é obrigatório'),
  nome: yup.string().required('Nome é obrigatório').min(3),
});


export const DetalheDeResidencias: React.FC = () => {
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();


  const [isLoading, setIsLoading] = useState(false);
  const [tipo, setTipo] = useState('');
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'novo') {
      setIsLoading(true);
      ResidenciaService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/residencia');
          } else {
            setTipo(result.tipo);
            setNome(result.nome);
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        tipo: '',
        nome: '',
      });
    }
  }, [formRef, id, navigate]);


  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);
        if (id === 'novo') {
          ResidenciaService
            .create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/residencia');
                } else {
                  navigate(`/residencia/detalhe/${result}`);
                }
              }
            });
        } else {
          ResidenciaService
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/residencia');
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
      ResidenciaService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/residencia');
          }
        });
    }
  };

  const optionResidencia = [
    { value: 1, label: 'BAIRRO' },
    { value: 2, label: 'SÍTIO' },
  ];
  


  return (
    <LayoutBaseDePagina
      titulo={id === 'nova' ? 'Nova Localidade' : `${tipo} - ${nome}`}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Nova'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
          aoClicarEmVoltar={() => navigate('/residencia')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/residencia/detalhe/nova')}
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
            <Typography variant="h6" component="div" sx={{ p: 2 }}> Cadastrar Residencia </Typography>
          </Grid>

          <Grid container direction="row" padding={2} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={
                  optionResidencia.map((tipo) => tipo.label)
                }
                onInputChange={(event, value) => setTipo(value)}
                getOptionLabel={(tipo) => tipo.toString()} 
                renderInput={(params) => <VTextField {...params} name='tipo' label='Tipo' variant='outlined' fullWidth disabled={isLoading} value='local'/>}
                onChange={(_, value) => setTipo(value?.toString() || '')}
                value={tipo}
                
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <VTextField
                name='nome'
                label='Nome'
                variant='outlined'
                fullWidth
                disabled={isLoading}
                onChange={(e) => { setNome(e.target.value); }}
              />
            </Grid>
          </Grid>
        </Box>
      </Form>
    </LayoutBaseDePagina>
  );
};

function setOpcoes(arg0: any) {
  throw new Error('Function not implemented.');
}
