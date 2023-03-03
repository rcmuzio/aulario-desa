<script>
    // import { goto } from "$app/navigation";
    // import { page } from "$app/stores";
    // import { apiFetch } from "$lib/funciones";

    import {
        /* sre_sistema, */
        /* sre_usuario, */
        sre_reserva,
        sre_cod_uni_actual,
        sre_data,
    } from "$lib/stores";
    // import { variables } from "$lib/variables";

    import { onMount } from "svelte";

    import SelectorUnidadVista from "$lib/components/reserva/selector_unidad_vista.svelte";
    import UbicacionActividad from "$lib/components/reserva/ubicacion_actividad.svelte";
    import Grilla from "$lib/components/reserva/grilla/index.svelte";

    import Panel from "$lib/components/reserva/panel.svelte";
    import Mensajes from "$lib/components/reserva/mensajes.svelte";

    let mensajes = [];
    let displayMensajes = "none";

    let hay_error = false;
    let hay_error_mensaje = "";
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

    let hora_tope = 7;

    let hoy = new Date();
    let ddd = hoy.getDate().toString();
    if (ddd.length == 1) ddd = "0" + ddd;
    let mmm = (hoy.getMonth() + 1).toString();
    if (mmm.length == 1) mmm = "0" + mmm;

    let reserva = { fecha: "", desde: "", hasta: "" };

    let consulta = {
        fecha: hoy.getFullYear() + "-" + mmm + "-" + ddd,
        cod_uni: "XX",
        vista: 1,
        espacio_id: 0,
        tipo: "semanal",
        confirmada: 1,
        muestra: 1,
    };
    //----------------------------

    $: {
        sre_cod_uni_actual.actualizar(consulta.cod_uni);
    }

    onMount(async () => {
        //sre_sistema.actualizar("Reserva");

        consulta.cod_uni = $sre_data.unidades_vinculadas[0].cod_uni;

        if ($sre_reserva.cod_uni == undefined) {
            setParamReserva();
        } else {
            consulta.cod_uni = $sre_reserva.cod_uni;
            consulta.vista = $sre_reserva.vista;
            consulta.fecha = $sre_reserva.fecha;
        }
    });

    async function cambia_fecha(event) {
        consulta.fecha = event.detail.fecha;
        setParamReserva();
    }

    async function cambia_unidad(event) {
        consulta.cod_uni = event.detail.cod_uni;
        setParamReserva();
        //await cargar();
    }

    async function cambia_espacio(event) {
        console.log("ESPACIO_ID:::::", event.detail);
        if (event.detail.espacio_id > 0) {
            consulta.espacio_id = event.detail.espacio_id;
        } else {
            consulta.espacio_id = event.detail.espacio_id; //0;
        }
        setParamReserva();
    }

    async function buscar_texto(event) {
        consulta.buscar_texto = event.detail.buscar;
        // console.log('consulta.buscar_texto:', consulta.buscar_texto)
        setParamReserva();
    }

    async function cambia_vista(event) {
        consulta.vista = event.detail.vista;
        console.log('VISTA::::', consulta.vista)
        consulta.espacio_id = "0";
        setParamReserva();
        //await cargar();
    }

    async function cambia_muestra(event) {
        consulta.muestra = event.detail.muestra;
        setParamReserva();
    }

    function setParamReserva() {
        sre_reserva.actualizar({
            cod_uni: consulta.cod_uni,
            vista: consulta.vista,
            fecha: consulta.fecha,
            espacio_id: consulta.espacio_id,
            muestra: consulta.muestra,
            buscar: consulta.buscar_texto || "",
        });

        // console.log('sre_reserva:', $sre_reserva)
    }

    function reserva_apuntada(event) {
        reserva = { ...event.detail.reserva };
    }

    function reservar_evento(event) {
        mensajes = [];
        if (consulta.espacio_id == 0) {
            mensajes = [
                ...[
                    "Para reservar un horario, debe seleccionar la vista <b>Ocupación Física</b> y un <b>Esapcio/Aula</b>.",
                ],
            ];
            displayMensajes = "block";
            return;
        }
        alert(
            "reservar evento " + event.detail.hora + ":" + event.detail.minuto
        );
    }
</script>

<!-- <h1>Reserva</h1> -->

{#if hay_error}
    <div style="padding:50px; color:red; font-size:larger; text-align:center">
        {hay_error_mensaje}
    </div>
{:else if consulta.cod_uni != "XX"}

    <div id="contenedor">
        <div id="barra_izquierda">
            <Panel
                fecha={consulta.fecha}
                on:cambia_fecha={cambia_fecha}
                on:fecha={cambia_fecha}
                on:cambia_muestra={cambia_muestra}
                on:buscar_texto={buscar_texto}
            />
        </div>
        <div id="barra_derecha">
            <SelectorUnidadVista
                cod_uni={consulta.cod_uni}
                vista={consulta.vista}
                on:cambia_unidad={cambia_unidad}
                on:cambia_vista={cambia_vista}
                on:cambia_espacio={cambia_espacio}
            />
            <UbicacionActividad {reserva} />
            <Grilla
                {consulta}
                on:reserva_apuntada={reserva_apuntada}
                on:reservar_evento={reservar_evento}
            />
        </div>
    </div>
{/if}
<Mensajes
    display={displayMensajes}
    {mensajes}
    on:salir={() => (displayMensajes = "none")}
/>

<style>
    #contenedor {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    #barra_izquierda {
        float: left;
        width: 165px;
    }
    #barra_derecha {
        width: 100%;
    }
</style>
