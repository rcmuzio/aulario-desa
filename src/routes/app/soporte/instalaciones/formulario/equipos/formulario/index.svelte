<script>
    import { createEventDispatcher } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import SelectEquipo from "$lib/components/buscar/equipos.svelte";

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

    let displaySelectEquipo = "none";

    async function grabar() {
        
        const res = await apiFetch({
            ruta: `/api/soporte/instalaciones/equipos`,
            method: params.accion,
            token: false,
            body: {
                id: registro.id,
                espacio_id: registro.espacio_id,
                equipo_id: registro.equipo_id,
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

    async function equipo_elegido(event) {
        const x = { ...event.detail };
        registro.equipo = x.nombre;
        registro.marca = x.marca;
        registro.modelo = x.modelo;
        registro.equipo_id = x.id;
        displaySelectEquipo = "none";
    }
</script>

<div class="w3-modal" style="display:{params.display}; z-index:2">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 45px;">
                <div class="w3-display-toplef w3-text-{params.color}">
                    <h2>Equipo instalado - {params.titulo}</h2>
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
            >
                <div
                    class="w3-section"
                >
                    <button style="border: none; background-color:transparent"
                    on:click={()=>displaySelectEquipo='block'}>
                        <i class="fa fa-search" />
                    </button>
                    
                    <label for="tipo">Equipo:</label>
                    <input
                        type="text"
                        name="tipo"
                        class="w3-input w3-round w3-light-grey w3-text-red"
                        bind:value={registro.equipo}
                        readonly
                    />
                </div>
               
                <div class="w3-section">
                    <label for="marca">Marca:</label>
                    <input
                        name="marca"
                        readonly
                        class="w3-input w3-round w3-light-grey w3-text-red"
                        bind:value={registro.marca}
                    />
                </div>
               
                <div class="w3-section">
                    <label for="modelo">Modelo:</label>
                    <input
                        name="modelo"
                        readonly
                        class="w3-input w3-round w3-light-grey w3-text-red"
                        bind:value={registro.modelo}
                    />
                </div>
<!--                
                <div class="w3-section">
                    <label for="descri">Descripción:</label>
                    <textarea
                        name="descri"
                        readonly
                        class="w3-input w3-round w3-light-grey w3-text-red"
                        bind:value={registro.descri}
                    />
                </div> -->
               
                <div class="w3-section">
                    <label for="stock">Cantidad:</label>
                    <input
                        name="stock"
                        maxlength="4"
                        class="w3-input w3-round w3-light-grey w3-text-red"
                        bind:value={registro.stock}
                        style="max-width: 100px;"
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

<SelectEquipo
    display={displaySelectEquipo}
    on:elegido={equipo_elegido}
    on:cerrar={() => (displaySelectEquipo = "none")}
/>
