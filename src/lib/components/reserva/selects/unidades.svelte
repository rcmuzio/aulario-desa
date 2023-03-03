<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { sre_data } from "$lib/stores";

    export let cod_uni = "00";
    export let solo_lectura = false;

    let nomb_uni = "";

    const dispatch = createEventDispatcher();
    let unidades = [];

    $: {
        unidades.map((s) => {
            if (s.cod_uni == cod_uni) nomb_uni = s.nomb_uni;
        });
        dispatch("elegida", { cod_uni, nomb_uni });
    }

    onMount(() => {
        unidades = [...$sre_data.unidades];
    });

    function cambia() {
        dispatch("cambia", { cod_uni });
    }
</script>

<label for="cod_uni">Unidad Académica/Gestión:</label>
<select
    name="cod_uni"
    class="w3-input w3-round w3-light-grey "
    bind:value={cod_uni}
    disabled={solo_lectura}
    on:change={cambia}
>
    <option value="00">...</option>
    {#each unidades as u}
        <option value={u.cod_uni}>{u.nomb_uni}</option>
    {/each}
</select>
