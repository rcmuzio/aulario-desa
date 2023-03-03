<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let fechas = [];
    export let fecha_elegida;
</script>

<div class="w3-center">
    <h3>Fechas disponibles</h3>
    {#each fechas as f, i}
        <button
            class="w3-button w3-small w3-round {fecha_elegida.fecha == f.fecha
                ? 'w3-border w3-grey w3-text-white'
                : 'w3-light-grey w3-text-grey'}"
            style="width:110px; margin:5px"
            on:click={() => {
                dispatch("elegida", {
                    fecha: f.fecha,
                    descri: f.descri,
                    indice: i,
                });
            }}><b>{f.descri}</b></button
        >
    {/each}
</div>

<style>
    button {
        cursor: pointer;
    }
</style>
