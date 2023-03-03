
export const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

export const diasem = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
]


let ff = new Date();
let aa = ff.getFullYear().toString();
let ds = ff.getDay();
let dd = ff.getDate().toString();
let me = ff.getMonth();
let mm = (ff.getMonth() + 1).toString();
if (dd.length == 1) dd = "0" + dd;
if (mm.length == 1) mm = "0" + mm;
export const fecha = aa + "-" + mm + "-" + dd;
export const fecha_descri = `${diasem[ds].substring(0, 3)} ${dd} ${meses[me].substring(0, 3)}`;