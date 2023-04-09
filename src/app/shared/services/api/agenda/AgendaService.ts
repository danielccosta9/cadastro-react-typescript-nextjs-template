import { Environment } from "@/app/shared/environment";
import { Api } from "../axios-config";

export interface IListagemAgenda {
    agenda_id: number;
    paciente_nome: string;
    paciente_cpf: string;
    paciente_telefone: string;
    agenda_saida: string;
    agenda_marcado: string;
    hospital_nome: string;
    agenda_status: string;
    agenda_carro: string;
    agenda_data: string;
}

export interface IDetalhesAgenda {
    agenda_id: number;
    paciente_nome: string;
    paciente_cpf: string;
    paciente_telefone: string;
    agenda_saida: string;
    agenda_marcado: string;
    hospital_nome: string;
    agenda_status: string;
    agenda_carro: string;
    agenda_data: string;
}

type TAgendaComTotalCount = {
    data: IListagemAgenda[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TAgendaComTotalCount | Error> => {
    const urlRelativa = `agenda?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&paciente_nome_like=${filter}`
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

const getById = async (agenda_id: number): Promise<IDetalhesAgenda | Error> => {
    try {
      const { data } = await Api.get(`agenda/${agenda_id}`);
  
      if (data) {
        return data;
      }
  
      return new Error('Erro ao consultar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
  };
  
  const create = async (dados: Omit<IDetalhesAgenda, 'agenda_id'>): Promise<number | Error> => {
    try {
      const { data } = await Api.post<IDetalhesAgenda>('agenda', dados);
  
      if (data) {
        return data.agenda_id;
      }
  
      return new Error('Erro ao criar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
  };
  
  const updateById = async (agenda_id: number, dados: IDetalhesAgenda): Promise<void | Error> => {
    try {
      await Api.put(`agenda/${agenda_id}`, dados);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
  };
  
  const deleteById = async (agenda_id: number): Promise<void | Error> => {
    try {
      await Api.delete(`agenda/${agenda_id}`);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
  };

export const AgendaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
