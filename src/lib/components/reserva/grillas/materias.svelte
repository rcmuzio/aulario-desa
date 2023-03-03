<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Paginado from "$lib/components/reserva/paginado.svelte";

    const dispatch = createEventDispatcher();

    let materias = [];
    let importados = [];

    let paginado = { pagina: 1, registros: 0, rxp: 10, paginas: 0 };

    let importando_materias = false;

    export let display = "none";
    export let cod_uni = "00";

    let filas_procesadas = 0;
    let filas_materias = 0;
    let materias_improtadas = 0;
    let display_importar_materias = "none";
    let display_continuar = "none";

    let filtro = {
        cod_uni: "03",
        cod_mat: "",
        nom_mat: "",
    };

    let filtro_limpio = { ...filtro };

    onMount(async () => {
        await cargar();
    });

    $: if (filtro.cod_uni != cod_uni) {
        filtro.cod_uni = cod_uni;
        cargar();
    }
    $: if (filtro.cod_mat.length > 0) cargar();
    $: if (filtro.nom_mat.length > 0) cargar();

    async function cargar() {
        if (importando_materias) return;

        const res = await fetch("/api/publico/buscar/materias/consulta", {
            method: "POST",
            body: JSON.stringify({ filtro, paginado }),
        });

        const jsn = await res.json();

        if (res.ok) {
            materias = [...jsn.datos];
            paginado.registros = jsn.registros;
            paginado.paginas = jsn.paginas;
        } else {
            alert("NO RECUPERA CONSULTA MATERIAS");
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

    async function actualizar_materias_a() {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open(
            "GET",
            "https://siuc2.ucc.edu.ar/wucc/wucc_web/ws_aula02_txt.php?tipo=MT&unid=05",
            true
        );

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    console.log("XML:", xmlhttp.responseText);
                }
            }
        };
        xmlhttp.setRequestHeader("Content-Type", "txt/plain");
        xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xmlhttp.setRequestHeader("Access-Control-Allow-Headers", "*");
        xmlhttp.send();
        // importando_materias = true;

        // const res = await fetch("/api/importar/materias_ucc", {
        //     method: "POST",
        //     body: JSON.stringify({ cod_uni }),
        // });
        // const jsn = await res.json();
        // importando_materias = false;
        // console.log(jsn);
    }

    async function actualizar_materias() {
        importando_materias = true;

        const res = await fetch(
            `https://siuc2.ucc.edu.ar/wucc/wucc_web/ws_aula02.php?tipo=MI&unid=${cod_uni}`,
            {
                method: "POST",
                body: JSON.stringify({ cod_uni }),
            }
        );

        const jsn = await res.json();

        const resx= await fetch(
            `https://siuc2.ucc.edu.ar/wucc/wucc_web/ws_aula02.php?tipo=MX&unid=${cod_uni}`,
            {
                method: "POST",
                body: JSON.stringify({ cod_uni }),
            }
        );

        const jsnx = await resx.json();

        let matimp = []

        if(res.ok) matimp = [...jsn]

        if(resx.ok) matimp = [...matimp, ...jsnx]

        importando_materias = false;

        if (res.ok) {
            filas_materias = matimp.length;
            await importar(matimp);
        } else {
            alert("Se produjo un error. Intente más tarde.");
        }
        
       
    }

    async function importar(filas) {
        display_importar_materias = "block";
        filas_procesadas=0;
        materias_improtadas=0;
        let i = 0;
        for (let fila of filas) {
            let res = await fetch("/api/publico/importar/materias", {
                method: "POST",
                body: JSON.stringify(fila),
            });
            let jsn = await res.json();
            if (res.ok) {
                materias_improtadas += jsn.importada;
                if (jsn.importada > 0) {
                    importados.push(fila);
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
                    <h2>Seleccionar Materia ({filtro.cod_uni})</h2>
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
                                    title="Actualizar Materias"
                                    on:click={actualizar_materias}
                                >
                                    <i class="fa fa-cloud-download w3-medium" />
                                </button>
                            </td>
                            <th>Materia</th>
                        </tr>
                        {#if !importando_materias}
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
                                        bind:value={filtro.cod_mat}
                                        style="width:100%"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        bind:value={filtro.nom_mat}
                                        style="width:100%"
                                    />
                                </td>
                            </tr>
                        {/if}
                    </thead>
                    <tbody>
                        {#if importando_materias}
                            <tr>
                                <td colspan="3">Importando materias . . .</td>
                            </tr>
                        {:else}
                            {#each materias as s}
                                <tr on:click={() => dispatch("elegida", s)}>
                                    <td width="18px" />
                                    <td>{s.cod_mat}</td>
                                    <td>{s.nom_mat}</td>
                                </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<div class="w3-modal" style="display: {display_importar_materias};">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div
                class="w3-section w3-xlarge w3-text-blue"
                style="font-weight: bold;"
            >
                Importando materias
            </div>
            <div class="w3-section">
                <div class="w3-center w3-large">
                    Procesando {filas_procesadas} de {filas_materias} <br />
                    <sapan class="w3-text-red"
                        >Materias importadas {materias_improtadas}</sapan
                    >
                </div>
            </div>
        </div>
        <div class="w3-padding w3-center" style="display:{display_continuar}">
            <button
                class="w3-btn w3-round w3-blue"
                on:click={() => {
                    display_importar_materias = "none";
                    display_continuar = "none";
                    materias_improtadas = 0;
                    filas_procesadas=0;
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
                                <th style="border-bottom: 1px solid black;">Código</th> 
                                <th style="border-bottom: 1px solid black;">Materia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each importados as i}
                                <tr>
                                    <td>{i.COD_MAT}</td>
                                    <td>{i.NOMB_MATE}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        {/if}
    </div>
</div>
