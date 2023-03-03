<script>
    import { createEventDispatcher } from "svelte";
    import EncabezadoPagina from "$lib/encabezado_pagina.svelte";
    import { apiFetch } from "$lib/client/api";
    // import Edificio from "../reservar/seleccionar/_edificio.svelte";

    const dispatch = createEventDispatcher();

    export let display = "none";
    export let espacio_id = 0;

    let espacio = {};
    let mostrar = false;

    $: {
        mostrar = false;
        // alert('mostrar espacio_id:'+espacio_id)
        espacio_id = espacio_id;
        cargar();
    }

    async function cargar() {
        const res = await apiFetch({
            ruta: `/api/publico/buscar/espacios?espacio_id=${espacio_id}`, 
            method: "GET",
            token: false,
            body:''
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("CARACTERISTICAS DEL ESPACIO JSN:::", jsn);
            espacio = { ...jsn };
        }else{
            alert('ERROR AL mostrar el espacio')
        }
        mostrar = true;
    }
</script>

<div class="w3-modal" style="display:{display}">
    {#if mostrar}
        <div class="w3-modal-content w3-round">
            <div class="w3-padding">
                <EncabezadoPagina
                    titulo={""}
                    accion={"cerrar"}
                    on:cerrar={() => dispatch("cerrar")}
                />
            <!-- </div>

            <div class="w3-padding"> -->
                <h2 class="w3-center"><b>{`${espacio.espacio}`}</b></h2>

                <div class="w3-padding w3-small">
                    <h3>Ubicación</h3>
                    <div class="w3-row-padding">
                        <div class="w3-quarter ">
                            <div>Ubicación:</div>
                            <input
                                type="text"
                                readonly
                                class="w3-input w3-light-grey w3-round"
                                bind:value={espacio.sede}
                            />
                        </div>
                        <div class="w3-quarter ">
                            <div>Edificio / Lugar:</div>
                            <input
                                type="text"
                                readonly
                                class="w3-input w3-light-grey w3-round"
                                bind:value={espacio.edificio}
                            />
                        </div>
                        <div class="w3-quarter ">
                            <div>Planta:</div>
                            <input
                                type="text"
                                readonly
                                class="w3-input w3-light-grey w3-round"
                                bind:value={espacio.planta}
                            />
                        </div>
                    </div>
                </div>

                <div class="w3-padding w3-small">
                    <h3>Características</h3>
                    <div class="w3-row-padding">
                        <div class="w3-quarter ">
                            <div>Capacidad:</div>
                            <input
                                type="text"
                                readonly
                                class="w3-input w3-light-grey w3-round"
                                value={espacio.capacidad}
                            />
                        </div>
                        <div class="w3-quarter ">
                            <div>Climatizado:</div>
                            <input
                                type="text"
                                readonly
                                class="w3-input w3-light-grey w3-round"
                                value={espacio.climatizado == 1 ? "SI" : "NO"}
                            />
                        </div>
                        <div class="w3-quarter ">
                            <div>Ventilado:</div>
                            <input
                                type="text"
                                readonly
                                class="w3-input w3-light-grey w3-round"
                                value={espacio.ventilado == 1 ? "SI" : "NO"}
                            />
                        </div>
                    </div>
                </div>

                <div class="w3-padding w3-small">
                    <h3>Equipamiento</h3>
                    <div class="w3-row-padding">
                        {#if espacio.equipos}
                            {#each espacio.equipos as e}
                                <div class="w3-quarter">
                                    <input
                                        type="text"
                                        class="w3-input w3-light-grey w3-round w3-margin-top"
                                        bind:value={e.equipo}
                                        readonly
                                    />
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>

                <div class="w3-padding">
                    <h3>Fotos</h3>
                    <div class="w3-row-padding">
                        {#if espacio.fotos}
                            {#each espacio.fotos as f, i}
                                <div class="w3-quarter">
                                    <img
                                        src={`data:${f.type};base64,${f.base64}`}
                                        alt={`Foto ${i}`}
                                        style="max-height: 150px; max-width: 100%; margin-top:10px "
                                    />
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="w3-padding w3-center">Cargando...</div>
    {/if}
</div>
