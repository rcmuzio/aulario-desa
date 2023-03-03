<script>
    import { sre_reserva } from "$lib/stores";
    import Calendario from "$lib/components/reserva/calendario/calendario.svelte";
    import Monitor from "$lib/components/reserva/monitor/index.svelte";
    import SinPaginar from "$lib/components/reserva/monitor/sin_paginar.svelte";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { apiFetch } from "$lib/client/api";

    export let fecha = "";

    let sin_paginar = false;

    let calendario = {
        displaySelectMuestra: "none",
    };

    let vista = 1;
    let vistas = [
        { valor: 1, descri: "Ver todo" },
        { valor: 2, descri: "Ver mañana/tarde" },
    ];

    let actividad_por_planta = 1;
    let actividades_por_planta = [
        { valor: 1, descri: "Indistinto" },
        { valor: 2, descri: "Por planta" },
    ];

    let rxp = 3;
    let rxps = [];

    for (let x = 1; x < 11; x++) {
        rxps.push({
            valor: x,
            descri: x.toString() + " RxP",
        });
        rxps = [...rxps];
    }

    let pausa_monitor = 10;
    let pausas = [
        { valor: 10, descri: "10''" },
        { valor: 15, descri: "15''" },
        { valor: 20, descri: "20''" },
        { valor: 25, descri: "25''" },
    ];

    let monitor_id = 0;
    let monitor = 0;
    let monitores = [];
    let mostrar = {
        unidad: true,
        carrera: true,
        docente: true,
    };

    let font_size = 8;
    let ancho_columna = 200;

    onMount(async () => {
        await cargar_config_monitor();
    });

    function cambia_mostrar() {
        let x = { ...$sre_reserva, mostrar: { ...mostrar } };
        sre_reserva.actualizar(x);
    }

    function cambia_fecha(event) {
        let x = { ...$sre_reserva };
        x.fecha = event.detail.fecha;
        sre_reserva.actualizar(x);
    }

    function cambia_font_size() {
        let x = { ...$sre_reserva, font_size };
        sre_reserva.actualizar(x);
    }

    function cambia_ancho_columna() {
        let x = { ...$sre_reserva, ancho_columna };
        sre_reserva.actualizar(x);
    }

    function cambia_vista() {
        let x = { ...$sre_reserva, vista_monitor: vista };
        sre_reserva.actualizar(x);
    }

    function cambia_rxp() {
        let x = { ...$sre_reserva, rxp_monitor: rxp };
        sre_reserva.actualizar(x);
    }

    function cambia_actividad_monitor() {
        let x = { ...$sre_reserva, actividad_por_planta };
        sre_reserva.actualizar(x);
    }

    function cambia_pausas() {
        let x = { ...$sre_reserva, pausa_monitor };
        sre_reserva.actualizar(x);
    }

    function cambia_monitor() {
        monitores.map((m) => {
            if (m.id == monitor_id) {
                monitor_id = m.id;
                vista = m.vista;
                rxp = m.rxp;
                pausa_monitor = m.segundos;
                actividad_por_planta = m.actividad_por_planta;
                font_size = m.font_size;
                ancho_columna = m.ancho_columna;
                mostrar = JSON.parse(m.mostrar); //{...m.mostrar};
                let x = {
                    ...$sre_reserva,
                    monitor_id,
                    vista_monitor: m.vista,
                    rxp_monitor: m.rxp,
                    pausa_monitor: m.segundos,
                    pagina_monitor: 1,
                    actividad_por_planta: m.actividad_por_planta,
                    font_size: m.font_size,
                    ancho_columna: m.ancho_columna,
                    mostrar,
                };
                sre_reserva.actualizar(x);
            }
        });
    }

    async function cargar_config_monitor() {
        // const res = await fetch(`/api/reserva/monitor/monitores`, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         cod_uni: $sre_reserva.cod_uni,
        //     }),
        // });
        const res = await apiFetch({
            ruta: `/api/reserva/monitor/monitores`, 
            method: "POST",
            token: false,
            body: {
                cod_uni: $sre_reserva.cod_uni,
            },
        });

        const jsn = await res.json();

        if (res.ok) {
            monitores = [...jsn];
            monitor_id = monitores[0].id;
            vista = monitores[0].vista;
            rxp = monitores[0].rxp;
            pausa_monitor = monitores[0].segundos;
            actividad_por_planta = monitores[0].actividad_por_planta;
            ancho_columna = monitores[0].ancho_columna;
            font_size = monitores[0].font_size;
            if (monitores[0].mostrar.trim().length > 0) {
                mostrar = await JSON.parse(monitores[0].mostrar);
            }
            let x = {
                ...$sre_reserva,
                monitor_id,
                vista_monitor: monitores[0].vista,
                rxp_monitor: monitores[0].rxp,
                pausa_monitor: monitores[0].segundos,
                pagina_monitor: 1,
                actividad_por_planta: monitores[0].actividad_por_planta,
                ancho_columna: monitores[0].ancho_columna,
                font_size: monitores[0].font_size,
                mostrar,
            };
            sre_reserva.actualizar(x);
        }
    }

    async function guardar_config_monitor() {
        // const res = await fetch("/api/reserva/monitor/config", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         id: monitor_id,
        //         rxp,
        //         vista,
        //         segundos: pausa_monitor,
        //         actividad_por_planta,
        //         ancho_columna,
        //         font_size,
        //         mostrar: JSON.stringify(mostrar),
        //     }),
        // });

        const res = await apiFetch({
            ruta: "/api/reserva/monitor/config", 
            method: "POST",
            token: false,
            body: {
                id: monitor_id,
                rxp,
                vista,
                segundos: pausa_monitor,
                actividad_por_planta,
                ancho_columna,
                font_size,
                mostrar: JSON.stringify(mostrar),
            },
        });

        await cargar_config_monitor();
        goto("/app/reserva/monitor");
    }
