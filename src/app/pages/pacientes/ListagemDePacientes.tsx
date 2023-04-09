import { FerramentasDaListagem } from "@/app/shared/components";
import { LayoutBaseDePagina } from "@/app/shared/layouts";
import { PacienteService, IListagemPaciente } from "@/app/shared/services/api/paciente/PacienteService";
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

export const ListagemDePacientes: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();
    const [rows, setRows] = useState<IListagemPaciente[]>([]);
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
            PacienteService.getAll(pagina, busca)
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

    const handleDelete = (paciente_id: number) => {
        if (confirm('Realmente deseja apagar?')) {
            PacienteService.deleteById(paciente_id)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow.paciente_id !== paciente_id),
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

    const filteredPacientes = useMemo(() => {
        return rows.filter(paciente => {
            return paciente.paciente_nome.toLowerCase().includes(busca.toLowerCase());
        });
    }, [busca, rows]);

    const quantidadeDePaginas = filteredPacientes.length

    return (
        <LayoutBaseDePagina
            titulo='Listagem de Pacientes'
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo='Novo Paciente'
                    aoClicarEmNovo={() => navigate('/pessoas/detalhe/nova')}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: '100wh' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nome</TableCell>
                            <TableCell align="left">CPF</TableCell>
                            <TableCell align="left">Nascimento</TableCell>
                            <TableCell align="left">Telefone</TableCell>
                            <TableCell align="left">Residência</TableCell>
                            <TableCell width={100} align="center">Ação</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPacientes
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((paciente, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    hover>
                                    <TableCell align="left">{paciente.paciente_nome}</TableCell>
                                    <TableCell align="left">{paciente.paciente_cpf}</TableCell>
                                    <TableCell align="left">{paciente.paciente_nascimento}</TableCell>
                                    <TableCell align="left">{paciente.paciente_telefone}</TableCell>
                                    <TableCell align="left">{paciente.paciente_residencia}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={handleDelete.bind(this, paciente.paciente_id)}
                                        >
                                            <Icon color="error">delete</Icon>
                                        </IconButton>
                                        <IconButton
                                            onClick={() => navigate(`/pessoas/detalhe/${paciente.paciente_id}`)}
                                        >
                                            <Icon color="secondary">edit</Icon>
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
                        <TableRow>
                            <TableCell colSpan={6}>
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