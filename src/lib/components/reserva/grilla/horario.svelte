<script>
    import { goto } from "$app/navigation";
    //import { page } from "$app/stores";

    //import { sre_unidades_vinculadas } from "../../../../store";
    import { sre_data } from "$lib/stores";

    import { createEventDispatcher, onMount } from "svelte";
    import AccesoRestringido from "$lib/components/reserva/acceso_restringido.svelte";
    import ReservaPublica from "./reserva_publica/index.svelte";
    import { apiFetch } from "$lib/client/api";

    const dispatch = createEventDispatcher();

    //----------------------------
    let ah = 50;
    let xhoras = [];
    for (let i = 7; i < 24; i++) {
        let ii = i.toString();
        ii = (ii.length == 1 ? "0" : "") + ii;

        xhoras.push(ii + ":00");
    }
    let dias = [];
    //----------------------------

    let displayAccesoRestringido = "none";
    let displayReservaPublica = "none";

    let hora_tope = 7;

    let hora_apuntada = "";

    let hoy = new Date();
    let mmm = (hoy.getMonth() + 1).toString();
    if (mmm.length == 1) mmm = "0" + mmm;

    let reserva = { fecha: "", desde: "", hasta: "" };
    let reserva_id = 0;
    let serie = "";

    let intSubir = null;
    let intBajar = null;

    let reservas_confirmadas = 0;

    export let consulta = {
        fecha: hoy.getFullYear() + "-" + mmm + "-" + hoy.getDate(),
        cod_uni: "XX",
        vista: 1,
        espacio_id: 0,
        tipo: "semanal",
        confirmada: 1,
        muestra: 1,
    };

    $: if (consulta.cod_uni != "XX") {
        // console.log("HORARIO cambio consulta:", consulta);
        limpiar_reserva();
        cargar();
    }

    $: muestra = consulta.muestra;
    $: d_actual = new Date(consulta.fecha + " 00:00:01").getDate();
    $: ancho_columna_dia = consulta.muestra == 1 ? 16.6 : 100;
    $: ancho_encabezado_columna_dia = consulta.muestra == 1 ? 16.7 : 100;

    $: {
        reservas_confirmadas = 0;
        dias.map((d) => {
            d.horas.map((h) => {
                if (
                    consulta.muestra == "1" ||
                    (consulta.muestra == 2 && d.num_dia == d_actual)
                ) {
                    reservas_confirmadas += h.detalle.length;
                }
            });
        });
    }

    let displayEditar = "None";

    onMount(async () => {
        limpiar_reserva();
    });

    let yhoras = [
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
    ];

    let minutos = [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
    ];

    async function cargar() {

        // const res = await fetch("/api/reserva/consulta", {
        //     method: "POST",
        //     body: JSON.stringify({ ...consulta }),
        // });

        const res = await apiFetch({
            ruta: "/api/reserva/consulta",
            method: "POST",
            token: false,
            body:{ ...consulta }
        });

        const jsn = await res.json();

        reservas_confirmadas = 0;

        if (res.ok) {
            dias = [...jsn];
        } else {
            alert("ERROR no recupera reservas.");
        }
    }

    function limpiar_reserva() {
        /* displayCuadro = "none"; */
        reserva.sede = "";
        reserva.edificio = "";
        reserva.unidad = "";
        reserva.espacio = "";
        reserva.planta = "";
        reserva.capacidad = "";
        reserva.capacidad_autorizada = "";
        reserva.unidad_academica = "";
        reserva.carrera = "";
        reserva.materia = "";
        reserva.catedra = "";
        reserva.comision = "";
        reserva.docente = "";
        reserva.descri = "";
        reserva.fecha = "";
        reserva.desde = "";
        reserva.hasta = "";

        dispatch("reserva_apuntada", { reserva });
    }

    function minuto_apuntado() {
        //hora_apuntada = h.substr(0, 2) + ":" + m;
        alert("hora apuntada:");
    }

    function reserva_apuntada(h) {
        reserva = { ...h };
        cursor_x = h.desde;
        // console.log(h);
        dispatch("reserva_apuntada", { reserva });
    }

    function subir() {
        //clearInterval(intSubir)
        intSubir = setInterval(() => {
            const gg = document.getElementById("div_grilla");
            gg.scrollTop += 1;
        }, 1);
    }

    function bajar() {
        //clearInterval(intBajar);
        intBajar = setInterval(() => {
            const gg = document.getElementById("div_grilla");
            gg.scrollTop -= 1;
        }, 1);
    }

    function editar_reserva(reserva) {
        let unidad_vinculada = false;
        $sre_data.unidades_vinculadas.map((u) => {
            if (u.cod_uni == reserva.cod_uni) unidad_vinculada = true;
        });
        if (unidad_vinculada) {
            if (reserva.suspendida) {
                goto(`/app/reserva/suspender?id=${reserva.id}`);
            } else {
                reserva_id = reserva.id;
                serie = reserva.serie;
                if (reserva.tipo_acti == 8) {
                    displayReservaPublica = "block";
                } else {
                    displayEditar = "block";
                }
            }
        } else {
            displayAccesoRestringido = "block";
        }
    }

    let cursor_x = "";
    let cursor_y = 0;

    function apunta_horario(h, m) {
        cursor_x = h.toString() + ":" + m.toString();
    }

    function reservar_evento(h, m) {
        dispatch("reservar_evento", { hora: h, minuto: m });
    }
