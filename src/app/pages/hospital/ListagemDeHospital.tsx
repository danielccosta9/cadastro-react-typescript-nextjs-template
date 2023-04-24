import { FerramentasDaListagem } from "@/app/shared/components";
import { LayoutBaseDePagina } from "@/app/shared/layouts";
import { HospitalService, IListagemHospital } from "@/app/shared/services/api/hospital/HospitalService";
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

export const ListagemDeHospitais: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();
    const [rows, setRows] = useState<IListagemHospital[]>([]);
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
            HospitalService.getAll(pagina, busca)
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
            HospitalService.deleteById(id)
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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
        setSearchParams({ pagina: String(newPage + 1) }, { replace: true });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
        setSearchParams({ pagina: '1' }, { replace: true });
    };

    const filteredHospital = useMemo(() => {
        return rows.filter(hospital => {
            return hospital.hospitalNome.toLowerCase().includes(busca.toLowerCase());
        });
    }, [busca, rows]);

    const quantidadeDePaginas = filteredHospital.length

    return (
        <LayoutBaseDePagina
            titulo='Listagem dos Hospital'
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoDaBusca={busca}
                    textoBotaoNovo='Novo'
                    aoClicarEmNovo={() => navigate('/hospital/detalhe/novo')}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Nome do Hospital</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell width={100} align="center">Ação</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredHospital
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((hospital, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    hover>
                                    <TableCell align="left">{hospital.hospitalNome}</TableCell>
                                    <TableCell align="left">{hospital.hospitalEstado}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            onClick={handleDelete.bind(this, hospital.id)}
                                        >
                                            <Icon color="error">delete</Icon>
                                        </IconButton>
                                        <IconButton
                                            onClick={() => navigate(`/hospital/detalhe/${hospital.id}`)}
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