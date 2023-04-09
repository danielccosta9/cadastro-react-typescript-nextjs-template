
// Formatar a data
function formatDate(date: string | number | Date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

const ArrayOfWeek = [
    formatDate(new Date().setDate(new Date().getDate() + 1)) + "T00:00:00.000Z",
    formatDate(new Date().setDate(new Date().getDate() + 2)) + "T00:00:00.000Z",
    formatDate(new Date().setDate(new Date().getDate() + 3)) + "T00:00:00.000Z",
    formatDate(new Date().setDate(new Date().getDate() + 4)) + "T00:00:00.000Z",
    formatDate(new Date().setDate(new Date().getDate() + 5)) + "T00:00:00.000Z",
    formatDate(new Date().setDate(new Date().getDate() + 6)) + "T00:00:00.000Z",
]

const DayOfWeekArray = [
    new Date().getDay() + 1,
    new Date().getDay() + 2,
    new Date().getDay() + 3,
    new Date().getDay() + 4,
    new Date().getDay() + 5,
    new Date().getDay() + 6,
]

const DayOfWeekInText = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
]

const DayOfWeekInTextArray = [
    DayOfWeekInText[DayOfWeekArray[0] % 7],
    DayOfWeekInText[DayOfWeekArray[1] % 7],
    DayOfWeekInText[DayOfWeekArray[2] % 7],
    DayOfWeekInText[DayOfWeekArray[3] % 7],
    DayOfWeekInText[DayOfWeekArray[4] % 7],
    DayOfWeekInText[DayOfWeekArray[5] % 7],
]

export { ArrayOfWeek, DayOfWeekInTextArray };