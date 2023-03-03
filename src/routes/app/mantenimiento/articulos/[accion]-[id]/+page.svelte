<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { apiFetch } from "$lib/client/api";
    import Tipos from "$lib/components/buscar/tipo_articulo.svelte";
    import Mensaje from "$lib/components/mensaje.svelte";

    /** @type {import('./$types').PageData} */
    export let data = { accion: "", id: "0" };

    let error = false;
    let error_mensaje = "";

    let FILA = {
        id: 0,
        tipo_id: 0,
        tipo: "",
        nombre: "",
    };

    let color = "blue";
    let readonly = false;
    let titulo_boton = "Grabar";
    let method = "POST";
    let displayTipos = "none";

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
        const res = await apiFetch({
            ruta: `/api/mantenimiento/articulos?id=${data.id}`,
            method: "GET",
            token: false,
            body: "",
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                error_mensaje = jsn.mensaje;
                error = jsn.error;
            } else {
                FILA = { ...jsn.fila };
            }
        } else {
            alert("Se produjo un error inesperado.");
        }
    });

    async function procesar() {

        if (method != "DELETE") {
            let mm = [];

            if (FILA.tipo.trim().length == 0)
                mm.push("Debe seleccionar un Tipo de Artículo.");
            if (FILA.nombre.trim().length == 0)
                mm.push("El Nombre no es válido.");

            if (mm.length > 0) {
                paramMensaje.mostrar("Aviso", mm);
                return;
            }
        }

        const res = await apiFetch({
            ruta: `/api/mantenimiento/articulos`,
            method,
            token: false,
            body: {
                id: FILA.id,
                tipo_id: FILA.tipo_id,
                nombre: FILA.nombre,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                paramMensaje.mostrar("Aviso", [jsn.mensaje]);
            } else {
                goto("/app/mantenimiento/articulos");
            }
        } else {
            alert("Se produjo un error inesperado.");
        }
    }

    function tipo_elegida(event) {
        displayTipos = "none";
        FILA.tipo_id = event.detail.id;
        FILA.tipo = event.detail.nombre;
    }
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
                    Artículo - <span
                        class="w3-text-{color}"
                        style="font-weight:bold">{data.accion}</span
                    >
                </h3>
            </div>
            <div class="w3-display-right">
                <a href="/app/mantenimiento/articulos">
                    <button class="w3-btn w3-red">
                        <i class="fa fa-close" />
                    </button>
                </a>
            </div>
        </div>

        <div class="w3-section">
            <div style="display:{data.accion == 'Borrar' ? 'block' : 'none'}">
                Tipo de artículo:
            </div>

            <div
                class="w3-hover-text-orange pointer"
                title="Elegir un tipo de artículo..."
                on:keydown={() => (displayTipos = "block")}
                on:click={() => (displayTipos = "block")}
                style="display:{data.accion == 'Borrar' ? 'none' : 'block'}"
            >
                <i class="fa fa-search" />
                Tipo de artículo:
            </div>
            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                readonly
                bind:value={FILA.tipo}
            />
        </div>

        <div class="w3-section">
            <div>Nombre:</div>
            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                style="text-transform:uppercase"
                {readonly}
                bind:value={FILA.nombre}
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

    <Tipos
        display={displayTipos}
        on:cerrar={() => (displayTipos = "none")}
        on:elegido={tipo_elegida}
    />

    <Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />
{/if}

<style>
    .pointer {
        cursor: pointer;
    }
</style>
