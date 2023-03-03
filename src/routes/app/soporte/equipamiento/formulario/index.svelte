<script>
    import { createEventDispatcher } from "svelte";
    import { apiFetch } from "$lib/client/api";

    import Mensaje from "$lib/components/mensaje.svelte";

    let error = false;
    let error_mensaje = "";

    export let FILA = {
        id: 0,
        nombre: "",
        marca: "",
        modelo: "",
        descri: "",
        sis_usuario: "",
        sis_fecha: "",
        sis_vigente: 0,
        sis_vigente_txt: "",
    };

    export let ACCION = "Agregar";

    const dispatch = createEventDispatcher();

    let color = "blue";
    let readonly = false;
    let titulo_boton = "Grabar";
    let method = "POST";

    const paramMensaje = {
        titulo: "",
        display: "",
        mensajes: [],
        mostrar: (t, m) => {
            paramMensaje.titulo = t;
            paramMensaje.mensajes = [...m];
            paramMensaje.display = "block";
        },
        ocultar: () => {
            paramMensaje.display = "none";
        },
    };

    switch (ACCION) {
        case "Editar":
            method = "PUT";
            color = "green";
            break;
        case "Borrar":
            method = "DELETE";
            color = "red";
            readonly = true;
            titulo_boton = "Click aquí para borrar el registro";
            break;
    }

    async function procesar() {
        if (method != "DELETE" && !validar()) return;

        const res = await apiFetch({
            ruta: `/api/soporte/equipos`,
            method,
            token: false,
            body: FILA,
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                paramMensaje.mostrar("Aviso", [jsn.mensaje]);
            } else {
                dispatch("actualizar");
            }
        } else {
            alert("Se produjo un error inesperado.");
        }
    }

    function validar() {
        let mm = [];

        if (FILA.nombre.trim().length == 0) mm.push("El Nombre no es válido.");

        if (mm.length > 0) {
            paramMensaje.mostrar("Aviso", mm);
        }

        return mm.length == 0;
    }
</script>

{#if error}
    <div class="w3-padding">
        <div class="w3-center w3-text-red">
            <h3>{error_mensaje}</h3>
        </div>
    </div>
{:else}
    <div style="padding: 40px;">
        <div class="w3-display-container" style="height: 50px;">
            <div class="w3-display-topleft">
                <h3>
                    Equipo - <span
                        class="w3-text-{color}"
                        style="font-weight:bold">{ACCION}</span
                    >
                </h3>
            </div>
            <div class="w3-display-right">
                <button
                    class="w3-btn w3-red"
                    on:click={() => dispatch("actualizar")}
                >
                    <i class="fa fa-close" />
                </button>
            </div>
        </div>

        <div class="w3-section">
            <label for="nombre">Nombre:</label>
            <input
                name="nombre"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.nombre}
                maxlength="100"
                style="text-transform: uppercase;"
                {readonly}
            />
        </div>

        <div class="w3-section">
            <label for="marca">Marca:</label>
            <input
                name="marca"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.marca}
                maxlength="50"
                style="text-transform: uppercase;"
                {readonly}
            />
        </div>

        <div class="w3-section">
            <label for="modelo">Modelo:</label>
            <input
                name="modelo"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.modelo}
                maxlength="50"
                style="text-transform: uppercase;"
                {readonly}
            />
        </div>

        <div class="w3-section">
            <label for="descri">Descripción:</label>
            <textarea
                name="descri"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.descri}
                maxlength="500"
                {readonly}
            />
        </div>

        {#if ACCION !== "Agregar"}
            <div class="w3-section">
                <input
                    type="checkbox"
                    disabled={readonly}
                    bind:checked={FILA.sis_vigente}
                />
                Vigente
            </div>
        {/if}

        <div class="w3-section">
            <button class="w3-btn w3-{color} w3-round" on:click={procesar}
                >{titulo_boton}</button
            >
        </div>

        {#if ACCION !== "Agregar"}
            <div class="w3-text-grey w3-tiny">
                Actualizado por {FILA.sis_usuario} el {FILA.sis_fecha}
            </div>
        {/if}
    </div>

    <Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />
{/if}
