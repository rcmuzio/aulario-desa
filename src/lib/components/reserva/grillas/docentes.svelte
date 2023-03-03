<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Paginado from "$lib/components/reserva/paginado.svelte";
    import { apiFetch } from "$lib/client/api";

    const dispatch = createEventDispatcher();

    export let cod_uni = "00";

    let docentes = [];
    let importados = [];

    let importando_docentes = false;

    let filas_procesadas = 0;
    let filas_docentes = 0;
    let docentes_importados = 0;
    let display_importar_docentes = "none";
    let display_continuar = "none";

    let paginado = { pagina: 1, registros: 0, rxp: 10, paginas: 0 };

    export let display = "none";

    let filtro = {
        cod_prof: "",
        apellido: "",
        nombre: "",
    };

    let filtro_limpio = { ...filtro };

    onMount(async () => {
        await cargar();
    });

    $:{
        cod_uni=cod_uni;
        console.log('COD_UNI:::', cod_uni)
        cargar();
    }

    $: if (
        filtro.cod_prof.length > 0 ||
        filtro.apellido.length > 0 ||
        filtro.nombre.length > 0
    )
        cargar();

    async function cargar() {
        // const res = await fetch("/api/publico/buscar/docentes/consulta", {
        //     method: "POST",
        //     body: JSON.stringify({ filtro, paginado }),
        // });

        console.log('FILTRO:::', filtro);
        
        const res = await apiFetch({
            ruta: "/api/publico/buscar/docentes/consulta",
            method: "POST",
            token: false,
            body: { filtro, paginado },
        });

        const jsn = await res.json();

        if (res.ok) {
            docentes = [...jsn.datos];
            paginado.registros = jsn.registros;
            paginado.paginas = jsn.paginas;
        } else {
            alert("NO RECUPERA CONSULTA DOCENTES");
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

    async function actualizar_docentes() {

        const res = await fetch(
            `https://siuc2.ucc.edu.ar/wucc/wucc_web/ws_aula02.php?tipo=P&unid=${cod_uni}`,
            {
                method: "POST",
                body: JSON.stringify({ cod_uni }),
            }
        );

        const jsn = await res.json();

        importando_docentes = false;

        if (res.ok) {
            filas_docentes = jsn.length;
            await importar(jsn);
        } else {
            alert("Se produjo un error. Intente más tarde.");
        }

    }
    async function importar(filas) {
        display_importar_docentes = "block";
        filas_procesadas = 0;
        docentes_importados = 0;
        let i = 0;
        for (let fila of filas) {
            let res = await fetch("/api/publico/importar/docentes", {
                method: "POST",
                body: JSON.stringify(fila),
            });
            let jsn = await res.json();
            if (res.ok) {
                // console.log(jsn);
                docentes_importados += jsn.importado ? jsn.importado : 0;
                if (jsn.importado > 0) {
                    importados.push(fila);
                    console.log("IMPORTADOS:", importados);
                    importados = [...importados];
                }
            }
            filas_procesadas++;
        }
        display_continuar = "block";
    }
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content">
        <div class="w3-container">
            <div class="w3-display-container" style="height: 45px;">
                <div class="w3-display-toplef">
                    <h2>Seleccionar Docente ({cod_uni})</h2>
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
                            <td>
                                <button
                                    style="border:none; background-color:transparent; cursor:pointer"
                                    title="Actualizar Docentes"
                                    on:click={actualizar_docentes}
                                >
                                    <i class="fa fa-cloud-download w3-medium" />
                                </button>
                            </td>
                            <th>Código:</th>
                            <th>Apellido</th>
                            <th>Nombre</th>
                        </tr>
                        {#if importando_docentes}
                            <tr>
                                <td colspan="4">Actualizando docentes...</td>
                            </tr>
                        {:else}
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
                                        bind:value={filtro.cod_prof}
                                        style="width:100%"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        bind:value={filtro.apellido}
                                        style="width:100%"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        bind:value={filtro.nombre}
                                        style="width:100%"
                                    />
                                </td>
                            </tr>
                        {/if}
                    </thead>
                    <tbody>
                        {#if !importando_docentes}
                            {#each docentes as s}
                                <tr on:click={() => dispatch("elegido", s)}>
                                    <td width="18px" />
                                    <td>{s.cod_prof}</td>
                                    <td>{s.apellido}</td>
                                    <td>{s.nombre}</td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div class="w3-modal" style="display: {display_importar_docentes};">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div
                class="w3-section w3-xlarge w3-text-blue"
                style="font-weight: bold;"
            >
                Importando docentes
            </div>
            <div class="w3-section">
                <div class="w3-center w3-large">
                    Procesando {filas_procesadas} de {filas_docentes} <br />
                    <sapan class="w3-text-red"
                        >Docentes importados {docentes_importados}</sapan
                    >
                </div>
            </div>
        </div>
        <div class="w3-padding w3-center" style="display:{display_continuar}">
            <button
                class="w3-btn w3-round w3-blue"
                on:click={() => {
                    display_importar_docentes = "none";
                    display_continuar = "none";
                    docentes_importados = 0;
                    filas_procesadas = 0;
                    cargar();
                }}>Continuar</button
            >
        </div>
        {#if importados.length > 0}
            <div class="w3-padding">
                <div class="w3-responsive">
                    <table class="w3-tiny" align="center">
                        <thead>
                            <tr>
                                <th style="border-bottom: 1px solid black;"
                                    >Código</th
                                >
                                <th style="border-bottom: 1px solid black;"
                                    >Docente</th
                                >
                            </tr>
                        </thead>
                        <tbody>
                            {#each importados as i}
                                <tr>
                                    <td>{i.COD_PROF}</td>
                                    <td>{i.APELLIDO}, {i.NOMBRE}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    </div>
</div>
