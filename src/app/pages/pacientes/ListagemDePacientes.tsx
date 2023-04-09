import { FerramentasDaListagem } from "@/app/shared/components";
import { LayoutBaseDePagina } from "@/app/shared/layouts";
import { PacienteService } from "@/app/shared/services/api/paciente/PacienteService";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const ListagemDePacientes: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const busca = useMemo(() => {
        return searchParams.get("busca") || "";
    }, [searchParams]);

    useEffect(() => {
        PacienteService.getAll(1, busca)
            .then((response) => {
                if (response instanceof Error) {
                    alert(response.message);
                } else {
                    console.log(response);
                }
            })
    }, [busca]);

    return (
        <LayoutBaseDePagina
            titulo="Listagem de Cidades"
            barraDeFerramentas={
                <FerramentasDaListagem
                mostrarInputBusca
                textoBotaoNovo="Nova Cidade"
                textoDaBusca={busca}
                aoMudarTextoDeBusca={(texto) => setSearchParams({ busca: texto }, { replace: true })}
                />
            }
        >

        </LayoutBaseDePagina>
    );
};