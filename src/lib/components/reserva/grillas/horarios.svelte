<script>
    import { createEventDispatcher } from "svelte";
    export let display = "none";
    const dispatch = createEventDispatcher();
    function agregar() {
        dispatch("agregar", { mensaje: "hola" });
    }
</script>

<div class="w3-container" style="display:{display}">
    <h1>Agregar Horario</h1>
    <p>
        <button on:click={agregar}>Agregar</button>
    </p>
    <p>
        <button
            on:click={() => {
                dispatch("salir");
            }}>Salir</button
        >
    </p>
</div>
