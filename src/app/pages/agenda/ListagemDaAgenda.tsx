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
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';

export const ListagemDaAgenda: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();
    const [rows, setRows] = useState<IListagemAgenda[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);


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

    const handleDelete = (agenda_id: number, paciente_nome: string) => {
        if (confirm(`${paciente_nome} Viajou?`)) {
            AgendaService.deleteById(agenda_id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow.agenda_id !== agenda_id),
                        ]);
                        alert('Registro apagado com sucesso!');
                    }
                });
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setSearchParams({ pagina: String(newPage + 1) }, { replace: true });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
        setSearchParams({ pagina: '1' }, { replace: true });
    };

    const filteredAgenda = useMemo(() => {
        return rows.filter(agenda => {
            return agenda.paciente_nome.toLowerCase().includes(busca.toLowerCase());
        });
    }, [busca, rows]);

    const quantidadeDePaginas = filteredAgenda.length

    return (
        <LayoutBaseDePagina
            titulo='Listagem dos Agendados'
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo='Novo agenda'
                    aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: '100wh' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Data</TableCell>
                            <TableCell align="left">Nome do Paciente</TableCell>
                            <TableCell align="left">CPF</TableCell>
                            <TableCell align="left">Contato</TableCell>
                            <TableCell align="left">Saída</TableCell>
                            <TableCell align="left">Marcado</TableCell>
                            <TableCell width={300} align="left">Nome do Hospital</TableCell>
                            <TableCell width={50} align="left">Carro</TableCell>
                            <TableCell width={50} align="right">Viajou</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAgenda
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((agenda, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    hover>
                                    <TableCell align="left">{
                                        new Date(agenda.agenda_data).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: '2-digit',
                                        })
                                    }</TableCell>
                                    <TableCell align="left">{agenda.paciente_nome}</TableCell>
                                    <TableCell align="left">{agenda.paciente_cpf}</TableCell>
                                    <TableCell align="left">{agenda.paciente_telefone}</TableCell>
                                    <TableCell align="left">{agenda.agenda_saida}</TableCell>
                                    <TableCell align="left">{agenda.agenda_marcado}</TableCell>
                                    <TableCell align="left">{agenda.hospital_nome}</TableCell>
                                    <TableCell align="left">{agenda.agenda_carro}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={handleDelete.bind(this, agenda.agenda_id, agenda.paciente_nome)}
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
                                <TableCell colSpan={12}>
                                    <LinearProgress variant='indeterminate' />
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell colSpan={12}>
                                <TablePagination
                                    page={page}
                                    component="div"
                                    rowsPerPage={rowsPerPage}
                                    count={quantidadeDePaginas}
                                    onPageChange={handleChangePage}
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    nextIconButtonProps={{ "aria-label": "Next Page" }}
                                    backIconButtonProps={{ "aria-label": "Previous Page" }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBaseDePagina>
    );
};