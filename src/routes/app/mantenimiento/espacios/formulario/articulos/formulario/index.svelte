<script>
    import { createEventDispatcher } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import SelectArticulo from "$lib/components/buscar/articulos.svelte";

    export let registro = {};
    export let params = {
        display: "none",
        accion: "POST",
        color: "blue",
        titulo: "Agregar",
        boton_titulo: "Grabar",
        readonly: false,
    };

    const dispatch = createEventDispatcher();

    let displayMensaje = "none";
    let mensaje = "";

    let displaySelectArticulo = "none";

    async function grabar() {
        
        const res = await apiFetch({
            ruta: `/api/mantenimiento/espacios/articulos`,
            method: params.accion,
            token: false,
            body: {
                id: registro.id,
                espacio_id: registro.espacio_id,
                articulo_id: registro.articulo_id,
                stock: registro.stock,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                mensaje = jsn.mensaje;
                displayMensaje = "block";
            } else {
                dispatch("actualizar");
            }
        } else {
            mensaje =
                "Se produjo un error inesperado. Intente nuevamente más tarde.";
            displayMensaje = "block";
        }
    }

    async function articulo_elegido(event) {
        const x = { ...event.detail };
        registro.articulo = x.nombre;
        registro.tipo = x.tipo;
        registro.articulo_id = x.id;
        displaySelectArticulo = "none";
    }
</script>

<div class="w3-modal" style="display:{params.display}; z-index:2">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 45px;">
                <div class="w3-display-toplef w3-text-{params.color}">
                    <h2>Artículos - {params.titulo}</h2>
                </div>
                <div class="w3-display-topright">
                    <button
                        class="w3-btn w3-red"
                        on:click={() => {
                            displayMensaje = "none";
                            dispatch("salir");
                        }}
                    >
                        <i class="fa fa-close w3-text-white" />
                    </button>
                </div>
            </div>
            <hr />
            <div
                class="w3-padding w3-border-bottom"
                on:click={() => (displayMensaje = "none")}
                on:keydown={()=> console.log('')}
            >
                <h3>Artículo instalado</h3>
                <div
                    class="w3-section"
                    on:click={() => (displaySelectArticulo = "block")}
                    on:keydown={()=> console.log('')}
                >
                    <i class="fa fa-search" />
                    <label for="tipo">Tipo:</label>
                    <input
                        type="text"
                        name="tipo"
                        class="w3-input w3-border w3-round w3-light-grey w3-text-red"
                        bind:value={registro.tipo}
                        readonly
                    />
                </div>
                <div
                    class="w3-section"
                    on:click={() => (displaySelectArticulo = "block")}
                    on:keydown={()=> console.log('')}
                >
                    <i class="fa fa-search" />
                    <label for="articulo">Artículo:</label>
                    <input
                        name="articulo"
                        class="w3-input w3-border w3-round w3-light-grey w3-text-red"
                        bind:value={registro.articulo}
                        readonly
                    />
                </div>
                <div class="w3-section">
                    <label for="articulo">Stock:</label>
                    <input
                        name="stock"
                        class="w3-input w3-border w3-round w3-light-grey w3-text-red"
                        bind:value={registro.stock}
                    />
                </div>
            </div>

            <div
                class="w3-section w3-center w3-text-red"
                style="display: {displayMensaje}; font-weight:bold; letter-spacing:1px ;"
            >
                {mensaje}
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-{params.color} w3-round"
                    on:click={grabar}>{params.boton_titulo}</button
                >
            </div>
        </div>
    </div>
</div>

<SelectArticulo
    display={displaySelectArticulo}
    on:elegido={articulo_elegido}
    on:cerrar={() => (displaySelectArticulo = "none")}
/>
