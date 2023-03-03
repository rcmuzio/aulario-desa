<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Paginado from "$lib/components/reserva/paginado.svelte";

    const dispatch = createEventDispatcher();

    let unidades = [];

    let paginado = { pagina: 1, registros: 0, rxp: 10, paginas: 0 };

    export let display = "none";

    let filtro = {
        nomb_uni: "",
    };

    let filtro_limpio = { ...filtro };

    onMount(async () => {
        await cargar();
    });

    $: if (filtro.nomb_uni.length >= 0) cargar();

    async function cargar() {

        const res = await fetch("/api/mantenimiento/unidades/consulta", {
            method: "POST",
            body: JSON.stringify({ filtro, paginado }),
        });

        const jsn = await res.json();

        // console.log('CARGAR unidades:', jsn)
        if (res.ok) {
            unidades = [...jsn.datos];
            paginado.registros = jsn.registros;
            paginado.paginas = jsn.paginas;
        } else {
            alert("NO RECUPERA CONSULTA unidades");
        }
    }

    async function paginado_primera(event) {
        paginado.pagina = 1;
        paginado = { ...paginado };
        await cargar();
    }

    async function paginado_anterior(event) {
        if (paginado.pagina > 1) {
            paginado.pagina = paginado.pagina - 1;
            paginado = { ...paginado };
            await cargar();
        }
    }

    async function paginado_proxima(event) {
        paginado.pagina = paginado.pagina + 1;
        paginado = { ...paginado };
        await cargar();
    }

    async function paginado_ultima(event) {
        paginado.pagina = paginado.paginas;
        paginado = { ...paginado };
        await cargar();
    }

    async function paginado_rxp(event) {
        // console.log("registros por pagina=" + event.detail.rxp);
        paginado.rxp = event.detail.rxp;
        paginado = { ...paginado };
        await cargar();
    }
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content">
        <div class="w3-container">
            <div class="w3-display-container" style="height: 65px;">
                <div class="w3-display-toplef">
                    <h2>Seleccionar Unidad Académica/Gestión</h2>
                </div>
                <div class="w3-display-topright">
                    <button
                        class="w3-btn w3-red"
                        on:click={() => dispatch("salir")}
                    >
                        <i class="fa fa-close w3-text-white" />
                    </button>
                </div>
            </div>
            <div class="w3-responsive">
                <Paginado
                    {paginado}
                    on:proxima={paginado_proxima}
                    on:primera={paginado_primera}
                    on:anterior={paginado_anterior}
                    on:ultima={paginado_ultima}
                    on:rxpag={paginado_rxp}
                />
            </div>
            <div class="w3-responsive w3-small" style="padding-right:2px">
                <table class="w3-table-all">
                    <thead>
                        <tr>
                            <td />
                            <th>Unidad</th>
                        </tr>
                        <tr>
                            <td>
                                <button
                                    style="border:none; background-color:transparent; cursor:pointer"
                                    title="Limpiar Filtro"
                                    on:click={() => {
                                        filtro = { ...filtro_limpio };
                                        paginado.pagina = 1;
                                        cargar();
                                    }}
                                >
                                    <i
                                        class="fa fa-trash-o w3-medium w3-text-black"
                                    />
                                </button>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.nomb_uni}
                                    style="width:100%"
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {#each unidades as s}
                            <tr on:click={() => dispatch("elegida", s)}>
                                <td width="18px" />
                                <td>{s.nomb_uni}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
