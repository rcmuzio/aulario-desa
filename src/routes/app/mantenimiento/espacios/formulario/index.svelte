<script>
    // import { goto } from "$app/navigation";
    import { createEventDispatcher } from "svelte";
    import { apiFetch } from "$lib/client/api";
    // import Sedes from "$lib/components/buscar/sedes.svelte";
    import Mensaje from "$lib/components/mensaje.svelte";
    import Ubicacion from "$lib/components/buscar/edificios.svelte";
    import SelectUnidad from "$lib/components/buscar/unidad.svelte";
    import SelectTipoEspacio from "$lib/components/buscar/tipo_espacio.svelte";
    import Articulos from "./articulos/index.svelte";
    import Fotos from "./fotos/index.svelte";

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
        tipo_espacio_id: 0,
        tipo_espacio: "",
        espacio: "",
        planta: "",
        superficie: 0,
        capacidad: 0,
        capacidad_autorizada: 0,
        ventilado: 0,
        climatizado: 0,
        disponible: 0,
        tipo_reservable: 0,
        verificado: 0,
        equipos: 0,
        espacio_reserva: 0,
        comentario: "",
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
    let displayTipoEspacio = "none";

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

    // onMount(async () => {
    //     const res = await apiFetch({
    //         ruta: `/api/mantenimiento/espacios?id=${data.id}`,
    //         method: "GET",
    //         token: false,
    //         body: "",
    //     });

    //     if (res.ok) {
    //         const jsn = await res.json();
    //         if (jsn.error) {
    //             error_mensaje = jsn.mensaje;
    //             error = true;
    //         } else {
    //             if (ACCION != "Agregar") {
    //                 if (!jsn) {
    //                     alert("No se encontró el registro.");
    //                     goto("/app/mantenimiento/espacios");
    //                 } else {
    //                     FILA = { ...jsn };
    //                 }
    //             }
    //         }
    //     } else {
    //         alert("Se produjo un error inesperado.");
    //     }
    // });

    async function procesar() {
        if (method != "DELETE" && !validar()) return;

        // console.log('BODY:', FILA); return;

        const res = await apiFetch({
            ruta: `/api/mantenimiento/espacios`,
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

    function tipo_espacio_elegido(event) {
        let x = { ...event.detail };
        displayTipoEspacio = "none";
        FILA.tipo_espacio_id = x.id;
        FILA.tipo_espacio = x.tipo_espacio;
    }

    function validar() {
        let mm = [];

        if (FILA.sede.trim().length == 0 || FILA.edificio.trim().length == 0)
            mm.push("Debe seleccionar una ubicación (Sede y Edificio).");

        if (FILA.unidad.trim().length == 0)
            mm.push("Debe seleccionar una Unidad.");
        if (FILA.tipo_espacio.trim().length == 0)
            mm.push("Debe seleccionar un Tipo de Espacio.");
        if (FILA.espacio.trim().length == 0)
            mm.push("El Nombre del Espacio no es válido.");
        if (FILA.planta.trim().length == 0)
            mm.push(
                "Debe indicar en qué Planta (SS, PB, P1, P2, etc.) se encuentra el Espacio. "
            );
        if (FILA.capacidad.toString().trim().length == 0)
            mm.push("Capacidad deber ser un número >= 0.");
        if (FILA.capacidad_autorizada.toString().trim().length == 0)
            mm.push("Capacidad Autorizada deber ser un número >= 0.");

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
                    Espacio - <span
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
                title="Elegir una Sede..."
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
                Unidad Académica/Gestión (predeterminada):
            </div>

            <div
                class="w3-hover-text-orange pointer"
                title="Elegir una Unidad..."
                on:keydown={() => (displayUnidad = "block")}
                on:click={() => (displayUnidad = "block")}
                style="display:{ACCION == 'Borrar' ? 'none' : 'block'}"
            >
                <i class="fa fa-search" />
                Unidad Académica/Gestión (predeterminada):
            </div>

            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                readonly
                bind:value={FILA.unidad}
            />
        </div>

        <div class="w3-section">
            <div style="display:{ACCION == 'Borrar' ? 'block' : 'none'}">
                Tipo de espacio:
            </div>

            <div
                class="w3-hover-text-orange pointer"
                title="Elegir una Unidad..."
                on:keydown={() => (displayTipoEspacio = "block")}
                on:click={() => (displayTipoEspacio = "block")}
                style="display:{ACCION == 'Borrar' ? 'none' : 'block'}"
            >
                <i class="fa fa-search" />
                Tipo de espacio:
            </div>

            <input
                type="text"
                class="w3-input w3-light-grey w3-round"
                readonly
                bind:value={FILA.tipo_espacio}
            />
        </div>

        <div class="w3-section">
            <label for="espacio">Nombre de espacio:</label>
            <input
                name="espacio"
                class="w3-input w3-border w3-round w3-light-grey"
                bind:value={FILA.espacio}
                {readonly}
            />
        </div>

        <div class="w3-section">
            <label for="planta">Planta:</label>
            <input
                name="planta"
                class="w3-input w3-border w3-round w3-light-grey"
                style="width:100px"
                bind:value={FILA.planta}
                {readonly}
            />
        </div>
        <div class="w3-section">
            <label for="superficie">superficie:</label>
            <input
                name="superficie"
                class="w3-input w3-border w3-round w3-light-grey"
                style="width:100px"
                bind:value={FILA.superficie}
                {readonly}
            />
        </div>
        <div class="w3-section">
            <label for="capacidad">Capacidad:</label>
            <input
                name="capacidad"
                class="w3-input w3-border w3-round w3-light-grey"
                style="width:100px"
                bind:value={FILA.capacidad}
                {readonly}
            />
        </div>
        <div class="w3-section">
            <label for="capacidad_autorizada">Capacidad autorizada:</label>
            <input
                name="capacidad_autorizada"
                class="w3-input w3-border w3-round w3-light-grey"
                style="width:100px"
                bind:value={FILA.capacidad_autorizada}
                {readonly}
            />
        </div>
        <div class="w3-section">
            <input
                type="checkbox"
                disabled={readonly}
                bind:checked={FILA.climatizado}
            />
            Climatizado
        </div>
        <div class="w3-section">
            <input
                type="checkbox"
                disabled={readonly}
                bind:checked={FILA.ventilado}
            />
            Ventilado
        </div>
        <div class="w3-section">
            <input
                type="checkbox"
                disabled={readonly}
                bind:checked={FILA.disponible}
            />
            Disponible
        </div>
        <div class="w3-section">
            <input
                type="checkbox"
                disabled={readonly}
                bind:checked={FILA.espacio_reserva}
            />
            Se puede reservar
        </div>
        <div class="w3-section">
            <label for="comentario">Comentario:</label>
            <textarea
                name="comentario"
                class="w3-input w3-border w3-round w3-light-grey"
                bind:value={FILA.comentario}
                {readonly}
            />
        </div>

        {#if ACCION != "Agregar"}
            <div class="w3-section">
                <Articulos espacio_id={FILA.id} />
            </div>

            <div class="w3-section">
                Fotos:
                <Fotos id={FILA.id} />
            </div>
        {/if}

        <div class="w3-section">
            <input
                type="checkbox"
                disabled={readonly}
                bind:checked={FILA.sis_vigente}
            />
            Vigente
        </div>
        <div class="w3-section">
            <input
                type="checkbox"
                disabled={readonly}
                bind:checked={FILA.verificado}
            />
            Verificado
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

    <SelectTipoEspacio
        display={displayTipoEspacio}
        on:cerrar={() => (displayTipoEspacio = "none")}
        on:elegido={tipo_espacio_elegido}
    />

    <Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />
{/if}
