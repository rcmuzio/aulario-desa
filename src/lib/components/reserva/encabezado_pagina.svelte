<script>
    import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    export let titulo = "";
    export let ruta = "";
    export let accion = "";
    export let color_titulo = "black";

    const dispatch = createEventDispatcher();

    function cerrar() {
        if (ruta == "") {
            dispatch(accion);
        } else {
            goto(ruta);
        }
    }
</script>

<div class="w3-display-container" style="height: 45px;">
    <div class="w3-display-toplef">
        <h2 class="w3-text-{color_titulo}">{titulo}</h2>
    </div>
    <div class="w3-display-topright">
        <button class="w3-btn w3-red" on:click={cerrar}>
            <i class="fa fa-close w3-text-white" />
        </button>
    </div>
</div>
