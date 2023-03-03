<script>
    import { createEventDispatcher } from "svelte";
    // import Paginado from "$lib/componentes/aulario/paginado.svelte";
    import { goto } from "$app/navigation";
    import { sre_reserva_temp } from "$lib/stores";
    import { apiFetch } from "$lib/client/api";

    import Datatable from "$lib/datatable.svelte";

    const dispatch = createEventDispatcher();

    let display = "none";

    let espacios = [];

    let dias = [
        /* { valor: 0, descri: "D", checked: false }, */
        { valor: 1, descri: "L", checked: false },
        { valor: 2, descri: "M", checked: false },
        { valor: 3, descri: "M", checked: false },
        { valor: 4, descri: "J", checked: false },
        { valor: 5, descri: "V", checked: false },
        { valor: 6, descri: "S", checked: false },
    ];

    let fecfin = "";
    let fecini = "";
    let desde = "";
    let hasta = "";

    let paginado = { pagina: 1, registros: 0, rxp: 10, paginas: 0 };

    let filtro = {
        sede: "",
        edificio: "",
        unidad: "",
        tipo_espacio: "",
        espacio: "",
        planta: "",
        capacidad: "",
        capacidad_autorizada: "",
        climatizado: "",
        ventilado: "",
        disponible: "",
        sis_vigente: "",
    };

    let filtro_limpio = { ...filtro };

    
    let params = {
        on: false,
        paginado: {
            ok: true,
            pagina: 1,
            paginas: 1,
            rxp: 10,
            registros: 1,
        },
        action: "radio",
        widthcolbtns: "100px",
        btnh: [
            {
                class: "fa fa-plus w3-text-blue",
                action: "Agregar",
                title: "Agregar",
            },
        ],
        btnf: [
            {
                class: "fa fa-pencil w3-text-green",
                action: "Editar",
                title: "Editar",
            },
            {
                class: "fa fa-trash-o w3-text-red",
                action: "Borrar",
                title: "Borrar",
            },
        ],
        items: [
            {
                name: "sede",
                title: "Sede",
                filtro: "",
            },
            {
                name: "edificio",
                title: "Edificio",
                filtro: "",
            },
            {
                name: "unidad",
                title: "Unidad",
                filtro: "",
            },
            {
                name: "tipo_espacio",
                title: "Tipo de espacio",
                filtro: "",
            },
            {
                name: "espacio",
                title: "Espacio",
                filtro: "",
            },
            {
                name: "planta",
                title: "Planta",
                filtro: "",
            },
            {
                name: "capacidad",
                title: "Capacidad",
                filtro: "",
            },
            {
                name: "capacidad_autorizada",
                title: "Capacidad autorizada",
                filtro: "",
            },
        ],
        filas: [],
    };

    // $: if (
    //     filtro.sede.length > 0 ||
    //     filtro.edificio.length > 0 ||
    //     filtro.unidad.length > 0 ||
    //     filtro.tipo_espacio.length > 0 ||
    //     filtro.espacio.length > 0 ||
    //     filtro.planta.length > 0 ||
    //     filtro.capacidad.toString().length > 0 ||
    //     filtro.capacidad_autorizada.toString().length > 0 ||
    //     filtro.sis_vigente.toString().length > 0
    // )
    //     cargar();

    async function cargar() {
        let dd = desde + ":01";
        let hh = hasta + ":00";
        if (fecini == "" || fecfin == "" || fecfin < fecini) {
            alert("El rango de fechas no es válido.");
            return;
        }

        if (desde == "" || hasta == "" || hasta < desde) {
            alert("El rango horario no es válido.");
            return;
        }

        // const res = await fetch("/api/reserva/disponibles", {
        //     method: "POST",
        //     body: JSON.stringify({
        //         filtro,
        //         paginado,
        //         fecini,
        //         fecfin,
        //         desde: dd,
        //         hasta: hh,
        //         dias,
        //     }),
        // });

        const res = await apiFetch({
            ruta: "/api/reserva/disponibles",
            method: "POST",
            token: false,
            body: {
                items: params.items,
                paginado: params.paginado,
                fecini,
                fecfin,
                desde: dd,
                hasta: hh,
                dias,
            },
        });

        // if(res.ok){
        //     const jsn = await res.json();
        //     console.log('jsn:', jsn)
        // }else{
        //     console.log('ERROR')
        // }

        // const jsn = await res.json();

        // if (res.ok) {
        //     const jsn = await res.json();
        //     espacios = [...jsn.datos];
        //     paginado.registros = jsn.registros;
        //     paginado.paginas = jsn.paginas;
        //     display = "block";
        // } else {
        //     alert("NO RECUPERA CONSULTA ESPACIOS");
        // }

        if (res.ok) {
            const jsn = await res.json();
            params.on = false;
            params.filas = [...jsn.datos];
            params.paginado.registros = jsn.registros;
            params.paginado.paginas = jsn.paginas;
            params.paginado.pagina = jsn.pagina;
            display = "block";
        } else {
            alert("NO RECUPERA CONSULTA ESPACIOS");
        }
    }

    // async function paginado_primera(event) {
    //     paginado.pagina = 1;
    //     paginado = { ...paginado };
    //     await cargar();
    // }

    // async function paginado_anterior(event) {
    //     if (paginado.pagina > 1) {
    //         paginado.pagina = paginado.pagina - 1;
    //         paginado = { ...paginado };
    //         await cargar();
    //     }
    // }

    // async function paginado_proxima(event) {
    //     paginado.pagina = paginado.pagina + 1;
    //     paginado = { ...paginado };
    //     await cargar();
    // }

    // async function paginado_ultima(event) {
    //     paginado.pagina = paginado.paginas;
    //     paginado = { ...paginado };
    //     await cargar();
    // }

    // async function paginado_rxp(event) {
    //     paginado.rxp = event.detail.rxp;
    //     paginado = { ...paginado };
    //     await cargar();
    // }

    function elegido(event) {
        const s = {...event.detail}
        sre_reserva_temp.actualizar({
            espacio_id: s.id,
            sede: s.sede,
            edificio: s.edificio,
            unidad_propietaria: s.unidad,
            espacio: s.espacio,
            planta: s.planta,
            capacidad: s.capacidad,
            capacidad_autorizada: s.capacidad_autorizada,
            climatizado: s.climatizado,
            ventilado: s.ventilado,
            disponible: s.disponible,
            fecini,
            fecfin,
            desde,
            hasta,
            dias,
        });
        goto("/app/reserva/serie/Agregar-0");
    }
    
    // function elegido(event) {
    //     console.log("elegido:", event.detail);
    // }

    async function actualizar(event) {
        params = { ...event.detail.params };
        await cargar();
    } 
