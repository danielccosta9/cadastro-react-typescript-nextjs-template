import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

import { ResidenciaService } from '@/app/shared/services/api/residencia/ResidenciaService';
import { useDebounce } from '../../../shared/hooks';
import { useField } from '@unform/core';


type TAutoCompleteOption = {
  id: number;
  label: string;
}

interface IAutoCompleteResidenciaProps {
  isExternalLoading?: boolean;
}
export const AutoCompleteResidencia: React.FC<IAutoCompleteResidenciaProps> = ({ isExternalLoading = false }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField('residenciaId');
  const { debounce } = useDebounce();

  const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue);

  const [opcoes, setOpcoes] = useState<TAutoCompleteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField, fieldName, selectedId]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      ResidenciaService.getAll(1, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            // alert(result.message);
          } else {
            console.log(result);

            setOpcoes(result.data.map(residencia => ({ id: residencia.id, label: residencia.nome })));
          }
        });
    });
  }, [busca, debounce]);

  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;

    const selectedOption = opcoes.find(opcao => opcao.id === selectedId);
    if (!selectedOption) return null;

    return selectedOption;
  }, [selectedId, opcoes]);


  return (
    <Autocomplete
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'

      disablePortal

      options={opcoes}
      loading={isLoading}
      disabled={isExternalLoading}
      value={autoCompleteSelectedOption}
      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError(); }}
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28} /> : undefined}
      renderInput={(params) => (
        <TextField
          {...params}

          label="Residencia"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};