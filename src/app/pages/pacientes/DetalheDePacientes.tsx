import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { PacienteService } from "@/app/shared/services/api/paciente/PacienteService";
import { FerramentasDeDetalhe } from '@/app/shared/components';
import { LayoutBaseDePagina } from '@/app/shared/layouts';
import { IVFormErrors, VForm, VTextField, useVForm } from '@/app/shared/forms';
import { Form } from '@unform/web';


interface IFormData {
  paciente_nome: string;
  paciente_cpf: string;
  paciente_nascimento: string;
  paciente_telefone: string;
  paciente_residencia: string;
  paciente_comorbidade: string;
}
const formValidationSchema: yup.Schema<IFormData> = yup.object().shape({
  paciente_nome: yup.string().required('O nome é obrigatório').min(3, 'O nome deve ter no mínimo 3 caracteres'),
  paciente_cpf: yup.string().required('O CPF é obrigatório').min(14, 'O CPF deve ter no mínimo 11 caracteres'),
  paciente_nascimento: yup.string().required('A data de nascimento é obrigatória'),
  paciente_telefone: yup.string().required('O telefone é obrigatório').min(14, 'O telefone deve ter no mínimo 11 caracteres'),
  paciente_residencia: yup.string().required('A residência é obrigatória').min(3, 'A residência deve ter no mínimo 3 caracteres'),
  paciente_comorbidade: yup.string().required('As comorbidades são obrigatórias').min(3, 'As comorbidades devem ter no mínimo 3 caracteres'),

});

export const DetalheDepacientes: React.FC = () => {
  const { paciente_id = 'novo' } = useParams<'paciente_id'>();
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
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
            formRef.current?.setData(result);
          }
        });
    }
  }, [formRef, navigate, paciente_id]);

  const handleSave = (data: IFormData) => {
    setIsLoading(true);
    if (paciente_id === 'novo') {
      PacienteService.create(data)
        .then(result => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro salvo com sucesso!');
            navigate('/pacientes');
          }
        });
    } else {
      PacienteService.updateById(Number(paciente_id), {paciente_id: Number(paciente_id), ...data})
        .then(result => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro salvo com sucesso!');
            navigate('/pacientes');
          }
        });
    }
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
      titulo={paciente_id === 'novo' ? 'Novo Paciente' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Novo'
          mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={paciente_id !== 'novo'}
          mostrarBotaoApagar={paciente_id !== 'novo'}

          aoClicarEmVoltar={() => navigate('/pacientes')}
          aoClicarEmApagar={() => handleDelete(Number(paciente_id))}
          aoClicarEmNovo={() => navigate('/pacientes/detalhe/novo')}
          aoClicarEmSalvarEFechar={() => formRef.current?.submitForm()}
          aoClicarEmSalvar={() => formRef.current?.submitForm()}
        />
      }
    >
      <Form ref={formRef} onSubmit={handleSave}>
        <VTextField name='paciente_nome' label='Nome' />
        <VTextField name='paciente_cpf' label='CPF' />
        <VTextField name='paciente_nascimento' label='Data de Nascimento' />
        <VTextField name='paciente_telefone' label='Telefone' />
        <VTextField name='paciente_residencia' label='Residência' />
        <VTextField name='paciente_comorbidade' label='Comorbidades' />
      </Form>

    </LayoutBaseDePagina >
  );
};