</script>

<div class="w3-container">
    <div class="w3-padding">
        <div class="w3-display-container" style="height: 45px;">
            <div class="w3-display-toplef">
                <h2>Espacios disponibles</h2>
            </div>
            <div class="w3-display-topright">
                <button
                    class="w3-btn w3-red"
                    on:click={() => goto("/app/reserva")}
                >
                    <i class="fa fa-close w3-text-white" />
                </button>
            </div>
        </div>
        <div class="w3-section">
            <h4>Rango de fechas y horas</h4>
            <div
                class="w3-row-padding"
                on:click={() => (display = "none")}
                on:keypress={() => (display = "none")}
            >
                <div class="w3-col l3 m3 s12">
                    <input
                        type="date"
                        class="w3-input w3-light-grey w3-round"
                        name="fecini"
                        id="fecini"
                        bind:value={fecini}
                    />
                </div>
                <div class="w3-col l3 m3 s12">
                    <input
                        type="date"
                        class="w3-input w3-light-grey w3-round"
                        name="fecfin"
                        id="fecfin"
                        bind:value={fecfin}
                    />
                </div>
                <div class="w3-col l2 m1 s12">
                    <input
                        type="time"
                        class="w3-input w3-light-grey w3-round"
                        name="desde"
                        id="desde"
                        bind:value={desde}
                    />
                </div>
                <div class="w3-col l2 m1 s12">
                    <input
                        type="time"
                        class="w3-input w3-light-grey w3-round"
                        name="hasta"
                        id="hasta"
                        bind:value={hasta}
                    />
                </div>
                <div class="w3-col l2 m3 s12">
                    <table class="w3-tiny">
                        <tr>
                            {#each dias as d}
                                <td align="center">{d.descri}</td>
                            {/each}
                        </tr>
                        <tr>
                            {#each dias as d}
                                <td
                                    ><input
                                        type="checkbox"
                                        bind:checked={d.checked}
                                    /></td
                                >
                            {/each}
                        </tr>
                    </table>
                </div>
            </div>
            <div
                class="w3-padding"
                style="display:{display == 'none' ? 'block' : 'none'};"
            >
                <button class="w3-btn w3-blue w3-round" on:click={cargar}
                    >Consultar</button
                >
            </div>
        </div>

        <!-- <div style="display:{display}">
            <h4>Espacios</h4>
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
                            <th>Sede</th>
                            <th>Edificio</th>
                            <th>Unidad</th>
                            <th>Tipo de espacio</th>
                            <th>Espacio</th>
                            <th>Planta</th>
                            <th>Capacidad</th>
                            <th>Capacidad Autorizada</th>
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
                                    bind:value={filtro.sede}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.edificio}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.unidad}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.tipo_espacio}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.espacio}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.planta}
                                    style="width:100%"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    bind:value={filtro.capacidad}
                                    style="width:100%"
                                />
                            </td>
                            <td
                                ><input
                                    type="text"
                                    style="width:100%"
                                    bind:value={filtro.capacidad_autorizada}
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {#each espacios as s}
                            <tr on:click={elegido(s)}>
                                <td width="18px" />
                                <td>{s.sede}</td>
                                <td>{s.edificio}</td>
                                <td>{s.unidad}</td>
                                <td>{s.tipo_espacio}</td>
                                <td>{s.espacio}</td>
                                <td>{s.planta}</td>
                                <td>{s.capacidad}</td>
                                <td>{s.capacidad_autorizada}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div> -->

        <div style="display:{display}">
            <!-- <Datatable
                {params}
                on:continuar={filas_seleccionadas}
                on:action={accion}
                on:elegido={elegido}
                on:actualizar={actualizar}
            /> -->
            <Datatable
                {params}
                on:elegido={elegido}
                on:actualizar={actualizar}
            />
        </div>
    </div>
</div>
