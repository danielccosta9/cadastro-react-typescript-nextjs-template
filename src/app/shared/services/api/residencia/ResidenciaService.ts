import { Environment } from "@/app/shared/environment";
import { Api } from "../axios-config";

export interface IListagemResidencia {
    id: number;
    nome: string;
}

export interface IDetalhesResidencia {
    id: number;
    nome: string;
}

type TResidenciaComTotalCount = {
    data: IListagemResidencia[];
    totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TResidenciaComTotalCount | Error> => {
    const urlRelativa = `residencia?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`
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

const getById = async (id: number): Promise<IDetalhesResidencia | Error> => {
    try {
      const { data } = await Api.get(`residencia/${id}`);
  
      if (data) {
        return data;
      }
  
      return new Error('Erro ao consultar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
    }
  };
  
  const create = async (dados: Omit<IDetalhesResidencia, 'id'>): Promise<number | Error> => {
    try {
      const { data } = await Api.post<IDetalhesResidencia>('residencia', dados);
  
      if (data) {
        return data.id;
      }
  
      return new Error('Erro ao criar o registro.');
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
    }
  };
  
  const updateById = async (id: number, dados: IDetalhesResidencia): Promise<void | Error> => {
    try {
      await Api.put(`residencia/${id}`, dados);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
    }
  };
  
  const deleteById = async (id: number): Promise<void | Error> => {
    try {
      await Api.delete(`residencia/${id}`);
    } catch (error) {
      console.error(error);
      return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
    }
  };

export const ResidenciaService = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
}
