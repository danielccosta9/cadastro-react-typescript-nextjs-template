import { Environment } from "@/app/shared/environment";
import { Api } from "../axios-config";

export interface IListagemHospital {
    hospital_id: number;
    hospital_nome: string;
    hospital_estado: string;
}

export interface IDetalhesHospital {
    hospital_id: number;
    hospital_nome: string;
    hospital_estado: string;
}

type THospitalComTotalCount = {
    data: IListagemHospital[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<THospitalComTotalCount | Error> => {
    const urlRelativa = `hospital?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&hospital_nome_like=${filter}`
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

const getById = async (hospital_id: number): Promise<IDetalhesHospital | Error> => {
    try {
      const { data } = await Api.get(`hospital/${hospital_id}`);
  
      if (data) {
        return data;
      }
  
      return new Error('Erro ao consultar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
  };
  
  const create = async (dados: Omit<IDetalhesHospital, 'hospital_id'>): Promise<number | Error> => {
    try {
      const { data } = await Api.post<IDetalhesHospital>('hospital', dados);
  
      if (data) {
        return data.hospital_id;
      }
  
      return new Error('Erro ao criar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
  };
  
  const updateById = async (hospital_id: number, dados: IDetalhesHospital): Promise<void | Error> => {
    try {
      await Api.put(`hospital/${hospital_id}`, dados);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
  };
  
  const deleteById = async (hospital_id: number): Promise<void | Error> => {
    try {
      await Api.delete(`hospital/${hospital_id}`);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
  };

export const HospitalService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
