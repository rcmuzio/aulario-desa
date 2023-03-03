<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let params = {
        on: false,
        paginado: {
            ok: true,
            pagina: 100,
            paginas: 1,
            rxp: 10,
            registros: 10,
        },
        action: "radio",
        widthcolbtns: "90px",
        btnh: [
            {
                class: "fa fa-plus w3-text-blue",
                action: "agregar",
                title: "Agregar",
            },
        ],
        btnf: [
            {
                class: "fa fa-pencil w3-text-green",
                action: "editar",
                title: "Editar",
            },
            {
                class: "fa fa-trash-o w3-text-red",
                action: "borrar",
                title: "Borrar",
            },
        ],
        items: [
            {
                name: "apellido",
                title: "Apellido",
                filtro: "",
            },
            {
                name: "nombre",
                title: "Nombre",
                filtro: "",
            },
        ],
        filas: [
            { apellido: "MUZIO", nombre: "RICARDO CÉSAR" },
            { apellido: "DOMINGUEZ", nombre: "LAURA SABINA" },
            { apellido: "MUZIO", nombre: "PABLO ALEJANDRO" },
            { apellido: "MUZIO", nombre: "CÉSAR ADRIÁN" },
            { apellido: "MUZIO", nombre: "SABRINA SOFÍA" },
        ],
    };

    let displayFiltro = "none";

    let elegido = {};
    let check = false;
    let rxps = [2, 5, 10, 25, 50, 100];
    let btns = 2;

    let btn_borrar_filtro_display = "none";

    if (params.btnh.length > btns) btns = params.btnh.length;
    if (params.btnf.length > btns) btns = params.btnf.length;

    if (params.action == "checkbox") {
        params.filas.map((f) => {
            f.checked = false;
            return f;
        });
        params.filas = [...params.filas];
    }

    $: {
        if (
            params.paginado.pagina > 0 &&
            params.paginado.pagina <= params.paginado.paginas
        ) {
        } else {
            params.paginado.pagina = 1;
        }
        if (params.on) {
            params.on = false;
            dispatch("actualizar", { params });
        } else {
            params.on = true;
        }
    }

    $: {
        let e = { ...elegido };
        elegido = {};
        dispatch("elegido", e);
    }

    $: {
        btn_borrar_filtro_display = "none";
        params.items.map((i) => {
            if (i.filtro.trim().length > 0) btn_borrar_filtro_display = "block";
        });
    }

    function limpiar_filtro() {
        btn_borrar_filtro_display = "none";
        params.items.map((i) => {
            i.filtro = "";
            return i;
        });
        displayFiltro = "none";
        params.items = [...params.items];
    }

    function actions(action, fila) {
        dispatch("action", { action, fila });
    }

    function marcar() {
        params.filas.map((f) => {
            f.checked = !check;
            return f;
        });
        params.paginado.pagina = 1;
        params.filas = [...params.filas];
    }

    function elige(f) {
        if (params.action == "radio") {
            console.log("eligió:", f);
        }
    }
</script>

