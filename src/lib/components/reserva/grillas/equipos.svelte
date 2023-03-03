<script>

    import { createEventDispatcher, onMount } from "svelte";
    import Paginado from "$lib/components/reserva/paginado.svelte";


    const dispatch = createEventDispatcher();

    let espacios = [];

    let paginado = { pagina: 1, registros: 0, rxp: 10, paginas: 0 };

    export let display = "none";
    export let reserva = false; /* si true, solamente muestra espacios reservables */
    
    const params = {
        display: "none",
        accion: "POST",
        color: "blue",
        titulo: "Modificar",
        boton_titulo: "Grabar",
        readonly: false,
    };

    let filtro = {
        nombre: "",
        marca: "",
        modelo: "",
        sis_vigente: "",
    };

    let filtro_limpio = { ...filtro };

    onMount(async () => {
        await cargar();
    });

    $: if (
        filtro.nombre.length >= 0 || 
        filtro.marca.length >= 0 || 
        filtro.modelo.length >= 0 ||
        filtro.sis_vigente.toString().length >= 0
    ) cargar();

    async function cargar() {
        const res = await fetch(
            '/api/mantenimiento/equipos/consulta',
            {
                method: "POST",
                body: JSON.stringify({ filtro, paginado, reserva }),
            }
        )

        const jsn = await res.json()

        if(res.ok){
            espacios = [...jsn.datos];
            paginado.registros = jsn.registros;
            paginado.paginas = jsn.paginas;
        }else{ 
            alert('NO RECUPERA CONSULTA ESPACIOS')
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
        paginado.rxp = event.detail.rxp;
        paginado = { ...paginado };
        await cargar();
    }

</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content">
        <div class="w3-container">
            <div class="w3-display-container" style="height: 45px;">
                <div class="w3-display-toplef">
                    <h2>Seleccionar Equipamiento</h2>
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
            <Paginado
                {paginado}
                on:proxima={paginado_proxima}
                on:primera={paginado_primera}
                on:anterior={paginado_anterior}
                on:ultima={paginado_ultima}
                on:rxpag={paginado_rxp}
            />
            <div class="w3-responsive w3-small" style="padding-right:2px">
                <table class="w3-table-all">
                    <thead>
                        <tr>
                            <td />
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Vigente</th>
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
                                    bind:value={filtro.nombre}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.marca}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.modelo}
                                    style="width:100%"
                                />
                            </td>
                            <td
                                ><input
                                    type="text"
                                    style="width:100%"
                                    bind:value={filtro.sis_vigente}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {#each espacios as s}
                            <tr on:click={() => dispatch("elegido", s)}>
                                <td width="18px" />
                                <td>{s.nombre}</td>
                                <td>{s.marca}</td>
                                <td>{s.modelo}</td>
                                <td>{s.sis_vigente}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
