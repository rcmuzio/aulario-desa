<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import Mensaje from "$lib/components/mensaje.svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    let error = false;
    let error_mensaje = "";

    let FILA = {
        id: 0,
        tipo_espacio: "",
        sis_usuario: "",
        sis_fecha: "",
    };

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

    switch (data.accion) {
        case "Agregar":
            data.id = 0;
            break;
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

    onMount(async () => {
        console.log("onmount data.id:", data.id);
        const res = await apiFetch({
            ruta: `/api/mantenimiento/tipo_espacio?id=${data.id}`,
            method: "GET",
            token: false,
            body: "",
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("JSON==========", jsn);
            if (jsn.error) {
                error_mensaje = jsn.mensaje;
                error = true;
            } else {
                FILA = { ...jsn.fila };
            }
        } else {
            paramMensaje.mostrar("Aviso", ["Se produjo un error inesperado."]);
        }
    });

    async function procesar() {

        if (method != "DELETE") {
            let mm = [];

            if (FILA.tipo_espacio.trim().length == 0)
                mm.push("La Denominación no es válida.");

            if (mm.length > 0) {
                paramMensaje.mostrar("Aviso", mm);
                return;
            }
        }

        const res = await apiFetch({
            ruta: `/api/mantenimiento/tipo_espacio`,
            method,
            token: false,
            body: {
                id: FILA.id,
                tipo_espacio: FILA.tipo_espacio,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                paramMensaje.mostrar("Aviso", [jsn.mensaje]);
            } else {
                goto("/app/mantenimiento/tipo_espacio");
            }
        } else {
            alert("Se produjo un error inesperado.");
        }
    }

    function enviar() {}
</script>

{#if error}
    <div class="w3-padding">
        <div class="w3-center w3-text-red">
            <h3>{error_mensaje}</h3>
        </div>
    </div>
{:else}
    <div class="w3-padding">
        <div class="w3-display-container" style="height: 50px;">
            <div class="w3-display-topleft">
                <h3>
                    Tipo de espacio - <span
                        class="w3-text-{color}"
                        style="font-weight:bold">{data.accion}</span
                    >
                </h3>
            </div>
            <div class="w3-display-right">
                <a href="/app/mantenimiento/tipo_espacio">
                    <button class="w3-btn w3-red">
                        <i class="fa fa-close" />
                    </button>
                </a>
            </div>
        </div>

        <div class="w3-section">
            <div>Denominación:</div>
            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                style="text-transform:uppercase"
                {readonly}
                name="tipo_espacio"
                required
                bind:value={FILA.tipo_espacio}
            />
        </div>

        <div class="w3-section">
            <button class="w3-btn w3-{color} w3-round" on:click={procesar}
                >{titulo_boton}</button
            >
        </div>
        {#if data.accion !== "Agregar"}
            <div class="w3-text-grey w3-tiny">
                Actualizado por {FILA.sis_usuario} el {FILA.sis_fecha}
            </div>
        {/if}
    </div>

    <Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />
{/if}

<style>
    .pointer {
        cursor: pointer;
    }
</style>
