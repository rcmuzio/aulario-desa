<script>
    import { onMount } from "svelte";

    export let data;

    const { edificio, planta, monitor } = data;

    let fecha = new Date();

    let dd = fecha.getDate().toString();
    let mm = (fecha.getMonth() + 1).toString();
    let aa = fecha.getFullYear().toString();

    if (dd.length == 1) dd = "0" + dd;
    if (mm.length == 1) mm = "0" + mm;

    let strfecha = aa + "-" + mm + "-" + dd;

    const parametros = {
        cod_uni: "ZZ",
        rxp_monitor: 2,
        vista_monitor: 1,
        actividad_monitor: 1,
        pausa_monitor: 10,
        font_size: 12,
        ancho_columna: 200,
        error: false,
    };

    let error = false;

    let mostrar = {
        unidad: true,
        carrera: true,
        docente: true,
    };

    let setIntervalSegundos = 0;

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

    let registros = [];
    let filas = [];
    let pagina_actual = 0;
    let paginas = 1;
    let segundos = 0;
    let detener = 0;
    let habilitado = false;
    let font_size = 12;
    let ancho_columna = 200;

    onMount(async () => {
        await cargar();
        habilitado = true;
    });

    $: {
        fecha = new Date();

        dd = fecha.getDate().toString();
        mm = (fecha.getMonth() + 1).toString();
        aa = fecha.getFullYear().toString();

        if (dd.length == 1) dd = "0" + dd;
        if (mm.length == 1) mm = "0" + mm;

        strfecha = aa + "-" + mm + "-" + dd;
    }

    $: {
        if (segundos == 0 && habilitado) {
            cargar();
        }
    }

    async function cargar() {
        clearInterval(setIntervalSegundos);
        await cargar_configuracion();
        await cargar_horarios();
        paginar();

        setIntervalSegundos = setInterval(function () {
            segundos--;
        }, 1000);
    }

    async function cargar_configuracion() {
        const res = await fetch(
            `/api/monitores?edificio=${edificio}&planta=${planta}&monitor=${monitor}`,
            {
                method: "GET",
            }
        );

        let jsn = await res.json();

        if (res.ok) {
            // console.log('CONFIRGURACION:', jsn);

            let x = jsn[0];
            parametros.error = false;
            parametros.cod_uni = x.cod_uni;
            parametros.actividad_monitor = x.actividad_por_planta;
            parametros.pausa_monitor = x.segundos;
            parametros.vista_monitor = x.vista;
            parametros.rxp_monitor = x.rxp;
            segundos = parseFloat(x.segundos);
            font_size = x.font_size;
            ancho_columna = x.ancho_columna;
            if (x.mostrar.trim().length > 0) {
                mostrar = JSON.parse(x.mostrar);
            }
            // console.log("x.segundos:", x.segundos);
            // console.log("segundos:", segundos);
        } else {
            error = true;
            mensaje = "No se pudo leer la configuración del monitor declarado.";
        }
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

        const res = await fetch(`/api/reserva/monitor`, {
            method: "POST",
            body: JSON.stringify({
                fecha: strfecha,
                cod_uni: parametros.cod_uni,
            }),
        });

        const jsn = await res.json();

        if (res.ok) {
            registros = [...jsn];
        }

        pagina_actual++;
    }

    function paginar() {
        filas = [];
        registros.map((r) => {
            let estado = "";
            if (r.desde <= r.ahora && r.hasta >= r.ahora) estado = "EN HORARIO";
            if (r.desde > r.ahora) estado = "EN ESPERA";

            let display = "block";
            if (r.ahora < "13:00" && r.desde >= "13:00") display = "none";
            if (r.ahora >= "13:00" && r.hasta < "13:00") display = "none";
            if (r.ahora > r.hasta) display = "none";
            if (parametros.vista_monitor == 1) display = "block";

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

        parametros.rxp_monitor = parseInt(parametros.rxp_monitor);

        paginas = parseInt(filas.length / parametros.rxp_monitor);

        if (filas.length / parametros.rxp_monitor > paginas) paginas++;

        // console.log("parametros.rxp_monitor:", parametros.rxp_monitor);
        // console.log("paginas:", paginas);

        if (pagina_actual > paginas) pagina_actual = 1;

        let primero = (pagina_actual - 1) * parametros.rxp_monitor;
        let ultimo = pagina_actual * parametros.rxp_monitor;

        filas = filas.slice(primero, ultimo);

        filas = [...filas];

        // console.log("paginar ");
        // console.log("registros:", registros);
        // console.log("filas:", filas);
    }
</script>

{#if error || parametros.error}
    <div style="padding:50px; text-align:center">
        La identificación de monitor no es válida ! ! !
    </div>
{:else}
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

    <div class="w3-responsive" style="font-size: {font_size}px;">
        <table cellspacing="1" cellpadding="5" border="0" style="width:100%">
            <!-- <colgroup>
                <col width="130px" />
            </colgroup> -->
            <thead>
                <tr class="titulos w3-xlarge">
                    <td style="text-align: center; width:{ancho_columna}px"
                        >Horario <br /> <i>Estado</i></td
                    >
                    <td>Materia/Actividad <br /> <i>Ubicación</i></td>
                </tr>
            </thead>
            <tbody>
                {#each filas as r}
                    {#if r.display == "block"}
                        <tr
                            class="filas"
                            style="background-color: {r.bgcolor}; color:{r.color};"
                            >{#if r.suspendida == 1}
                                <td
                                    style="vertical-align: top; text-align:center; boder:2px solid red;background-color:lightgoldenrodyellow; color:red; font-weight:bold; width:{ancho_columna}px;"
                                >
                                    {r.desde} - {r.hasta} <br />
                                    SUSPENDIDA
                                </td>
                            {:else}
                                <td
                                    style="vertical-align: top; text-align:center; width:{ancho_columna}px"
                                    >{r.desde} - {r.hasta} <br />
                                    <i>{r.estado}</i></td
                                >
                            {/if}
                            <td valign="top">
                                <div class="actividad">
                                    {#if mostrar.unidad}
                                        {r.unidad_academica.toUpperCase()} /
                                    {/if}
                                    {#if mostrar.carrera}{r.carrera.toUpperCase()}
                                        /
                                    {/if}
                                    {r.materia}
                                    {#if r.catedra != ""}
                                        ({r.catedra.toUpperCase()})
                                    {/if}
                                    {#if r.comision != ""} ({r.comision}) {/if}
                                    {#if r.descri != ""} / {r.descri} {/if}
                                    {#if mostrar.docente} / {r.docente} {/if}
                                    <!-- {r.actividad} -->
                                </div>
                                <div class="ubicacion">
                                    {r.sede} - {r.edificio} - {r.espacio} ({r.planta})
                                </div>
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<style>
    .titulos {
        background-color: gray;
        color: white;
        font-weight: bold;
    }
    .filas {
        font-size: 70%;
        font-weight: bold;
        letter-spacing: 2px;
    }
    .actividad {
        /* height: 40px; */
        /* text-overflow: ellipsis;
        white-space: nowrap; */
        overflow-x: visible;
    }
    .ubicacion {
        /* height: 20px; */
        font-style: italic;
    }
</style>