</script>

<div class="w3-padding">
    <div class="w3-center w3-tiny">Reservas:{reservas_confirmadas}</div>
    <div style="border-left:1px dotted grey">
        <div>
            <div
                style="height:50px; width:50px; background-color: grey; float:left; /*border-top:1px dotted grey;*/ border-right: 1px dotted white"
            >
                <div
                    style="height:40%; width:48px ; text-align:center; font-size:11px; padding-top:5px; color:white"
                >
                    {cursor_x}
                </div>
                <div
                    on:mouseover={subir}
                    on:focus={subir}
                    on:mouseout={() => clearInterval(intSubir)}
                    on:blur={() => clearInterval(intSubir)}
                    style="height: 50%; width:50%; float:left; cursor:pointer; padding-top:5px; text-align:center"
                >
                    <i class="fa fa-arrow-circle-up" style="color:white" />
                </div>
                <div
                    on:mouseover={bajar}
                    on:focus={bajar}
                    on:mouseout={() => clearInterval(intBajar)}
                    on:blur={() => clearInterval(intBajar)}
                    style="height: 50%; width:50%; float:left; cursor:pointer; padding-top:5px; text-align:center"
                >
                    <i class="fa fa-arrow-circle-down" style="color:white" />
                </div>
            </div>
            <div
                style="height:50px;  /*background-color:grey; */; float:none; display:flex; flex-direction:row; /*border-top: dotted 1px grey*/"
            >
                {#each dias as d}
                    {#if muestra == 1 || (muestra == 2 && d.num_dia == d_actual)}
                        <div
                            style=" height:100%; width:{ancho_encabezado_columna_dia}%; z-index:8; border-right:1px dotted white; background-color:{d.color_dia}; color: {d.color};"
                        >
                            <div
                                class="w3-hide-small w3-hide-medium"
                                style="padding-top:17px ; text-align:center; font-size:11px"
                            >
                                {d.nombre}
                                {d.num_dia}
                                {d.nom_mes}
                            </div>
                            <div
                                class="w3-hide-large"
                                style="padding-top:1px ; text-align:center; font-size:11px"
                            >
                                {d.nombre}<br />
                                {d.num_dia}<br />
                                {d.nom_mes}
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>
        <div id="div_grilla" style="height: 850px; overflow-y: hidden; ">
            <div style="height: 1500px; position:relative; top:0px; left:0px">
                <div
                    style="position: absolute; top:0px; left:0px; width:100%; border:none; z-index: 5"
                >
                    {#each xhoras as h}
                        <div
                            style="height:50px; width:100%; border-bottom:dotted 1px grey"
                        >
                            <div
                                style="float:left; font-size:11px; padding-top:18px; color:grey ; width:50px; height:100%; text-align:center; border-right: dotted 1px grey"
                            >
                                {h}
                            </div>
                        </div>
                    {/each}
                </div>
                <div
                    style="z-index:6; position:relative; top:0px; left:0px;  display:flex; height:850px; flex-direction:row; "
                >
                    <div style="height:850px; width:50px;">
                        {#each xhoras as h}
                            <div
                                style="height:50px; visibility:hidden; width:50px; text-align:center; border-right:1px dotted grey; border-top:1px dotted grey;"
                            >
                                <div
                                    style="font-size:10px; visibility:hidden; padding-top:17px; text-align:center; color:grey"
                                >
                                    {h}
                                </div>
                            </div>
                        {/each}
                    </div>

                    {#each dias as d}
                        {#if muestra == 1 || (muestra == 2 && d.num_dia == d_actual)}
                            <div
                                style="/*display:flex;*/ position: relative; top:0px; /*padding-left:6px;*/ /*flex-direction:warp;*/ height:850px; width:{ancho_columna_dia}%; z-index:8; border-right:1px dotted grey; border-bottom:1px dotted; color: grey;"
                            >
                                {#each yhoras as yh, yi}
                                    {#each minutos as mm, i}
                                        <div
                                            style="position: relative; top:{26 *
                                                yi +
                                                i *
                                                    2}px; height:2px; left:0px; width:100%;  z-index:7;"
                                            on:mousemove={() =>
                                                apunta_horario(yh, mm)}
                                        />
                                    {/each}
                                {/each}
                                {#each d.horas as h}
                                    {#each h.detalle as horario, xi}
                                        {#if h.hora >= hora_tope}
                                            <div
                                                id="div-hora-{horario.hora}"
                                                on:click={() =>
                                                    editar_reserva(horario)}
                                                on:mouseout={limpiar_reserva}
                                                on:blur={limpiar_reserva}
                                                on:mousemove={() =>
                                                    reserva_apuntada(horario)}
                                                title="{horario.desde}-{horario.hasta} {horario.materia} {horario.descri}"
                                                class="w3-tiny"
                                                style=" position:absolute; 
                                                        top:{(horario.d -
                                                    hora_tope) *
                                                    ah +
                                                    1}px; 
                                                        left: {5 +
                                                    (xi * 95) /
                                                        h.detalle.length}%;
                                                        width:{95 /
                                                    h.detalle.length}%; 
                                                        height:{horario.h * ah -
                                                    horario.d * ah}px; 
                                                        border:1px solid white;
                                                        z-index:9; border-radius: 5px;padding:2px; margin-right:2px; text-align:left; overflow:hidden; background-color:{horario.color}; color:{horario.color_letra}"
                                            >
                                                <div class="cuadro">
                                                    {horario.desde}-{horario.hasta}
                                                    <br />
                                                    {d.nombre}
                                                    {d.num_dia}
                                                    {d.nom_mes}
                                                </div>
                                                <div class="cuadro">
                                                    {horario.carrera}
                                                </div>
                                                <div class="cuadro">
                                                    {horario.materia}
                                                </div>
                                                <div class="cuadro">
                                                    {horario.docente}
                                                </div>
                                                <div class="cuadro">
                                                    {horario.descri}
                                                </div>
                                            </div>
                                        {/if}
                                    {/each}
                                {/each}
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<div class="w3-modal" style="display:{displayEditar}; z-index:100">
    <div class="w3-modal-content" style="max-width: 300px ;">
        <div class="w3-padding">
            <div class="w3-section">
                <button
                    class="w3-btn w3-round w3-blue w3-block"
                    on:click={() =>
                        goto(`/app/reserva/Modificar-${reserva_id}`)}
                    >Modificar Repetición</button
                >
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-round w3-red w3-block"
                    on:click={() => goto(`/app/reserva/Borrar-${reserva_id}`)}
                    >Borrar Repetición</button
                >
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-round w3-orange w3-block"
                    on:click={() =>
                        goto(`/app/reserva/suspender?id=${reserva_id}`)}
                    >Suspender Actividad</button
                >
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-round w3-blue w3-block"
                    on:click={() =>
                        goto(`/app/reserva/serie/Modificar-${reserva.serie}`)}
                    >Modificar Serie</button
                >
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-round w3-red w3-block"
                    on:click={() =>
                        goto(`/app/reserva/serie/Borrar-${reserva.serie}`)}
                    >Borrar Serie</button
                >
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-round w3-green w3-block"
                    on:click={() =>
                        goto(`/app/reserva/serie/consulta/${reserva.serie}`)}
                    >Consultar Serie</button
                >
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-round w3-grey w3-text-white w3-block"
                    on:click={() => (displayEditar = "none")}>Salir</button
                >
            </div>
        </div>
    </div>
</div>

<ReservaPublica
    display={displayReservaPublica}
    {reserva_id}
    on:cerrar={() => {
        displayReservaPublica = "none";
        cargar();
    }}
/>

<AccesoRestringido
    display={displayAccesoRestringido}
    on:salir={() => (displayAccesoRestringido = "none")}
/>

<style>
    .cuadro {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