{#if params.paginado.ok}
    <div class="w3-section w3-hide-small">
        <div class="w3-small">
            Registros por página:
            <select
                style="font-size:11px"
                bind:value={params.paginado.rxp}
                on:change={() => (params.paginado.pagina = 1)}
            >
                {#each rxps as r}
                    <option value={r}>{r}</option>
                {/each}
            </select>
            <span style="margin-left: 10px;"
                >Total de registros: {params.paginado.registros}</span
            >
        </div>
        <div class="w3-small">
            Página:
            <button
                on:click={() => {
                    params.paginado.pagina = 1;
                }}
            >
                <i class="fa fa-angle-double-left" />
            </button>
            <button
                on:click={() => {
                    if (params.paginado.pagina > 1) params.paginado.pagina--;
                }}
            >
                <i class="fa fa-angle-left" />
            </button>
            <input
                type="number"
                min="1"
                max={params.paginado.paginas}
                style="border: none; text-align:center; width: 30px; font-size: 11px; margin-right:10px"
                bind:value={params.paginado.pagina}
                on:change={() => {
                    if (
                        isNaN(parseInt(params.paginado.pagina)) ||
                        params.paginado.pagina < 0 ||
                        params.paginado.pagina > params.paginado.paginas
                    )
                        params.paginado.pagina = 1;
                }}
            />
            <button
                on:click={() => {
                    if (params.paginado.pagina < params.paginado.paginas)
                        params.paginado.pagina++;
                }}
            >
                <i class="fa fa-angle-right" />
            </button>
            <button
                on:click={() => {
                    params.paginado.pagina = params.paginado.paginas;
                }}
            >
                <i class="fa fa-angle-double-right" />
            </button>
            Total de páginas: {params.paginado.paginas}
        </div>
    </div>
{/if}

<div class="w3-responsive w3-hide-small">
    <table class="w3-table-all w3-small">
        <thead>
            <tr
                ><td style="width: {params.widthcolbtns};">
                    {#if params.action == "checkbox"}
                        <input
                            type="checkbox"
                            name=""
                            id=""
                            style="margin-left:4px"
                            bind:checked={check}
                            on:click={marcar}
                        />
                    {/if}

                    {#if params.action == "crud"}
                        {#each params.btnh as b}
                            <button
                                title={b.title}
                                on:click={() => actions(b.action, { id: 0 })}
                            >
                                <i class={b.class} />
                            </button>
                        {/each}
                    {/if}
                </td>
                {#each params.items as i}
                    <th style="">
                        {i.title}
                    </th>
                {/each}
            </tr>
            <tr>
                <td>
                    <button title="Limpiar filtros" on:click={limpiar_filtro}>
                        <i class="fa fa-trash-o" />
                    </button>
                </td>
                {#each params.items as item}
                    <td>
                        <input
                            type="text"
                            bind:value={item.filtro}
                            on:change={() => (params.paginado.pagina = 1)}
                            style="width:100%"
                        />
                    </td>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each params.filas as f}
                <tr
                    ><td>
                        {#if params.action == "checkbox"}
                            <input
                                type="checkbox"
                                bind:checked={f.checked}
                                style="margin-left:4px"
                            />
                        {/if}

                        {#if params.action == "radio"}
                            <input
                                type="radio"
                                name="radio"
                                id="radio"
                                style="margin-left:4px"
                                bind:group={elegido}
                                value={f}
                            />
                        {/if}

                        {#if params.action == "crud"}
                            {#each params.btnf as b}
                                <button
                                    title={b.title}
                                    on:click={() => actions(b.action, f)}
                                >
                                    <i class={b.class} />
                                </button>
                            {/each}
                        {/if}
                    </td>
                    {#each params.items as i}
                        <td class="">{f[i.name]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<div class="sticky w3-hide-medium w3-hide-large">
    <button on:click={() => (displayFiltro = "block")}>
        <i
            class="fa fa-filter w3-text-grey w3-xlarge w3-hover-text-black"
            style="cursor: pointer"
            title="Aplicar / Quitar Filtro"
        />
    </button>
    <button
        on:click={limpiar_filtro}
        style="display: {btn_borrar_filtro_display};"
    >
        <i
            class="fa fa-trash w3-text-orange w3-xlarge w3-hover-text-red"
            style="cursor: pointer"
            title="Quitar Filtro"
        />
    </button>
</div>

<div class="w3-responsive  w3-small w3-hide-medium w3-hide-large">
    {#each params.filas as f}
        <div class="w3-padding w3-margin">
            {#if params.action == "crud"}
                {#each params.btnh as b}
                    <button
                        title={b.title}
                        on:click={() => actions(b.action, { id: 0 })}
                    >
                        <i class={b.class} />
                    </button>
                {/each}
            {/if}
            {#if params.action == "crud"}
                {#each params.btnf as b}
                    <button
                        title={b.title}
                        on:click={() => actions(b.action, f)}
                    >
                        <i class={b.class} />
                    </button>
                {/each}
            {/if}
            <table class="w3-table-all">
                {#each params.items as i}
                    <tr>
                        <td style="width:20%;">
                            {i.title}
                        </td>
                        <td>
                            <b>{f[i.name]}</b>
                        </td>
                    </tr>
                {/each}
            </table>
        </div>
    {:else}
        <div class="w3-center w3-text-grey w3-large">No se encontraron registros</div>
    {/each}
</div>

<div class="w3-hide-medium w3-hide-large">
    <div class="w3-modal" style="display: {displayFiltro} ;">
        <div class="w3-modal-content w3-round">
            <div class="w3-display-container" style="height:50px">
                <div class="w3-display-left">
                    <button
                        on:click={limpiar_filtro}
                        style="margin-left:12px"
                        title="Quitar filtro"
                    >
                        <i class="fa fa-trash-o w3-text-red w3-xlarge" />
                    </button>
                </div>
                <div class="w3-display-right">
                    <button on:click={() => (displayFiltro = "none")}>
                        <i class="fa fa-close w3-btn w3-red " />
                    </button>
                </div>
            </div>
            <div class="w3-padding">
                <table class="w3-table-all">
                    {#each params.items as i}
                        <tr>
                            <td style="">
                                {i.title}
                            </td>
                            <td>
                                <input
                                    type="text"
                                    style="width: 100%; border: 1px solid lightgrey"
                                    bind:value={i.filtro}
                                />
                            </td>
                        </tr>
                    {/each}
                </table>
            </div>
        </div>
    </div>
</div>

{#if params.action == "checkbox"}
    <div class="w3-section">
        <button
            class="w3-btn w3-round w3-blue"
            on:click={() => dispatch("continuar", { params })}>Continuar</button
        >
    </div>
{/if}

<style>
    button {
        margin-right: 10px;
        cursor: pointer;
        border: none;
        background-color: transparent;
        font-size: 16px;
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
    }

    div.sticky {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        padding: 5px;
        /* background-color: #cae8ca;
        border: 2px solid #4caf50; */
    }
</style>
