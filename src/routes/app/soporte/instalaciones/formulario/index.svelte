<script>
    import { createEventDispatcher } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import Mensaje from "$lib/components/mensaje.svelte";
    import Equipos from "./equipos/index.svelte";

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
</script>

<div style="padding: 40px;">
    <div class="w3-display-container w3-hide-small" style="height: 50px;">
        <div class="w3-display-topleft">
            <h3>
                Equipamiento instalado - <span
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

    <div
        class="w3-display-container w3-hide-medium w3-hide-large"
        style="height: 100px;"
    >
        <div class="w3-display-topleft">
            <button
                class="w3-btn w3-red"
                on:click={() => dispatch("actualizar")}
            >
                <i class="fa fa-close" />
            </button>
        </div>

        <div class="w3-display-bottomleft" style="height: 50px;">
            <h3>
                Equipamiento instalado - <span
                    class="w3-text-{color}"
                    style="font-weight:bold">{ACCION}</span
                >
            </h3>
        </div>
    </div>

    <div class="w3-row-padding">
        <div class="w3-half pdgt">
            <label for="sede">Ubicación:</label>
            <input
                type="text"
                name="sede"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.sede}
                readonly
            />
        </div>
        <div class="w3-half pdgt">
            <label for="edificio">Edificio:</label>
            <input
                name="edificio"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.edificio}
                readonly
            />
        </div>

        <div class="w3-half pdgt">
            <label for="cod_uni">Unidad Académica/Gestión:</label>
            <input
                type="text"
                name="cod_uni"
                readonly
                bind:value={FILA.unidad}
                class="w3-input w3-round w3-light-grey"
            />
        </div>
        <div class="w3-half pdgt">
            <label for="tipo_espacio">Tipo de espacio:</label>
            <input
                name="tipo_espacio"
                type="text"
                readonly
                bind:value={FILA.tipo_espacio}
                class="w3-input w3-round w3-light-grey"
            />
        </div>

        <div class="w3-half pdgt">
            <label for="espacio">Nombre de espacio:</label>
            <input
                name="espacio"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.espacio}
                readonly
            />
        </div>
        <div class="w3-half pdgt">
            <label for="planta">Planta:</label>
            <input
                name="planta"
                class="w3-input w3-round w3-light-grey"
                bind:value={FILA.planta}
                readonly
            />
        </div>
    </div>

    <div class="w3-padding">
        <input type="checkbox" disabled bind:checked={FILA.sis_vigente} />
        Vigente
    </div>

    <div class="w3-padding">
        <Equipos espacio_id={FILA.id} />
    </div>

    <!-- {#if ACCION !== "Agregar"}
        <div class="w3-padding w3-text-grey w3-tiny">
            Actualizado por {FILA.sis_usuario} el {FILA.sis_fecha}
        </div>
    {/if} -->
</div>

<Mensaje param={paramMensaje} on:continuar={() => paramMensaje.ocultar()} />
