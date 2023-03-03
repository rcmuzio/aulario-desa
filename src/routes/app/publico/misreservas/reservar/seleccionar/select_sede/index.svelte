<script>
    import { onMount, createEventDispatcher } from "svelte";

    import EncabezadoPagina from "$lib/encabezado_pagina.svelte";
    import { apiFetch } from "$lib/client/api";

    export let display = "none";

    const dispatch = createEventDispatcher();

    let sedes = [];

    $: {
        cargar();
    }

    async function cargar() {

        const res = await apiFetch({
            ruta: `/api/publico/misreservas/sedes`,
            method: "GET",
            token: false,
            body: ''
        })

        if (res.ok) {
            const jsn = await res.json();
            sedes = [...jsn.datos];
        }
    }
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <EncabezadoPagina
                titulo={"Seleccione una Ubicación"}
                ruta={"/app/publico/misreservas"}
                
            />
            <br />
            <div class="w3-padding">
                {#each sedes as sede}
                    <div
                        class="w3-card w3-padding-24 w3-center w3-hover-text-blue w3-xlarge w3-margin"
                        style="cursor: pointer;"
                        on:click={dispatch("elegido", {
                            sede_id: sede.id,
                            nombre: sede.nombre,
                        })}
                    >
                        <b>{sede.nombre}</b>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
