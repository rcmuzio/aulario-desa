<script>
    import { goto } from "$app/navigation";
    // import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { sre_usuario } from "$lib/stores";
    import tipo_actividades from "$lib/tipo_actividades";
    import Mensaje from "$lib/components/mensaje.svelte";
    import Confirmar from "$lib/components/borrar.svelte";
    import { apiFetch } from "$lib/client/api";

    export let data;

    let registro = data.reserva;
    let tipo_actividad = "";
    let displayMensaje = "none";
    let displayConfirmar = "none";
    let msg = [];

    let paramMensaje = {
        display: "",
        titulo: "Aviso",
        mensajes: [],
    };
    

    // onMount(async () => {
    //     const res = await fetch(`/api/reserva/${reserva_id}`, {
    //         method: "GET",
    //     });

    //     const jsn = await res.json();

    //     if (res.ok) {
    //         if (jsn.error) {
    //             alert("No se pudo recuperar la reserva solicitada."+reserva_id);
    //             goto("/app/reserva");
    //         } else {
    //             tipo_actividades.map((t) => {
    //                 if (t.codigo == jsn.datos.tipo_acti)
    //                     tipo_actividad = t.descri;
    //             });
    //             registro = jsn.datos;
    //         }
    //     }
    // });

    async function suspender() {
        msg = [];
        let xx = ["\n", "\t"];
        registro.suspendida_motivo = registro.suspendida_motivo.replace(
            /\r?\n|\r/g,
            " "
        );

        if (registro.suspendida_motivo.trim().length == 0) {
            paramMensaje.mensajes = ["Debe ingresar un motivo..."];
            paramMensaje.display = "block";
            return;
        }

        // const res = await fetch("/api/reserva/suspender", {
        //     method: "PUT",
        //     body: JSON.stringify({
        //         reserva_id,
        //         motivo: registro.suspendida_motivo,
        //         username: $sre_usuario.username,
        //     }),
        // });

        const res = await apiFetch({
            ruta: "/api/reserva/suspender",
            method: "PUT",
            token: false,
            body: {
                reserva_id: registro.id,
                motivo: registro.suspendida_motivo,
            },
        });

        const jsn = await res.json();

        if (res.ok) {
            if (!jsn.error && jsn.update.affectedRows  == 1) {
                goto("/app/reserva");
                return;
            }
        }

        paramMensaje.mensajes = ["No se pudo suspender la actividada."];
        paramMensaje.display = "block";
    }

    function confirmar() {
        msg =
            "Haga click en el botón Confirmar, para anular la suspención de la actividad seleccionada.";
        displayConfirmar = "block";
    }

    async function anular() {
        displayConfirmar = "none";

        // const res = await fetch("/api/reserva/suspender", {
        //     method: "DELETE",
        //     body: JSON.stringify({
        //         reserva_id:registro.id,
        //     }),
        // });

        const res = await apiFetch({
            ruta: "/api/reserva/suspender",
            method:"DELETE",
            token:false,
            body:{reserva_id:registro.id,}
        })

        const jsn = await res.json();

        if (res.ok) {
            if (!jsn.error && jsn.update.affectedRows == 1) {
                goto("/app/reserva");
                return;
            }
        }

        paramMensaje.mensajes = ["No se pudo ANULAR la suspención la actividada..."];
        paramMensaje.display = "block";
    }
</script>

