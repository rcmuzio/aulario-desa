<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import Sedes from "$lib/components/buscar/sedes.svelte";
    import Mensaje from "$lib/components/mensaje.svelte";
    import { apiFetch } from "$lib/client/api";

    /** @type {import('./$types').PageData} */
    export let data;

    let error = false;
    let error_mensaje = "";

    let FILA = {
        id: 0,
        sede_id: 0,
        sede: "",
        edificio: "",
        sis_usuario: "",
        sis_fecha: "",
    };

    let color = "blue";
    let readonly = false;
    let titulo_boton = "Grabar";
    let method = "POST";
    let displaySedes = "none";

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
            ruta: `/api/mantenimiento/edificios?id=${data.id}`,
            method: "GET",
            token: false,
            body: "",
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                error_mensaje = jsn.mensaje;
                error = true;
            } else {
                FILA = { ...jsn };
            }
        } else {
            alert("Se produjo un error inesperado.");
        }
    });

    async function procesar() {
        
        if (method != "DELETE") {
            let mm = [];

            if (FILA.sede.trim().length == 0)
                mm.push("Debe seleccionar una Sede.");
            if (FILA.edificio.trim().length == 0)
                mm.push("El nombre del Edificio no es válido.");

            if (mm.length > 0) {
                paramMensaje.mostrar("Aviso", mm);
                return;
            }
        }

        const res = await apiFetch({
            ruta: `/api/mantenimiento/edificios`,
            method,
            token: false,
            body: {
                id: FILA.id,
                sede_id: FILA.sede_id,
                nombre: FILA.edificio,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                paramMensaje.mostrar("Aviso", [jsn.mensaje]);
            } else {
                goto("/app/mantenimiento/edificios");
            }
        } else {
            alert("Se produjo un error inesperado.");
        }
    }

    function sede_elegida(event) {
        displaySedes = "none";
        FILA.sede_id = event.detail.id;
        FILA.sede = event.detail.nombre;
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
                    Edificio - <span
                        class="w3-text-{color}"
                        style="font-weight:bold">{data.accion}</span
                    >
                </h3>
            </div>
            <div class="w3-display-right">
                <a href="/app/mantenimiento/edificios">
                    <button class="w3-btn w3-red">
                        <i class="fa fa-close" />
                    </button>
                </a>
            </div>
        </div>

        <div class="w3-section">
            <div style="display:{data.accion == 'Borrar' ? 'block' : 'none'}">
                Ubicación:
            </div>

            <div
                class="w3-hover-text-orange pointer"
                title="Elegir una Sede..."
                on:keydown={() => (displaySedes = "block")}
                on:click={() => (displaySedes = "block")}
                style="display:{data.accion == 'Borrar' ? 'none' : 'block'}"
            >
                <i class="fa fa-search" />
                Ubicación:
            </div>
            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                readonly
                bind:value={FILA.sede}
            />
        </div>

        <div class="w3-section">
            <div>Edificio:</div>
            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                style="text-transform:uppercase"
                {readonly}
                bind:value={FILA.edificio}
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

    <Sedes
        display={displaySedes}
        on:cerrar={() => (displaySedes = "none")}
        on:elegido={sede_elegida}
    />

    <Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />
{/if}

<style>
    .pointer {
        cursor: pointer;
    }
</style>
