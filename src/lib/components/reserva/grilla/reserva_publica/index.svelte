<script>
    import { createEventDispatcher } from "svelte";
    import { sre_usuario } from "$lib/stores";
    import EncabezadoPagina from "$lib/components/reserva/encabezado_pagina.svelte";
    import Confirmar from "$lib/components/reserva/confirmar.svelte";
    import { apiFetch } from "$lib/client/api";

    export let display = "none";
    export let reserva_id = 0;

    const dispatch = createEventDispatcher();

    let reserva = {};

    let displayConfirmar = "none";
    let mensaje = "";

    $: if (display == "block") {
        cargar();
    }

    async function cargar() {
        reserva = [];

        const headers = new Headers();

        headers.append("Type-content", "application/json");
        headers.append("Accept", "application/json");
        headers.append("x-access-token", $sre_usuario.token);

        // const res = await fetch(`/api/reserva/publico/${reserva_id}`, {
        //     method: "GET",
        //     headers,
        // });

        const res = await apiFetch({
            ruta: `/api/reserva/publico/${reserva_id}`,
            method: 'GET',
            token: false,
            body:''
        })

        if (res.ok) {
            const jsn = await res.json();
            console.log("RESERVA PUBLICA:", jsn);
            if (jsn.filas.length > 0) {
                reserva = { ...jsn.filas[0] };
            }
        } else {
            console.log("ERRROR");
        }
    }

    async function anular_reserva() {
        displayConfirmar = "none";

        const res = await apiFetch({
            ruta: `/api/reserva/publico`,
            method: "DELETE",
            token: false,
            body: {
                reserva_ocupada_id: reserva.reserva_ocupada_id,
                username: $sre_usuario.username,
            }
        })

        if (res.ok) {
            displayConfirmar = "none";
            const jsn = await res.json();
            dispatch("cerrar");
        } else {
            console.log("Borrar ERROR");
        }
    }
</script>

<div class="w3-modal w3-small" style="display:{display}; z-index:100">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <EncabezadoPagina
                titulo={"Reserva pública"}
                accion={"cerrar"}
                on:cerrar={() => dispatch("cerrar")}
            />
        </div>

        <div class="w3-row-padding">
            <div class="w3-half w3-margin-top  ">
                <label for="sede">Ubicación:</label>
                <input
                    name="sede"
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={reserva.sede}
                />
            </div>
            <div class="w3-half w3-margin-top ">
                <label for="edificio">Edificio/Lugar:</label>
                <input
                    name="edificio"
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={reserva.edificio}
                />
            </div>
            <div class="w3-half w3-margin-top ">
                <label for="espacio">Espacio:</label>
                <input
                    name="espacio"
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={reserva.espacio}
                />
            </div>
            <div class="w3-half w3-margin-top ">
                <label for="planta">Planta:</label>
                <input
                    name="planta"
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={reserva.planta}
                />
            </div>
            <div class="w3-half w3-margin-top ">
                <label for="fecha">Fecha:</label>
                <input
                    name="fecha"
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={reserva.fecha}
                />
            </div>
            <div class="w3-half w3-margin-top ">
                <label for="horario">Horario:</label>
                <input
                    name="horario"
                    type="text"
                    class="w3-input w3-round w3-light-grey"
                    readonly
                    bind:value={reserva.horario}
                />
            </div>
        </div>

        {#if reserva.apenom && reserva.apenom.length > 0}
            <div class="w3-row-padding">
                <div class="w3-half w3-margin-top ">
                    <label for="apenom">Reservado por:</label>
                    <input
                        name="apenom"
                        type="text"
                        class="w3-input w3-round w3-sand"
                        readonly
                        bind:value={reserva.apenom}
                    />
                </div>
                <div class="w3-half w3-margin-top ">
                    <label for="apenom">Clave:</label>
                    <input
                        name="apenom"
                        type="text"
                        class="w3-input w3-round w3-sand"
                        readonly
                        bind:value={reserva.username}
                    />
                </div>
                <div class="w3-half w3-margin-top ">
                    <label for="apenom">Fecha y hora:</label>
                    <input
                        name="apenom"
                        type="text"
                        class="w3-input w3-round w3-sand"
                        readonly
                        bind:value={reserva.fecha_reserva}
                    />
                </div>
            </div>
            {#if reserva.f3 < reserva.f1}
                <div class="w3-padding">
                    <button
                        class="w3-btn w3-round w3-block w3-red w3-large"
                        style="font-weight: bold"
                        on:click={() => {
                            mensaje = "¿Anula la reserva seleccionada?";
                            displayConfirmar = "block";
                        }}>Anular reserva</button
                    >
                </div>
            {:else}
                <br />
            {/if}
        {:else}
            <br />
        {/if}
    </div>
</div>

<Confirmar
    display={displayConfirmar}
    {mensaje}
    on:si={anular_reserva}
    on:no={() => (displayConfirmar = "none")}
    on:cerrar={() => (displayConfirmar = "none")}
/>

<style>
    input {
        font-weight: bold;
    }
</style>
