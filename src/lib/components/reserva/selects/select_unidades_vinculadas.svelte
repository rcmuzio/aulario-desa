<script>
    import { sre_data } from "$lib/stores";
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    let unidades = [];
    export let cod_uni = "";
    export let disabled = false;

    onMount(() => {
        unidades = [...$sre_data.unidades_vinculadas];
    });

    function cambio() {
        dispatch("actualizar", cod_uni);
    }
</script>

<label for="cod_uni">Unidad:</label>
<select
    name="cod_uni"
    class="w3-input w3-round w3-light-grey"
    disabled={disabled}
    bind:value={cod_uni}
    on:change={cambio}
>
    {#each unidades as u}
        <option value={u.cod_uni}>{u.unidad}</option>
    {/each}
</select>
