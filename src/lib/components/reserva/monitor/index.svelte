<script>
    import { sre_reserva } from "$lib/stores";
    import { onMount } from "svelte";

    export let strfecha = "";

    let fecha = new Date();

    let registros = [];
    let filas = [];
    let pagina_actual = 1;
    let paginas = 1;
    let segundos = 2;
    let ancho_columna = 200;

    let actualzarlista = false;
    let setIntervalSegundos = false;

    let mostrar = {
        "unidad": true,
        "carrera": true,
        "docente": true
    }

    let nomdias = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    let nommes = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ];

    onMount(() => {
        let x = { ...$sre_reserva };
        x.rxp_monitor = 2;
        x.vista_monitor = 1;
        x.actividad_monitor = 1;
        x.pausa_monitor = 10;
        sre_reserva.actualizar(x);
        segundos = $sre_reserva.pausa_monitor;
        ancho_columna = $sre_reserva.ancho_columna;

        mostrar = {...$sre_reserva.mostrar}
        
        console.log('onMount:', mostrar)
    });

    $: {
        strfecha = $sre_reserva.fecha;
        cargar_horarios();
    }

    $:{
        mostrar = {...$sre_reserva.mostrar}
    }

    $: {
        filas = [];
        registros.map((r) => {
            let estado = "";
            if (r.desde <= r.ahora && r.hasta >= r.ahora) estado = "EN HORARIO";
            if (r.desde > r.ahora) estado = "EN ESPERA";

            let display = "block";
            if (r.ahora < "13:00" && r.desde >= "13:00") display = "none";
            if (r.ahora >= "13:00" && r.hasta < "13:00") display = "none";
            if (r.ahora > r.hasta) display = "none";
            if ($sre_reserva.vista_monitor == 1) display = "block";

            let bgcolor = "blue";
            let color = "orange";
            if (estado == "EN ESPERA") {
                bgcolor = "#d7dbdd";
                color = "black";
            }
            if (estado == "EN HORARIO") {
                bgcolor = "green";
                color = "white";
            }

            if (display == "block") {
                filas.push({ ...r, estado, color, bgcolor, display });
            }
        });

        let primero = (pagina_actual - 1) * $sre_reserva.rxp_monitor;
        let ultimo = pagina_actual * $sre_reserva.rxp_monitor;

        paginas = parseInt(filas.length / $sre_reserva.rxp_monitor);
        if (filas.length / $sre_reserva.rxp_monitor > paginas) paginas++;

        filas = filas.slice(primero, ultimo);

        filas = [...filas];

        clearInterval(setIntervalSegundos);
        clearTimeout(actualzarlista);
        actualzarlista = setTimeout(
            actualiza_pagina,
            1000 * $sre_reserva.pausa_monitor
        );
        setIntervalSegundos = setInterval(actualiza_segundos, 1000);
    }

    async function cargar_horarios() {
        strfecha == ""
            ? (fecha = new Date())
            : (fecha = new Date(strfecha + " 00:00:01"));

        let dd = fecha.getDate().toString();
        let mm = (fecha.getMonth() + 1).toString();
        let aa = fecha.getFullYear().toString();
        if (dd.length == 1) dd = "0" + dd;
        if (mm.length == 1) mm = "0" + mm;
        let xfecha = aa + "-" + mm + "-" + dd;

        const res = await fetch(`/api/reserva/monitor`, {
            method: "POST",
            body: JSON.stringify({
                fecha: $sre_reserva.fecha,
                cod_uni: $sre_reserva.cod_uni,
            }),
        });

        const jsn = await res.json();
        if (res.ok) {
            registros = [...jsn];
        }
    }

    function actualiza_pagina() {
        pagina_actual++;
        clearInterval(setIntervalSegundos);
        if (pagina_actual > paginas) pagina_actual = 1;
        segundos = $sre_reserva.pausa_monitor;
        setIntervalSegundos = setInterval(actualiza_segundos, 1000);
    }

    function actualiza_segundos() {
        segundos--;
        if (segundos < 0) segundos = $sre_reserva.pausa_monitor;
    }
