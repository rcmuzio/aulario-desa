<script>
    import { onMount, createEventDispatcher } from "svelte";

    import EncabezadoPagina from "$lib/encabezado_pagina.svelte";
    import { apiFetch } from "$lib/client/api";

    export let display = "none";
    export let sede_id = 0;

    const dispatch = createEventDispatcher();

    let edificios = [];

    $: {
        sede_id = sede_id;
        if(sede_id>0) cargar();
    }

    async function cargar() {
        // const res = await fetch(`/api/reserva/publico/edificios`, {
        //     method: "POST",
        //     body: JSON.stringify({ sede_id }),
        // });

        const res = await apiFetch({
            ruta: `/api/publico/misreservas/edificios`,
            method: "POST",
            token: false,
            body: { sede_id },
        })


        if (res.ok) {
            const jsn = await res.json();
            console.log("RESPUESTA:", jsn);
            edificios = [...jsn.datos];
        }
    }
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <EncabezadoPagina
                titulo={"Seleccione un Edificio o Lugar"}
                ruta={"/app/publico/misreservas"}
            />
            <br />
            <div class="w3-adding">
                {#each edificios as x}
                    <div
                        class="w3-card w3-padding-24 w3-center w3-hover-text-blue w3-xlarge w3-margin"
                        style="cursor: pointer;"
                        on:click={() =>
                            dispatch("elegido", {
                                edificio_id: x.id,
                                nombre: x.nombre,
                            })}
                    >
                        <b>{x.nombre}</b>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
