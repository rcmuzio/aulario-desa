<script>
    import { createEventDispatcher, onMount } from "svelte";

    export let id = 0;
    export let solo_lectura =false;

    let tipo_espacio = "";

    const dispatch = createEventDispatcher();
    let tipos = [];

    $: {
        tipos.map((s) => {
            if (s.id == id) tipo_espacio = s.tipo_espacio;
        });
        dispatch("elegido", { id, tipo_espacio });
    }

    onMount(async () => {

        const res = await fetch(
            "/api/mantenimiento/tipo_espacio",
            {
                method: "GET",
            }
        );

        const jsn = await res.json()

        if (res.ok) {
            tipos = [...jsn];
        } else {
            alert("Error: NO RECUPERA tipo_espacio");
        }
    });
</script>

<div class="w3-section">
    <label for="id">Tipo de espacio:</label>
    <select
        name="id"
        class="w3-input w3-border w3-round w3-light-grey "
        bind:value={id}
        disabled={solo_lectura}
        style="height:43px"
    >
        <option value=0>...</option>
        {#each tipos as u}
            <option value={u.id}>{u.tipo_espacio}</option>
        {/each}
    </select>
</div>
