import { meses, diasem } from '$lib/variables'

export class Fecha {

    fecha;
    intervalo_dias;
    fechas = [];
    #ultima;
    #actual;
    #ultima_fecha

    constructor(fecha, intervalo_dias = 15) {
        this.fecha = fecha
        this.intervalo_dias = intervalo_dias
        this.#actual = this.aaaammdd(new Date())
        let x = new Date(this.fecha.valueOf() + 60 * 60 * 24 * intervalo_dias * 1000)
        this.#ultima = this.aaaammdd(x)
        this.cargar_fechas()
        console.log('#actual:', this.#actual)
        console.log('#ultima:', this.#ultima)
    }

    cargar_fechas() {
        let fecha = this.fecha
        let i = 1
        do {
            let mm = fecha.getMonth();
            let ds = fecha.getDay();
            let dd = fecha.getDate().toString();

            let aaa = fecha.getFullYear().toString();
            let mmm = (fecha.getMonth() + 1).toString();
            let ddd = fecha.getDate().toString();

            // if (fecha_elegida == "") fecha_elegida = `${aaa}-${mmm}-${ddd}`;

            this.fechas.push({
                fecha: `${aaa}-${mmm}-${ddd}`,
                descri: `${diasem[ds].substring(0, 3)} ${dd} ${meses[
                    mm
                ].substring(0, 3)}`,
            });

            i++;
            fecha = new Date(fecha.valueOf() + 60 * 60 * 24 * 1000);
        } while (i < this.intervalo_dias);
        // fechas = [...fechas];
    }

    aaaammdd(f) {
        let a = f.getFullYear().toString()
        let m = (f.getMonth() + 1).toString()
        let d = f.getDate().toString()
        if (m.length == 1) m = '0' + m
        if (d.length == 1) d = '0' + d
        return a + m + d
    }

    descri() {
        let a = this.fecha.getFullYear().toString()
        let m = (this.fecha.getMonth() + 1).toString()
        let d = this.fecha.getDate().toString()
        if (m.length == 1) m = '0' + m
        if (d.length == 1) d = '0' + d
        return a + '-' + m + '-' + d
    }

    nom_mes() {
        return meses[this.fecha.getMonth()]
    }

    nom_dia_sem() {
        return diasem[this.fecha.getDay()]
    }

    nomdia_dia_nommes(opcion = 0) {
        if (opcion == 0) {
            return `${diasem[this.fecha.getDay()]} ${this.fecha.getDate()} ${meses[this.fecha.getMonth()]}`
        } else {
            return `${diasem[this.fecha.getDay()].substring(0, 3)} ${this.fecha.getDate()} ${meses[this.fecha.getMonth()].substring(0, 3)}`
        }
    }

    set anterior(dias = 1) {
        let t = this.fecha.valueOf()
        let nueva = new Date(t + 60 * 60 * 24 * dias * -1000)
        if (this.aaaammdd(nueva) < this.#actual) {
            this.fecha = new Date()
        } else {
            this.fecha = new Date(t + 60 * 60 * 24 * dias * -1000)
        }
    }

    set proxima(dias = 1) {
        let t = this.fecha.valueOf()
        let nueva = new Date(t + 60 * 60 * 24 * dias * 1000)
        if (this.aaaammdd(nueva) > this.#ultima) {
            this.fecha = new Date(new Date().valueOf() + 60 * 60 * 24 * this.intervalo_dias * 1000)
        } else {
            this.fecha = new Date(t + 60 * 60 * 24 * dias * 1000)
        }
    }
}