import { Environment } from "@/app/shared/environment";
import { Api } from "../axios-config";

export interface IListagemAgenda {
    id: number;
    pacienteNome: string;
    pacienteCPF: string;
    pacienteTelefone: string;
    agendaHoraSaida: string;
    agendaMarcado: string;
    hospitalNome: string;
    agendaStatus: string;
    agendaCarro: string;
    agendaData: string;
}

export interface IDetalhesAgenda {
    id: number;
    pacienteNome: string;
    pacienteCPF: string;
    pacienteTelefone: string;
    agendaHoraSaida: string;
    agendaMarcado: string;
    hospitalNome: string;
    agendaStatus: string;
    agendaCarro: string;
    agendaData: string;
}

type TAgendaComTotalCount = {
    data: IListagemAgenda[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TAgendaComTotalCount | Error> => {
    const urlRelativa = `agenda?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&pacienteNome_like=${filter}`
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

const getById = async (id: number): Promise<IDetalhesAgenda | Error> => {
    try {
      const { data } = await Api.get(`agenda/${id}`);
  
      if (data) {
        return data;
      }
  
      return new Error('Erro ao consultar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
  };
  
  const create = async (dados: Omit<IDetalhesAgenda, 'id'>): Promise<number | Error> => {
    try {
      const { data } = await Api.post<IDetalhesAgenda>('agenda', dados);
  
      if (data) {
        return data.id;
      }
  
      return new Error('Erro ao criar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
  };
  
  const updateById = async (id: number, dados: IDetalhesAgenda): Promise<void | Error> => {
    try {
      await Api.put(`agenda/${id}`, dados);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
  };
  
  const deleteById = async (id: number): Promise<void | Error> => {
    try {
      await Api.delete(`agenda/${id}`);
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
