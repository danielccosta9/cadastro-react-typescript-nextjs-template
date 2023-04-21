import { Environment } from "@/app/shared/environment";
import { Api } from "../axios-config";

export interface IListagemPaciente {
    paciente_id: number;
    paciente_nome: string;
    paciente_cpf: string;
    paciente_nascimento: string;
    paciente_telefone: string;
    paciente_residencia: string;
    paciente_comorbidade: string;
}

export interface IDetalhesPaciente {
    paciente_id: number;
    paciente_nome: string;
    paciente_cpf: string;
    paciente_nascimento: string;
    paciente_telefone: string;
    paciente_residencia: string;
    paciente_comorbidade: string;
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

const getById = async (paciente_id: number): Promise<IDetalhesPaciente | Error> => {
    try {
      const { data } = await Api.get(`paciente/${paciente_id}`);
  
      if (data) {
        return data;
      }
  
      return new Error('Erro ao consultar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
  };
  
  const create = async (dados: Omit<IDetalhesPaciente, 'paciente_id'>): Promise<number | Error> => {
    try {
      const { data } = await Api.post<IDetalhesPaciente>('paciente', dados);
  
      if (data) {
        return data.paciente_id;
      }
  
      return new Error('Erro ao criar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
  };
  
  const updateById = async (paciente_id: number, dados: IDetalhesPaciente): Promise<void | Error> => {
    try {
      await Api.put(`paciente/${paciente_id}`, dados);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
  };
  
  const deleteById = async (paciente_id: number): Promise<void | Error> => {
    try {
      await Api.delete(`paciente/${paciente_id}`);
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
