<script>
    import { createEventDispatcher, onMount } from "svelte";

    export let paginado = {
        pagina: 1,
        registros: 5,
        rxp: 5,
        paginas: 1,
    };

    function numero_pagina() {
        if (isNaN(paginado.pagina) || paginado.pagina < 1) paginado.pagina = 1;
        if (paginado.pagina > paginado.paginas)
            paginado.pagina = paginado.paginas;

        rxpag();
    }

    const dispatch = createEventDispatcher();

    let rxp = [5, 6, 7, 8, 9, 10, 20, 50, 100];

    onMount(() => {
        if (paginado.max_rxp) {
            rxp = [];
            for (let i = 5; i <= paginado.max_rxp; i++) {
                rxp.push(i);
            }
            rxp = [...rxp];
            paginado.rxp = 5;
        }
    });

    function proxima() {
        if (paginado.pagina < paginado.paginas) dispatch("proxima");
    }

    function anterior() {
        if (paginado.pagina > 1) dispatch("anterior");
    }

    function rxpag() {
        dispatch("rxpag", { rxp: paginado.rxp });
    }
</script>

<div class="w3-section">
    <div class="w3-hide-small ">
        <table
            class="w3-border w3-round w3-light-grey w3-small"
            style="margin-top: 10px;"
            align="center"
        >
            <tr>
                <td
                    ><div
                        class="w3-small"
                        style="padding-left:5px; white-space: nowrap; 
               overflow: hidden; width: 150px;
               text-overflow: ellipsis; 
               "
                    >
                        Registros por página:
                    </div></td
                >
                <td>
                    <select
                        class="w3-small w3-white"
                        style="width: 50px; border: 1px solid grey; height:24px; text-align:center"
                        bind:value={paginado.rxp}
                        on:change={rxpag}
                    >
                        {#each rxp as x}
                            <option value={x}>{x}</option>
                        {/each}
                    </select>
                </td>
                <td>
                    <button
                        style="border:none; background-color:transparent; cursor:pointer"
                        title="Primera página"
                        on:click={() => {
                            dispatch("primera");
                        }}
                    >
                        <i class="fa fa-backward" />
                    </button>
                </td>
                <td>
                    <button
                        style="border:none; background-color:transparent; cursor:pointer"
                        title="Página anterior"
                        on:click={anterior}
                    >
                        <i class="fa fa-caret-left" />
                    </button>
                </td>
                <td>
                    <input
                        type="text"
                        class="w3-small"
                        style="text-align: center; width:40px;"
                        on:change={numero_pagina}
                        bind:value={paginado.pagina}
                    />
                </td>
                <td>
                    <button
                        style="border:none; background-color:transparent; cursor:pointer"
                        title="Próxima página"
                        on:click={proxima}
                    >
                        <i class="fa fa-caret-right" />
                    </button>
                </td>
                <td>
                    <button
                        style="border:none; background-color:transparent; cursor:pointer"
                        title="Última página"
                        on:click={() => dispatch("ultima")}
                    >
                        <i class="fa fa-forward" />
                    </button>
                </td>
                <td
                    ><div
                        class="w3-small"
                        style="padding-left:5px; white-space: nowrap; 
           overflow: hidden; 
           text-overflow: ellipsis; 
           "
                    >
                        Total de registros:
                    </div></td
                >
                <td>
                    <input
                        type="text"
                        class="w3-small"
                        style="text-align: center; width:40px;"
                        readonly
                        bind:value={paginado.registros}
                    /></td
                >
                <td
                    ><div
                        class="w3-small"
                        style="white-space: nowrap; 
           overflow: hidden; width:130px;
           text-overflow: ellipsis; padding-left:5px
           "
                    >
                        Total de páginas:
                    </div></td
                >
                <td>
                    <input
                        type="text"
                        class="w3-small"
                        readonly
                        style="text-align: center; width:40px;"
                        bind:value={paginado.paginas}
                    />
                </td>
            </tr>
        </table>
    </div>
    <div class="w3-row w3-hide-medium w3-hide-large">
        <div class="w3-half">
            <table
                class="w3-border w3-round w3-light-grey w3-small"
                style="margin-top: 10px;"
                align="center"
            >
                <tr>
                    <td class="w3-small" style="padding-left:5px"
                        >Registros por página:</td
                    >
                    <td>
                        <select
                            class="w3-small w3-white"
                            style="width: 50px; border: 1px solid grey; height:24px; text-align:center"
                            bind:value={paginado.rxp}
                            on:change={rxpag}
                        >
                            {#each rxp as x}
                                <option value={x}>{x}</option>
                            {/each}
                        </select>
                    </td>
                    <td>
                        <button
                            style="border:none; background-color:transparent; cursor:pointer"
                            title="Primera página"
                            on:click={() => {
                                dispatch("primera");
                            }}
                        >
                            <i class="fa fa-backward" />
                        </button>
                    </td>
                    <td>
                        <button
                            style="border:none; background-color:transparent; cursor:pointer"
                            title="Página anterior"
                            on:click={anterior}
                        >
                            <i class="fa fa-caret-left" />
                        </button>
                    </td>
                    <td>
                        <input
                            type="text"
                            class="w3-small"
                            style="text-align: center; width:40px;"
                            bind:value={paginado.pagina}
                        />
                    </td>
                    <td>
                        <button
                            style="border:none; background-color:transparent; cursor:pointer"
                            title="Próxima página"
                            on:click={proxima}
                        >
                            <i class="fa fa-caret-right" />
                        </button>
                    </td>
                    <td>
                        <button
                            style="border:none; background-color:transparent; cursor:pointer"
                            title="Última página"
                            on:click={() => dispatch("ultima")}
                        >
                            <i class="fa fa-forward" />
                        </button>
                    </td>
                </tr>
            </table>
        </div>
        <div class="w3-half">
            <table
                class="w3-small w3-border w3-round w3-light-grey"
                style="margin-top: 10px;"
                align="center"
            >
                <tr>
                    <td style="padding-left:5px">Total de registros:</td>
                    <td>
                        <input
                            type="text"
                            class="w3-small"
                            style="text-align: center; width:40px;"
                            readonly
                            bind:value={paginado.registros}
                        /></td
                    >
                    <td>Total de páginas:</td>
                    <td>
                        <input
                            type="text"
                            class="w3-small"
                            readonly
                            style="text-align: center; width:40px;"
                            bind:value={paginado.paginas}
                        />
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>