<div class="w3-container">
    <div class="w3-display-container" style="height: 45px;">
        <div class="w3-display-toplef w3-text-orange">
            {#if registro.suspendida == 0}
                <h2>Suspender Actividad</h2>
            {:else}
                <h2>Actividad suspendida</h2>
            {/if}
        </div>
        <div class="w3-display-topright">
            <button class="w3-btn w3-red" on:click={() => goto("/app/reserva")}>
                <i class="fa fa-close w3-text-white" />
            </button>
        </div>
    </div>

    <div class="w3-small">
        {#if registro}
            <div class="w3-padding">
                <label for="tiempo">Fecha y horario:</label>
                <div class="w3-input w3-round w3-light-grey w3-center">
                    {registro.dia +
                        " " +
                        registro.num_dia +
                        " de " +
                        registro.nom_mes +
                        " de " +
                        registro.fecha.getFullYear() +
                        " de " +
                        registro.desde +
                        " a " +
                        registro.hasta}
                </div>
            </div>
            <div class="w3-row-padding">
                <div class="w3-half">
                    <label for="unidad">Unidad:</label><input
                        type="text"
                        name="unidad"
                        class="w3-input w3-round w3-light-grey"
                        readonly
                        bind:value={registro.unidad_academica}
                    />
                </div>

                <div class="w3-half">
                    <label for="carrera"> Carrera:</label>
                    <input
                        type="text"
                        name="carrera"
                        class="w3-input w3-round w3-light-grey"
                        readonly
                        bind:value={registro.carrera}
                    />
                </div>

                <div class="w3-half">
                    <label for="materia"> Materia:</label>
                    <input
                        type="text"
                        name="materia"
                        class="w3-input w3-round w3-light-grey"
                        readonly
                        bind:value={registro.materia}
                    />
                </div>

                <div class="w3-half">
                    <label for="docente"> Docente:</label>
                    <input
                        type="text"
                        name="docente"
                        class="w3-input w3-round w3-light-grey"
                        readonly
                        bind:value={registro.docente}
                    />
                </div>

                <div class="w3-quarter">
                    <label for="catedra">Curso:</label>
                    <input
                        type="text"
                        name="docente"
                        class="w3-input w3-round w3-light-grey"
                        readonly
                        bind:value={registro.curso}
                    />
                </div>

                <div class="w3-quarter">
                    <label for="catedra">Cátedras:</label>
                    <input
                        name="catedra"
                        type="text"
                        readonly
                        class="w3-input w3-light-grey w3-round"
                        maxlength="5"
                        bind:value={registro.catedra}
                    />
                </div>

                <div class="w3-quarter">
                    <label for="comision">Comisión:</label>
                    <input
                        name="comision"
                        type="text"
                        readonly
                        class="w3-input w3-light-grey w3-round"
                        bind:value={registro.comision}
                    />
                </div>

                <div class="w3-quarter">
                    <label for="tipo_actividad">Tipo de actividad:</label>
                    <input
                        type="text"
                        name="docente"
                        class="w3-input w3-round w3-light-grey"
                        readonly
                        bind:value={tipo_actividad}
                    />
                </div>

                <div class="w3-half">
                    <!-- <div class="w3-half"> -->
                    <label for="descri">Descripción:</label>
                    <textarea
                        type="text"
                        name="descri"
                        class="w3-input w3-round w3-light-grey"
                        readonly
                        bind:value={registro.descri}
                    />
                    <!-- </div> -->
                </div>
                <div class="w3-half">
                    <label for="motivo">Motivo de la suspensión:</label
                    ><textarea
                        type="text"
                        name="motivo"
                        class="w3-input w3-round w3-border"
                        maxlength="500"
                        bind:value={registro.suspendida_motivo}
                    />
                </div>
            </div>
            <hr />
            {#if registro.suspendida == 0}
                <div class="w3-padding">
                    <button
                        class="w3-block w3-btn w3-round w3-gray w3-text-white w3-margin-bottom w3-medium"
                        on:click={suspender}>Confirmar</button
                    >
                </div>
            {:else}
                <div class="w3-row-padding">
                    <div class="w3-half">
                        <button
                            class="w3-block w3-btn w3-round w3-gray w3-text-white w3-margin-bottom w3-medium"
                            on:click={suspender}>Modificar</button
                        >
                    </div>
                    <div class="w3-half">
                        <button
                            class="w3-block w3-btn w3-round w3-red w3-margin-bottom w3-medium"
                            on:click={confirmar}>Anular</button
                        >
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>

<Mensaje
    param={paramMensaje}
    on:continuar={() => (paramMensaje.display = "none")}
/>

<Confirmar
    display={displayConfirmar}
    mensaje={msg}
    on:cerrar={() => (displayConfirmar = "none")}
    on:confirmado={anular}
/>