</script>

<div id="contenedor">
    <div id="barra_izquierda">
        <div class="w3-padding">
            <Calendario
                fecha={$sre_reserva.fecha}
                displaySelectMuestra={calendario.displaySelectMuestra}
                on:fecha={cambia_fecha}
            />
            <div class="">
                <select
                    class="w3-tiny"
                    title="Selector de Monitor"
                    style="width: 100%;"
                    bind:value={monitor_id}
                    on:change={cambia_monitor}
                >
                    {#each monitores as m}
                        <option value={m.id}>{m.planta} {m.monitor}</option>
                    {/each}
                </select>
            </div>
            {#if !sin_paginar}
                <div class="">
                    <select
                        class="w3-tiny"
                        title="Mostrar horarios"
                        style="width: 100%;"
                        bind:value={vista}
                        on:change={cambia_vista}
                    >
                        {#each vistas as v}
                            <option value={v.valor}>{v.descri}</option>
                        {/each}
                    </select>
                </div>
                <div class="">
                    <select
                        class="w3-tiny"
                        style="width: 100%;"
                        title="Mostrar registros por página"
                        bind:value={rxp}
                        on:change={cambia_rxp}
                    >
                        {#each rxps as v}
                            <option value={v.valor}>{v.descri}</option>
                        {/each}
                    </select>
                </div>
                <div class="">
                    <select
                        class="w3-tiny"
                        style="width: 100%;"
                        title="Segundos para cambio de página"
                        bind:value={pausa_monitor}
                        on:change={cambia_pausas}
                    >
                        {#each pausas as v}
                            <option value={v.valor}>{v.descri}</option>
                        {/each}
                    </select>
                </div>
                <div class="">
                    <select
                        class="w3-tiny"
                        style="width: 100%;"
                        title="Mostrar actividad por Planta"
                        bind:value={actividad_por_planta}
                        on:change={cambia_actividad_monitor}
                    >
                        {#each actividades_por_planta as v}
                            <option value={v.valor}>{v.descri}</option>
                        {/each}
                    </select>
                </div>
                <div
                    class="w3-border w3-round"
                    style="margin:5px 0px 5px 0px; padding:3px"
                >
                    <div class="w3-center w3-small" style="font-weight: bold;">
                        Mostrar
                    </div>
                    <div class="w3-tiny">
                        <input
                            type="checkbox"
                            bind:checked={mostrar.unidad}
                            on:change={cambia_mostrar}
                        />
                        <span style="margin-left:5px">Unidad</span>
                    </div>
                    <div class="w3-tiny">
                        <input
                            type="checkbox"
                            bind:checked={mostrar.carrera}
                            on:change={cambia_mostrar}
                        />
                        <span style="margin-left:5px">Carrera</span>
                    </div>
                    <div class="w3-tiny">
                        <input
                            type="checkbox"
                            bind:checked={mostrar.docente}
                            on:change={cambia_mostrar}
                        />
                        <span style="margin-left:5px">Docente</span>
                    </div>
                </div>
                <div
                    class="w3-border w3-round"
                    style="margin:5px 0px 5px 0px; padding:3px"
                >
                    <div class="w3-center w3-small" style="font-weight: bold;">
                        Tamaño letra
                    </div>
                    <div class="w3-tiny">
                        <input
                            type="range"
                            min="8"
                            max="48"
                            bind:value={font_size}
                            on:change={cambia_font_size}
                        />
                    </div>
                </div>

                <div
                    class="w3-border w3-round"
                    style="margin:5px 0px 5px 0px; padding:3px"
                >
                    <div class="w3-center w3-small" style="font-weight: bold;">
                        Ancho columna
                    </div>
                    <div class="w3-tiny">
                        <input
                            type="number"
                            min="100"
                            max="1000"
                            bind:value={ancho_columna}
                            on:change={cambia_ancho_columna}
                            style="width:100%"
                        />
                    </div>
                </div>
            {/if}
            <div class="w3-section w3-small w3-center">
                <input type="checkbox" bind:checked={sin_paginar} /> Ver sin paginar
            </div>

            {#if !sin_paginar}
                <div
                    class="w3-section"
                    title="Guardar configuración de monitor"
                >
                    <button
                        class="w3-btn w3-block w3-text-white w3-grey w3-round"
                        on:click={guardar_config_monitor}>Guardar</button
                    >
                </div>
            {/if}
            <div class="w3-section">
                <a
                    href="/app/reserva"
                    class="w3-btn w3-block w3-blue w3-round"
                    on:click={() => (sin_paginar = false)}>Reservas</a
                >
            </div>
        </div>
    </div>
    <div id="barra_derecha">
        <div>{fecha}</div>
        {#if sin_paginar}
            <SinPaginar />
        {:else}
            <Monitor />
        {/if}
    </div>
</div>

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
