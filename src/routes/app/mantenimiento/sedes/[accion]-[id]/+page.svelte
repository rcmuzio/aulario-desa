<script>
    import { apiFetch } from "$lib/client/api";
    import { onMount } from "svelte";
    import Mensaje from "$lib/components/mensaje.svelte";
    import { goto } from "$app/navigation";

    export let data = { accion: "Agergar", id: 0 };

    let error = false;
    let error_mensaje = "";

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

    let FILA = {
        id: 0,
        nombre: "",
        descri: "",
    };

    onMount(async () => {
        const res = await apiFetch({
            ruta: `/api/mantenimiento/sedes?id=${data.id || 0}`,
            method: "GET",
            token: false,
            body: "",
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("JSN::::", jsn);
            if (jsn.error) {
                (error_mensaje = jsn.mensaje), (error = true);
            } else {
                FILA = { ...jsn.fila };
            }
        } else {
            alert("Se produjo un error inesperado...");
        }
    });

    async function procesar() {

        if (method != "DELETE") {
            let mm = [];
            if (FILA.nombre.trim().length == 0)
                mm.push("El Nombre no es válido.");

            if (mm.length > 0) {
                paramMensaje.mostrar("Aviso", mm);
                return;
            }
        }

        const res = await apiFetch({
            ruta: `/api/mantenimiento/sedes`,
            method,
            token: false,
            body: {
                id: FILA.id,
                nombre: FILA.nombre,
                descri: FILA.descri,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                paramMensaje.mostrar("Aviso", [jsn.mensaje]);
            } else {
                goto("/app/mantenimiento/sedes");
            }
        } else {
            alert("Se produjo un error inesperado.");
        }
    }
</script>

{#if error}
    <div class="w3-padding">
        <div class="w3-center w3-text-red">
            <h3>{error_mensaje}</h3>
        </div>
    </div>
{:else}<div class="w3-padding">
        <div class="w3-display-container" style="height: 50px;">
            <div class="w3-display-topleft">
                <h3>
                    Ubicación - <span
                        class="w3-text-{color}"
                        style="font-weight:bold">{data.accion}</span
                    >
                </h3>
            </div>
            <div class="w3-display-right">
                <a href="/app/mantenimiento/sedes">
                    <button class="w3-btn w3-red">
                        <i class="fa fa-close" />
                    </button>
                </a>
            </div>
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
            <div>Dirección:</div>
            <textarea
                class="w3-input w3-light-grey w3-round"
                style="text-transform:uppercase"
                {readonly}
                bind:value={FILA.descri}
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
{/if}

<Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />

<style>
    .pointer {
        cursor: pointer;
    }
</style>
