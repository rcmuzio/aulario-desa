<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let vista = 1;

    // let vistas = [
    //     { valor: 1, descri: "Nuestra actividad en todos los espacios" },
    //     { valor: 2, descri: "Actividad en nuestros espacios" },
    //     { valor: 3, descri: "Nuestra actividad en espacios de otras unidades" },
    //     { valor: 4, descri: "Actividad de otros unidades en nuestros espacios" },

    let vistas = [
        { valor: 1, descri: "En todos los espacios" },
        { valor: 2, descri: "En espacios predeterminados" },
        { valor: 3, descri: "En espacios no predeterminados" },
    ];

    function cambia() {
        dispatch("cambia", { vista });
    }
</script>

<label for="vista">Mostrar actividad:</label>
<select
    name="vista"
    class="w3-input w3-round w3-light-grey"
    bind:value={vista}
    on:change={cambia}
>
    {#each vistas as v}
        <option value={v.valor}>{v.descri}</option>
    {/each}
</select>
