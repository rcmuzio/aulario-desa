<script>
    import { createEventDispatcher } from "svelte";
    import { apiFetch } from "$lib/client/api";

    import Mensaje from "$lib/components/mensaje.svelte";
    import Ubicacion from "$lib/components/buscar/edificios.svelte";
    import SelectUnidad from "$lib/components/buscar/unidad.svelte";

    let error = false;
    let error_mensaje = "";

    export let FILA = {
        id: 0,
        sede_id: 0,
        sede: "",
        edificio_id: 0,
        edificio: "",
        cod_uni: "",
        unidad: "",
        planta: "",
        monitor: "",
        descri: "",
        sis_usuario: "",
        sis_fecha: "",
        sis_vigente: 0,
    };

    export let ACCION = "Agregar";

    const dispatch = createEventDispatcher();

    let color = "blue";
    let readonly = false;
    let titulo_boton = "Grabar";
    let method = "POST";

    let displayUbicacion = "none";
    let displayUnidad = "none";

    let plantas = [
        "SS",
        "PB",
        "P1",
        "P2",
        "P3",
        "P4",
        "P5",
        "P6",
        "P7",
        "P8",
        "P9",
        "P10",
        "P11",
        "P12",
        "P13",
        "P14",
        "15",
    ];

    let monitores = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
    ];

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
            ruta: `/api/mantenimiento/monitores`,
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
            //alert("Se produjo un error inesperado.");
        }
    }

    function ubicacion_elegida(event) {
        let x = { ...event.detail };
        displayUbicacion = "none";
        FILA.sede_id = x.sede_id;
        FILA.sede = x.sede;
        FILA.edificio_id = x.id;
        FILA.edificio = x.edificio;
    }

    function unidad_elegida(event) {
        let x = { ...event.detail };
        displayUnidad = "none";
        FILA.cod_uni = x.cod_uni;
        FILA.unidad = x.nomb_uni;
    }

    function validar() {
        let mm = [];
    
        if (FILA.sede.trim().length == 0 || FILA.edificio.trim().length == 0)
            mm.push("Debe seleccionar una ubicación (Sede y Edificio).");

        if (FILA.unidad.trim().length == 0)
            mm.push("Debe seleccionar una Unidad.");
            
        if (FILA.planta.trim().length == 0)
            mm.push("Debe seleccionar una planta.");

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
                    Monitor - <span
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
            <div style="display:{ACCION == 'Borrar' ? 'block' : 'none'}">
                Ubicación:
            </div>

            <div
                class="w3-hover-text-orange pointer"
                title="Elegir Ubicación..."
                on:keydown={() => (displayUbicacion = "block")}
                on:click={() => (displayUbicacion = "block")}
                style="display:{ACCION == 'Borrar' ? 'none' : 'block'}"
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
            <div style="display:{ACCION == 'Borrar' ? 'block' : 'none'}">
                Edificio:
            </div>

            <div
                class="w3-hover-text-orange pointer"
                title="Elegir un Edificio..."
                on:keydown={() => (displayUbicacion = "block")}
                on:click={() => (displayUbicacion = "block")}
                style="display:{ACCION == 'Borrar' ? 'none' : 'block'}"
            >
                <i class="fa fa-search" />
                Edificio:
            </div>

            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                readonly
                bind:value={FILA.edificio}
            />
        </div>

        <hr />

        <div class="w3-section">
            <div style="display:{ACCION == 'Borrar' ? 'block' : 'none'}">
                Unidad Académica/Gestión:
            </div>

            <div
                class="w3-hover-text-orange pointer"
                title="Elegir una Unidad..."
                on:keydown={() => (displayUnidad = "block")}
                on:click={() => (displayUnidad = "block")}
                style="display:{ACCION == 'Borrar' ? 'none' : 'block'}"
            >
                <i class="fa fa-search" />
                Unidad Académica/Gestión:
            </div>

            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                readonly
                bind:value={FILA.unidad}
            />
        </div>

        <div class="w3-section">
            <label for="planta">Planta:</label>
            <select
                name="planta"
                class="w3-input w3-border w3-round w3-light-grey"
                bind:value={FILA.planta}
                style="width:100px"
                disabled={readonly}
            >
                {#each plantas as p}
                    <option value={p}>{p}</option>
                {/each}
            </select>
        </div>

        <div class="w3-section">
            <label for="planta">Monitor:</label>
            <select
                name="monitor"
                class="w3-input w3-border w3-round w3-light-grey"
                bind:value={FILA.monitor}
                disabled={readonly}
                style="width:100px"
            >
                {#each monitores as m}
                    <option value={m}>{m}</option>
                {/each}
            </select>
        </div>

        <div class="w3-section">
            <label for="comentario">Descripción:</label>
            <textarea
                name="comentario"
                class="w3-input w3-border w3-round w3-light-grey"
                bind:value={FILA.descri}
                {readonly}
            />
        </div>

        <div class="w3-section">
            <input
                type="checkbox"
                disabled={readonly}
                bind:checked={FILA.sis_vigente}
            />
            Vigente
        </div>

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

    <Ubicacion
        display={displayUbicacion}
        on:cerrar={() => (displayUbicacion = "none")}
        on:elegido={ubicacion_elegida}
    />

    <SelectUnidad
        display={displayUnidad}
        on:cerrar={() => (displayUnidad = "none")}
        on:elegido={unidad_elegida}
    />

    <Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />
{/if}
