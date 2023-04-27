import { FerramentasDaListagem } from "@/app/shared/components";
import { LayoutBaseDePagina } from "@/app/shared/layouts";
import { AgendaService, IListagemAgenda } from "@/app/shared/services/api/agenda/AgendaService";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Environment } from "@/app/shared/environment";
import { useDebounce } from "@/app/shared/hooks";

import {
    Icon,
    IconButton,
    LinearProgress,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from '@mui/material';


export const Listagem: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IListagemAgenda[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);


    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');
    }, [searchParams]);


    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            AgendaService.getAll(pagina, busca)
                .then((result) => {
                    setIsLoading(false);

                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        console.log(result);

                        setTotalCount(result.totalCount);
                        setRows(result.data);
                    }
                });
        });
    }, [busca, debounce, pagina]);

    const handleDelete = (id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            AgendaService.deleteById(id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow.id !== id),
                        ]);
                        alert('Registro apagado com sucesso!');
                    }
                });
        }
    };


    return (
        <LayoutBaseDePagina
            titulo='Listagem dos Agendamentos'
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo='Novo'
                    aoClicarEmNovo={() => navigate('/agenda/detalhe/novo')}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Nome do Paciente</TableCell>
                            <TableCell align="left">CPF</TableCell>
                            <TableCell align="left">Telefone</TableCell>
                            <TableCell align="left">Saída</TableCell>
                            <TableCell align="left">Marcado</TableCell>
                            <TableCell width={300} align="left">Nome do Hospital</TableCell>
                            <TableCell width={50} align="left">Carro</TableCell>
                            <TableCell width={50} align="right">Viajou</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(agenda => (
                            <TableRow
                                key={agenda.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                hover
                            >
                                {/* <TableCell align="left">{
                                        new Intl.DateTimeFormat('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                        }).format(new Date(agenda.agendaData).getTime() + 1000 * 60 * 60 * 24)
                                    }</TableCell> */}
                                <TableCell align="left">{agenda.agendaData}</TableCell>
                                <TableCell align="left">{agenda.pacienteNome}</TableCell>
                                <TableCell align="left">{agenda.pacienteCPF}</TableCell>
                                <TableCell align="left">{agenda.pacienteTelefone}</TableCell>
                                <TableCell align="left">{agenda.agendaHoraSaida}</TableCell>
                                <TableCell align="left">{agenda.agendaMarcado}</TableCell>
                                <TableCell align="left">{agenda.hospitalNome}</TableCell>
                                <TableCell align="left">{agenda.agendaCarro}</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={handleDelete.bind(this, agenda.id, agenda.pacienteNome)}
                                    >
                                        <Icon color="success">done</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    {totalCount === 0 && !isLoading && (
                        <caption>{Environment.LISTAGEM_VAZIA}</caption>
                    )}

                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant='indeterminate' />
                                </TableCell>
                            </TableRow>
                        )}
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                        page={pagina}
                                        count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBaseDePagina>
    );
};