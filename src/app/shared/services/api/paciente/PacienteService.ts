import { Environment } from "@/app/shared/environment";
import { Api } from "../axios-config";

interface IListagemPaciente {
    id: number;
    paciente_nome: string;
    paciente_cpf: string;
    paciente_nascimento: string;
    paciente_telefone: string;
    paciente_residencia: string;
}

interface IDetalhesPaciente {
    id: number;
    paciente_nome: string;
    paciente_cpf: string;
    paciente_nascimento: string;
    paciente_telefone: string;
    paciente_residencia: string;
}

type TPacientesComTotalCount = {
    data: IListagemPaciente[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TPacientesComTotalCount | Error> => {
    const urlRelativa = `paciente?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&paciente_nome_like=${filter}`
    try {
        const { data, headers } = await Api.get(urlRelativa);
        if (data) {
            return {
                data,
                totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
            };
        }

        return new Error('Erro ao listar os registros.');
    } catch (error) {
        console.error(error);
        return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
    }
}

const getById = async (id: number): Promise<IDetalhesPaciente | Error> => {
    try {
      const { data } = await Api.get(`paciente/${id}`);
  
      if (data) {
        return data;
      }
  
      return new Error('Erro ao consultar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
  };
  
  const create = async (dados: Omit<IDetalhesPaciente, 'id'>): Promise<number | Error> => {
    try {
      const { data } = await Api.post<IDetalhesPaciente>('paciente', dados);
  
      if (data) {
        return data.id;
      }
  
      return new Error('Erro ao criar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
  };
  
  const updateById = async (id: number, dados: IDetalhesPaciente): Promise<void | Error> => {
    try {
      await Api.put(`paciente/${id}`, dados);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
  };
  
  const deleteById = async (id: number): Promise<void | Error> => {
    try {
      await Api.delete(`paciente/${id}`);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
  };

export const PacienteService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}