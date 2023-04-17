import { useEffect, useState } from 'react';
import Axios from 'axios';
import { Box, Card, Grid, Typography, Icon, styled, useTheme } from '@mui/material';
import { Environment } from '@/app/shared/environment';
import { ArrayOfWeek, DayOfWeekInTextArray } from './utilsCard'

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px !important',
    background: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& small': { color: theme.palette.text.secondary },
    '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
    margin: 0,
    marginTop: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.palette.primary.main,
}));

export const CardList = () => {
    const theme = useTheme();
    const [paciente, setPaciente] = useState([]);
    const [agendados, setAgendados] = useState([]);
    const [agendadosAuto, setAgendadosAuto] = useState([]);
    const baseURLPaciente = `${Environment.URL_BASE}paciente`;
    const baseURLAgendados = `${Environment.URL_BASE}agenda`;
    const baseURLAgendadosAuto = `${Environment.URL_BASE}agendaauto`;

    useEffect(() => {
        Axios.get(baseURLPaciente)
            .then(json => setPaciente(json.data))
    }, [baseURLPaciente])

    useEffect(() => {
        Axios.get(baseURLAgendados)
            .then(json => setAgendados(json.data))
    }, [baseURLAgendados])

    useEffect(() => {
        Axios.get(baseURLAgendadosAuto)
            .then(json => setAgendadosAuto(json.data))
    }, [baseURLAgendadosAuto])


    const agenda = agendados.concat(agendadosAuto);

    // Quantidade de pacientes agendados por dia
    const qtdForDay = [
        agenda.filter((item) => {
            return item.agenda_data === ArrayOfWeek[0]
        }),
        agenda.filter((item) => {
            return item.agenda_data === ArrayOfWeek[1]
        }),
        agenda.filter((item) => {
            return item.agenda_data === ArrayOfWeek[2]
        }),
        agenda.filter((item) => {
            return item.agenda_data === ArrayOfWeek[3]
        }),
        agenda.filter((item) => {
            return item.agenda_data === ArrayOfWeek[4]
        }),
        agenda.filter((item) => {
            return item.agenda_data === ArrayOfWeek[5]
        }),
    ]

    // Por dia - Manhã ou Tarde e Total
    const qtdForDayAndTime = [
        qtdForDay[0].filter((item) => {
            return item.agenda_saida < '11:00'
        }).length,
        qtdForDay[0].filter((item) => {
            return item.agenda_saida >= '11:00'
        }).length,
        qtdForDay[0].filter((item) => {
            return item.agenda_saida
        }).length,

        qtdForDay[1].filter((item) => {
            return item.agenda_saida < '11:00'
        }).length,
        qtdForDay[1].filter((item) => {
            return item.agenda_saida >= '11:00'
        }).length,
        qtdForDay[1].filter((item) => {
            return item.agenda_saida
        }).length,

        qtdForDay[2].filter((item) => {
            return item.agenda_saida < '11:00'
        }).length,
        qtdForDay[2].filter((item) => {
            return item.agenda_saida >= '11:00'
        }).length,
        qtdForDay[2].filter((item) => {
            return item.agenda_saida
        }).length,

        qtdForDay[3].filter((item) => {
            return item.agenda_saida < '11:00'
        }).length,
        qtdForDay[3].filter((item) => {
            return item.agenda_saida >= '11:00'
        }).length,
        qtdForDay[3].filter((item) => {
            return item.agenda_saida
        }).length,

        qtdForDay[4].filter((item) => {
            return item.agenda_saida < '11:00'
        }).length,
        qtdForDay[4].filter((item) => {
            return item.agenda_saida >= '11:00'
        }).length,
        qtdForDay[4].filter((item) => {
            return item.agenda_saida
        }).length,

        qtdForDay[5].filter((item) => {
            return item.agenda_saida < '11:00'
        }).length,
        qtdForDay[5].filter((item) => {
            return item.agenda_saida >= '11:00'
        }).length,
        qtdForDay[5].filter((item) => {
            return item.agenda_saida
        }).length,
    ]

    const cardList = [
        {
            name: `Nº de Agendados para ${DayOfWeekInTextArray[0]} `,
            amount: `
        ${qtdForDayAndTime[0] === 0 && qtdForDayAndTime[1] === 0
                    ? `Não há agendados para ${DayOfWeekInTextArray[0]}`
                    : `
          ( ${qtdForDayAndTime[0]} - Manhã )
          ( ${qtdForDayAndTime[1]} - Tarde )
          ( ${qtdForDayAndTime[2]} - Total )`
                }`,
            icon: 'folder_shared'
        },
        {
            name: `Nº de Agendados para ${DayOfWeekInTextArray[1]} `,
            amount: `
        ${qtdForDayAndTime[3] === 0 && qtdForDayAndTime[4] === 0
                    ? `Não há agendados para ${DayOfWeekInTextArray[1]}`
                    : `
          ( ${qtdForDayAndTime[3]} - Manhã )
          ( ${qtdForDayAndTime[4]} - Tarde )
          ( ${qtdForDayAndTime[5]} - Total )`
                }`,
            icon: 'folder_shared'
        },
        {
            name: `Nº de Agendados para ${DayOfWeekInTextArray[2]} `,
            amount: `
        ${qtdForDayAndTime[6] === 0 && qtdForDayAndTime[7] === 0
                    ? `Não há agendados para ${DayOfWeekInTextArray[2]}`
                    : `
          ( ${qtdForDayAndTime[6]} - Manhã )
          ( ${qtdForDayAndTime[7]} - Tarde )
          ( ${qtdForDayAndTime[8]} - Total )`
                }`,
            icon: 'folder_shared'
        },
        {
            name: `Nº de Agendados para ${DayOfWeekInTextArray[3]} `,
            amount: `
        ${qtdForDayAndTime[9] === 0 && qtdForDayAndTime[10] === 0
                    ? `Não há agendados para ${DayOfWeekInTextArray[3]}`
                    : `
          ( ${qtdForDayAndTime[9]} - Manhã )
          ( ${qtdForDayAndTime[10]} - Tarde )
          ( ${qtdForDayAndTime[11]} - Total )`
                }`,
            icon: 'folder_shared'
        },
        {
            name: `Nº de Agendados para ${DayOfWeekInTextArray[4]} `,
            amount: `
        ${qtdForDayAndTime[12] === 0 && qtdForDayAndTime[13] === 0
                    ? `Não há agendados para ${DayOfWeekInTextArray[4]}`
                    : `
          ( ${qtdForDayAndTime[12]} - Manhã )
          ( ${qtdForDayAndTime[13]} - Tarde )
          ( ${qtdForDayAndTime[14]} - Total )`
                }`,
            icon: 'folder_shared'
        },
        {
            name: `Nº de Agendados para ${DayOfWeekInTextArray[5]} `,
            amount: `
        ${qtdForDayAndTime[15] === 0 && qtdForDayAndTime[16] === 0
                    ? `Não há agendados para ${DayOfWeekInTextArray[5]}`
                    : `
          ( ${qtdForDayAndTime[15]} - Manhã )
          ( ${qtdForDayAndTime[16]} - Tarde )
          ( ${qtdForDayAndTime[17]} - Total )`
                }`,
            icon: 'folder_shared'
        },
        {
            name: 'Nº de Pacientes Agendados',
            amount: agenda.length + ' - Pacientes',
            icon: 'folder_shared'
        },
        {
            name: 'Nº de Pacientes Cadastrados',
            amount: paciente.length + ' - Pacientes',
            icon: 'folder_shared'
        },
    ];

    return (
        <Box width='100%' display='flex'>
            <Grid container margin={2}>
                <Grid item container spacing={2}></Grid>
                <Grid container spacing={4} sx={{ mb: '24px' }}>
                    {cardList.map((item, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <StyledCard elevation={8}>
                                <ContentBox>
                                    <Icon className="icon">{item.icon}</Icon>
                                    <Box ml="12px">
                                        <Typography align='justify' color={theme.palette.primary.main}>{item.name}</Typography>
                                        <Heading align='justify'>{item.amount}</Heading>
                                    </Box>
                                </ContentBox>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Box>
    )
};