</script>

<div
    class="w3-display-container w3-hide-small w3-hide-medium w3-text-red"
    style="height:50px ;"
>
    <div class="w3-display-topleft">
        <h3>
            {nomdias[fecha.getDay()]}
            {fecha.getDate()} de {nommes[fecha.getMonth()]} de {fecha.getFullYear()}
        </h3>
    </div>
    <div class="w3-display-topmiddle">
        <h3>{segundos}''</h3>
    </div>
    <div class="w3-display-topright" style="padding-right: 20px;">
        <h3>Página {pagina_actual} de {paginas}</h3>
    </div>
</div>

<div
    class="w3-section w3-hide-large w3-small w3-text-red"
    style="height:50px ; font-weight: bold; letter-spacing:1px"
>
    <div>
        {nomdias[fecha.getDay()]}
        {fecha.getDate()} de {nommes[fecha.getMonth()]} de {fecha.getFullYear()}
    </div>
    <div>
        {segundos}'' 
    </div>
    <div>
        Página {pagina_actual} de {paginas}
    </div>
</div>

<div class="w3-responsive" style="font-size: {$sre_reserva.font_size}px;">
    <table cellspacing="1" cellpadding="5" border="0" style="width:100%">
        <!-- <colgroup>
            <col width="{$sre_reserva.ancho_columna}px" />
        </colgroup> -->
        <!-- <caption>ancho columna: {$sre_reserva.ancho_columna}</caption> -->
        <thead>
            <tr class="titulos">
                <td style="text-align: center; width:{$sre_reserva.ancho_columna}px">Horario <br /> <i>Estado</i></td
                >
                <td>
                    {#if mostrar.unidad}Unidad / {/if}
                    {#if mostrar.carrera}Carrera / {/if}
                    Materia 
                    {#if mostrar.docente} / Docente{/if}
                    <br /> <i>Ubicación</i>
                </td>
            </tr>
        </thead>
        
        <tbody>
            {#each filas as r}
                {#if r.display == "block"}
                    <tr
                        class="filas"
                        style="background-color: {r.bgcolor}; color:{r.color};"
                    >
                        {#if r.suspendida == 1}
                            <td
                                style="vertical-align: top; text-align:center; boder:2px solid red;background-color:lightgoldenrodyellow; color:red; font-weight:bold; width:{$sre_reserva.ancho_columna}px"
                            >
                                {r.desde} - {r.hasta} <br />
                                SUSPENDIDA
                            </td>
                        {:else}
                            <td style="vertical-align: top; text-align:center; width:{$sre_reserva.ancho_columna}px"
                                >{r.desde} - {r.hasta} <br />
                                <i>{r.estado}</i></td
                            >
                        {/if}
                        <td>
                            <div class="actividad" >
                                {#if $sre_reserva.mostrar.unidad} {r.unidad_academica.toUpperCase()} / {/if}
                                {#if $sre_reserva.mostrar.carrera}{r.carrera.toUpperCase()} / {/if}
                                {r.materia} 
                                {#if r.catedra!=""} ({r.catedra.toUpperCase()}) {/if}
                                {#if r.comision!=""} ({r.comision}) {/if}
                                {#if r.descri!=""} / {r.descri} {/if}
                                {#if $sre_reserva.mostrar.docente} / {r.docente} {/if}
                            </div>
                            
                            <div class="ubicacion" style="vertical-align: bottom; ">
                                {r.sede} - {r.edificio} - {r.espacio} ({r.planta})
                            </div>
                        </td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>
</div>

<style>
    .titulos {
        background-color: gray;
        color: white;
        font-weight: bold;
    }
    .filas {
        /* font-size: 70%; */
        font-weight: bold;
        letter-spacing: 2px;
    }
    .actividad {
        /* height: 40px; */
        /* text-overflow: ellipsis;
        white-space: nowrap; */
        overflow-x: auto;
    }
    .ubicacion {
        /* height: 20px; */
        font-style: italic;
    }
</style>
