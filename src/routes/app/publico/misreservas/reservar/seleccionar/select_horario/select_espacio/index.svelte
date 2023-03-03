<script>
    import { apiFetch } from "$lib/client/api";
    import { createEventDispatcher } from "svelte";
    import DetalleEspacio from "./detalle_espacio/index.svelte";

    import Horarios from "./horarios/index.svelte";

    export let fecha_elegida = {};
    // export let fecha_descri = "";
    export let edificio_id = 0;
    export let tiene_reserva = { ok: false };
    const dispatch = createEventDispatcher();

    let espacios = [];

    let espacio_id = 0;
    let displayDetalleEspacio = "none";

    $: {
        // fecha = fecha;
        fecha_elegida = { ...fecha_elegida };
        edificio_id = edificio_id;
        if (edificio_id > 0) cargar();
    }

    async function cargar() {

        const res = await apiFetch({
            ruta: `/api/publico/misreservas/espacios`,
            method: "POST",
            token: false,
            body: {
                edificio_id,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log('ESPACIOS:',jsn)
            espacios = [...jsn.datos];
        }
    }
</script>

<!-- <h3>{JSON.stringify({ fecha_elegida })}</h3> -->

<div class="w3-center">
    <h3>Espacios y horarios disponibles</h3>
    {#each espacios as e}
        <div class="w3-border w3-round w3-padding w3-margin w3-center">
            <div class="w3-display-container" style="height:40px ;">
                <div
                    class="w3-display-topright"
                    on:click={() => {
                        espacio_id = e.id;
                        displayDetalleEspacio = "block";
                    }}
                >
                    <i
                        class="fa fa-hand-pointer-o w3-large w3-text-gray w3-hover-text-black"
                        title="Características del espacio"
                    />
                </div>
            </div>
            <b>{e.nombre} ({e.id}) ({e.cod_uni})</b>
            <br />
            <div class="w3-small">(Capacidad:<b>{e.capacidad}</b>)</div>

            <div class="w3-text-grey">
                <i
                    class="fa fa-arrow-left w3-hover-text-black"
                    on:click={() => dispatch("fecha_anterior")}
                />
                <b>{fecha_elegida.descri2}</b>
                <i
                    class="fa fa-arrow-right w3-hover-text-black"
                    on:click={() => dispatch("fecha_proxima")}
                />
            </div>
            <Horarios
                espacio_id={e.id}
                {edificio_id}
                {fecha_elegida}
                x_cod_uni={e.cod_uni}
                {tiene_reserva}
                on:actualizar_tiene_reserva={()=>{
                    dispatch('actualizar_tiene_reserva');
                }}
            />
        </div>
    {/each}
</div>

<DetalleEspacio
    {espacio_id}
    display={displayDetalleEspacio}
    on:cerrar={() => (displayDetalleEspacio = "none")}
/>
<style>
    i {
        cursor: pointer;
    }
</style>
