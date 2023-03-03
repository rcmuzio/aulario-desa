<script>
    import { createEventDispatcher } from "svelte";
    import SelectUnidad from "./selects/unidades.svelte";
    import Vista from "./selects/vista.svelte";
    import SelectEspacio from "./selects/espacios.svelte";

    const dispatch = createEventDispatcher();

    export let cod_uni = "";
    export let vista = 1;

    let espacio_id = '0';

    let consulta = {
        cod_uni: "03",
        vista: 1,
        tipo: "semanal",
        confirmada: 1,
    };

    $:{
        if(vista==1) espacio_id='0'
    }

    async function cambia_unidad(event) {
        dispatch("cambia_unidad", { cod_uni: event.detail.cod_uni });
        // consulta.cod_uni = event.detail.cod_uni;
        // await cargar();
    }

    async function cambia_vista(event) {
        dispatch("cambia_vista", { vista: event.detail.vista });
        // consulta.vista = event.detail.vista;
        // await cargar();
    }

    async function cambia_espacio(event) {
        dispatch("cambia_espacio", { espacio_id: event.detail.espacio_id });
        // consulta.vista = event.detail.vista;
        // await cargar();
    }
</script>

<!-- <div class="w3-section w3-tiny"> -->
<br />
<div class="w3-row-padding w3-tiny">
    <div class="w3-half">
        <SelectUnidad {cod_uni} on:cambia={cambia_unidad} />
    </div>
    <div class="w3-quarter">
        <Vista {vista} on:cambia={cambia_vista} />
    </div>
    {#if vista == 2}
        <div class="w3-quarter">
            <SelectEspacio {cod_uni} on:cambia_espacio />
        </div>
    {:else}
        <div class="w3-quarter">
            <label for="nada">Espacios predeterminados:</label>
            <select
                name="nada"
                class="w3-round w3-input w3-light-grey"
                readonly
            />
        </div>
    {/if}
</div>
<!-- </div> -->
