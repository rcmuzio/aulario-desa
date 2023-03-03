<script>
    import { createEventDispatcher } from "svelte";
    import { sre_usuario } from "$lib/stores";
    import SelectArticulo from "$lib/components/buscar/articulos.svelte";
    import Mensaje from "$lib/components/mensaje.svelte";

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

    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    let displayMensaje = "none";
    let mensaje = "";

    let displaySelectArticulo = "none";

    async function grabar() {

        const body = JSON.stringify({
            id: registro.id,
            espacio_id: registro.espacio_id,
            articulo_id: registro.articulo_id,
            stock: registro.stock,
            username: $sre_usuario.username
        });

        console.log(`BODY:${body}`); //return;
        console.log(`ACCION:${params.accion}`); //return;

        const res = await fetch(`/api/mantenimiento/espacios/articulos`, {
            method: params.accion,
            headers,
            body,
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log('RESPUESTA:',jsn)
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
        console.log(event.detail);
        const x = { ...event.detail };
        registro.articulo = x.nombre;
        registro.tipo = x.tipo;
        registro.articulo_id = x.id;
        displaySelectArticulo = "none";
    }
</script>

<div class="w3-modal" style="display:{params.display}">
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
            <div class="w3-padding" on:click={() => (displayMensaje = "none")}>
                <h3>Artículo instalado (espacio_id:{registro.espacio_id})</h3>
                <div
                    class="w3-section"
                    on:click={() => (displaySelectArticulo = "block")}
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
                >
                    <i class="fa fa-search" />
                    <label for="articulo"
                        >Artículo:</label
                    >
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

                <hr />
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
    on:salir={() => (displaySelectArticulo = "none")}
/>

<Mensaje
    {mensaje}
    display={displayMensaje}
    on:cerrar={()=>displayMensaje='none'}
/>