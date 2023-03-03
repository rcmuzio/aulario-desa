<script>
    import { createEventDispatcher, onMount } from "svelte";

    export let strfecha = "";
    export let displaySelectMuestra = "block";

    let fecha_elegida;

    const dispatch = createEventDispatcher();

    let muestra = 1;
    let muestras = [
        { valor: 1, descri: "Vista por semana" },
        { valor: 2, descri: "Vista por día" },
    ];

    let meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    let semanas = [0, 1, 2, 3, 4, 5, 6];
    let dias = ["D", "L", "M", "M", "J", "V", "S"];
    let filas = [];
    let mes;

    //let fecha = new Date();
    let anios = [];
    let anio_inicial = 2022;
    let anio_futuro; // = fecha.getFullYear() + 1;
    let anio; // = fecha.getFullYear();

    onMount(() => {
        let fecha = new Date();
        fecha_elegida = new Date();
        if (strfecha != "") {
            fecha = new Date(strfecha + " 00:00:01");
            strfecha = "";
        }

        mes = fecha.getMonth();
        anio = fecha.getFullYear();
        anio_futuro = fecha.getFullYear() + 1;
        for (let a = anio_futuro; a >= anio_inicial; a--) anios.push(a);
        cargar(fecha);
    });

    function cargar(fecha) {
        let dia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        dia.setDate(dia.getDate() - dia.getDay());
        filas = [];
        for (let semana of semanas) {
            let fila = [];
            let d = dia.getDay();

            for (d; d < 7; d++) {
                let datos = [];
                datos.push(dia.getFullYear());
                datos.push(dia.getMonth() + 1);
                datos.push(dia.getDate());
                let color = "black";
                let bgc = "#F1E8E6";
                if (dia.getMonth() == fecha.getMonth()) {
                    if (dia.getDate() == fecha.getDate()) {
                        fecha_elegida = new Date();
                        fecha_elegida.setFullYear(dia.getFullYear());
                        //fecha_elegida.setMonth(dia.getMonth() + 1);
                        fecha_elegida.setMonth(dia.getMonth());
                        fecha_elegida.setDate(1);
                        color = "white";
                        bgc = "grey";
                    } else {
                        bgc = "white";
                    }
                }
                fila.push({
                    dia: dia.getDate(),
                    color,
                    bgc,
                    datos,
                });
                dia.setDate(dia.getDate() + 1);
            }
            filas.push(fila);
            if (
                dia.getMonth() > fecha.getMonth() ||
                dia.getFullYear() > fecha.getFullYear()
            )
                break;
        }

        filas = [...filas];
    }

    function select_dia(d) {
        let f = new Date(d.join());
        if (f.getFullYear() < anio_inicial || f.getFullYear() > anio_futuro)
            return;
        let aaa = f.getFullYear().toString();
        let ddd = f.getDate().toString();
        if (ddd.length == 1) ddd = "0" + ddd;
        let mmm = (f.getMonth() + 1).toString();
        if (mmm.length == 1) mmm = "0" + mmm;

        let nueva = aaa + "-" + mmm + "-" + ddd;

        let fecha = new Date(nueva + " 00:00:01");

        mes = f.getMonth();
        cargar(fecha);

        dispatch("fecha", { fecha: nueva });
    }

    function cambia_muestra() {
        dispatch("cambia_muestra", { muestra });
    }

    function cambia_mes() {
        fecha_elegida.setMonth(mes);
        cargar(fecha_elegida);

        let aaa = fecha_elegida.getFullYear().toString();
        let ddd = fecha_elegida.getDate().toString();
        if (ddd.length == 1) ddd = "0" + ddd;
        let mmm = (fecha_elegida.getMonth() + 1).toString();
        if (mmm.length == 1) mmm = "0" + mmm;

        let nueva = aaa + "-" + mmm + "-" + ddd;

        let fecha = new Date(nueva + " 00:00:01");
        dispatch("fecha", { fecha: nueva });
    }

    function cambia_anio() {
        let xmes = fecha_elegida.getMonth();
        // console.log("fecha:", fecha_elegida);
        // console.log("xmes:", xmes);
        fecha_elegida.setFullYear(anio);
        fecha_elegida.setDate(1);
        fecha_elegida.setMonth(xmes);
        // console.log("fecha en cambia año:", fecha_elegida);
        mes = fecha_elegida.getMonth();
        cargar(fecha_elegida);

        let aaa = fecha_elegida.getFullYear().toString();
        let ddd = fecha_elegida.getDate().toString();
        if (ddd.length == 1) ddd = "0" + ddd;
        let mmm = (fecha_elegida.getMonth() + 1).toString();
        if (mmm.length == 1) mmm = "0" + mmm;

        let nueva = aaa + "-" + mmm + "-" + ddd;

        let fecha = new Date(nueva + " 00:00:01");
        dispatch("fecha", { fecha: nueva });
    }
</script>

<div style="display:{displaySelectMuestra}">
    <select
        class="anio"
        bind:value={muestra}
        on:change={cambia_muestra}
        style="width: 100%;"
    >
        {#each muestras as m}
            <option value={m.valor}>{m.descri}</option>
        {/each}
    </select>
</div>

<div>
    <select
        class="anio"
        bind:value={anio}
        on:change={cambia_anio}
        style="width: 100%;"
    >
        {#each anios as a}
            <option value={a}>{a}</option>
        {/each}
    </select>
</div>

<div style="margin-bottom: 5px ;">
    <select
        class="mes"
        bind:value={mes}
        on:change={cambia_mes}
        style="width: 100%;"
    >
        {#each meses as m, mi}
            <option value={mi}>{m}</option>
        {/each}
    </select>
</div>

<div class="w3-tiny w3-round w3-light-grey" style="padding:4px">
    <table border="0" cellpadding="2" cellspacing="0">
        <tr>
            {#each dias as d}
                <td>{d}</td>
            {/each}
        </tr>
        {#each filas as fila}
            <tr>
                {#each fila as d}
                    <td
                        style="background-color:{d.bgc}; color:{d.color}"
                        on:click={() => select_dia(d.datos)}>{d.dia}</td
                    >
                {/each}
            </tr>
        {/each}
    </table>
</div>

<style>
    td {
        text-align: center;
        cursor: pointer;
        height: 20px;
        width: 20px;
    }
    .mes {
        font-size: 10px;
    }
    .anio {
        font-size: 10px;
    }
</style>
