<script>
    import { createEventDispatcher, onMount } from "svelte";

    let sede_id = 0;

    const dispatch = createEventDispatcher();
    let sedes = [];
    let sede = "";

    $: {
        sedes.map((s) => {
            if (s.id == sede_id) sede = s.nombre;
        });
        dispatch("elegida", { sede_id: sede_id, sede });
    }

    onMount(async () => {
        // const res = await apiFetch({
        //     ruta: "/aulario/mantenimiento/sedes",
        //     method: "GET",
        //     body: "",
        // });

        // if (res.detail) {
        //     console.log("Error:", res.detail);
        // } else {
        //     sedes = [...res];
        // }

        const res = await fetch(`/api/mantenimiento/sedes`, {
            method: "GET",
        });

        const jsn = await res.json();

        if (res.ok) {
            sedes = [...jsn];
        } else {
            console.log("Error: NO RECUPERA SEDES");
        }
    });
</script>

<div class="w3-section">
    <label for="sede_id">Seleccione una Ubicación:</label>
    <select
        name="sede_id"
        class="w3-input w3-round w3-border w3-light-grey"
        bind:value={sede_id}
    >
        {#each sedes as s}
            <option value={s.id}>{s.nombre}</option>
        {/each}
    </select>
</div>
