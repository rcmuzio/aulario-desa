<script>
    import { goto } from "$app/navigation";
    import { apiFetch } from "$lib/client/api";
    import { sre_usuario } from "$lib/stores";
    import { createEventDispatcher } from "svelte";
    import Mensajes from "./mensajes.svelte";

    import ConfirmarBorrar from "$lib/components/borrar.svelte";

    export let display = "none";
    export let reserva_id = 0;
    export let fecha = "";
    export let desde;
    export let hasta;
    export let repeticion = false;

    const dispatch = createEventDispatcher();

    let disponibles = [];

    let mensajes = [];

    let displayConfirmar = "none";
    let displayMensajes = "none";
    let displayConfirmarBorrar = "none";
    let mensajeConfirmarBorrar = "";

    let filtro = {
        sede: "",
        edificio: "",
        unidad: "",
        espacio: "",
        planta: "",
    };

    let elegido = {};

    $: if (display == "block") {
        cargar();
    }

    $: filtrados = disponibles.filter((f) => {
        return (
            f.sede.toLowerCase().includes(filtro.sede.toLocaleLowerCase()) &&
            f.edificio
                .toLocaleLowerCase()
                .includes(filtro.edificio.toLocaleLowerCase()) &&
            f.unidad
                .toLocaleLowerCase()
                .includes(filtro.unidad.toLocaleLowerCase()) &&
            f.espacio.toLowerCase().includes(filtro.espacio.toLowerCase()) &&
            f.planta.toLowerCase().includes(filtro.planta.toLowerCase()) &&
            f.id != reserva_id
        );
    });
    async function cargar() {
        // const res = await fetch(`/api/reserva/espacios_disponibles`, {
        //     method: "POST",
        //     body: JSON.stringify({ fecha, desde, hasta }),
        // });

        const res = await apiFetch({
            ruta: `/api/reserva/espacios_disponibles`,
            method: "POST",
            token: false,
            body: { fecha, desde, hasta },
        });

        const jsn = await res.json();

        if (res.ok) {
            disponibles = [...jsn];
        } else {
            alert("No se pudo recuperar el detalle de la serie solicitada.");
            goto("/app/reserva");
        }
    }

    function borrar() {
        console.log("BORRAR ESTA REPETICION:", repeticion);
        mensajeConfirmarBorrar = "¿Borra la repetición seleccionada?";
        displayConfirmarBorrar = "block";
    }

    async function borrar_repeticion() {
        displayConfirmarBorrar = "none";
        console.log("BORRAR ESTA REPETICION:", repeticion);
        const res = await apiFetch({
            ruta: "/api/reserva/series_detalle",
            method: "DELETE",
            token: false,
            body: { reserva_id: repeticion.id },
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("REPETICION BORRADA:", jsn);
            salir();
        } else {
            console.log("NO SE BORRO LA REPETICION");
        }
    }

    function elegir(d) {
        elegido = { ...d };
        displayConfirmar = "block";
    }

    async function cambiar_espacio() {
        // const res = await fetch(`/api/reserva/series/cambiar_espacio`, {
        //     method: "PUT",
        //     body: JSON.stringify({
        //         reserva_id,
        //         espacio_id: elegido.id,
        //         username: $sre_usuario.username,
        //     }),
        // });


        const res = await apiFetch({
            ruta: `/api/reserva/series/cambiar_espacio`,
            method: "PUT",
            token: false,
            body: {
                reserva_id,
                espacio_id: elegido.id,
            },
        });
        const jsn = await res.json();

        if (res.ok) {
            // console.log('CAMBIO:',jsn)
            if (jsn.error) {
                mensajes = [jsn.mensajes];
                displayMensajes = "block";
            } else {
                displayConfirmar = "none";
                dispatch("actualizar");
            }
        } else {
            mensajes = ["No se pudo realizar el cambio de Espacio."];
            displayMensajes = "block";
        }

        // const res = await apiFetch({
        //     ruta: `/aulario/reservas/series/cambia_espacio`,
        //     method: "PUT",
        //     body: JSON.stringify({ reserva_id, espacio_id: elegido.id }),
        // });

        // displayConfirmar = "none";

        // mensajes = [];

        // if (res) {
        //     if (res.detail) {
        //         mensajes = [res.detail];
        //         displayMensajes = "block";
        //     } else {
        //         if (res.espacio_id != elegido.id) {
        //             mensajes = ["No se pudo realizar el cambio de Espacio."];
        //             displayMensajes = "block";
        //         } else {
        //             dispatch("actualizar");
        //         }
        //     }
        // } else {
        //     mensajes = [
        //         "Se produjo un error. No se pudo realizar el cambio de Espacio.",
        //     ];
        //     displayMensajes = "block";
        // }
    }

    function salir() {
        disponibles = [];
        dispatch("actualizar");
    }
</script>

<div style="display:{display}">
    <div class="w3-display-container" style="height: 50px;">
        <div class="w3-display-left">
            <h2>Repetición seleccionada</h2>
        </div>
        <div class="w3-display-right">
            <button class="w3-btn w3-red" on:click={salir}>
                <i class="fa fa-close" />
            </button>
        </div>
    </div>

    <div class="w3-row-padding">
        <div class="w3-quarter">
            <label for="fecha">Fecha:</label>
            <input
                type="text"
                name="fecha"
                readonly
                class="w3-input w3-round w3-light-grey"
                value={repeticion.fecha_reserva}
            />
        </div>
        <div class="w3-quarter">
            <label for="horario">Horario:</label>
            <input
                type="text"
                name="horario"
                readonly
                class="w3-input w3-round w3-light-grey"
                value={`${repeticion.desde} a ${repeticion.hasta}`}
            />
        </div>
        <div class="w3-quarter">
            <label for="edificio">Edificio:</label>
            <input
                type="text"
                name="edificio"
                readonly
                class="w3-input w3-round w3-light-grey"
                value={`${repeticion.edificio}`}
            />
        </div>
        <div class="w3-quarter">
            <label for="espacio">Espacio:</label>
            <input
                type="text"
                name="espacio"
                readonly
                class="w3-input w3-round w3-light-grey"
                value={`${repeticion.espacio}`}
            />
        </div>
        <div class="w3-quarter">
            <label for="planta">Planta:</label>
            <input
                type="text"
                name="planta"
                readonly
                class="w3-input w3-round w3-light-grey"
                value={`${repeticion.planta}`}
            />
        </div>
    </div>

    <br />
    <button class="w3-btn w3-round w3-red" on:click={borrar}
        >Borrar esta repetición</button
    >

    <h2>Cambiar ubicación</h2>
    <div class="w3-padding">
        Puede cambiar la ubicación de la repetición seleccionada, eligiendo un <b
            >espacio disponible</b
        >
        de la lista que sigue a continuación.
    </div>
    <div class="w3-padding">
        En los siguientes cuadros, puede aplicar filtros por Ubicación, Edificio,
        Unidad, Espacio o Planta, para localizar el Espacio requerido.
    </div>
    <div class="w3-padding w3-small" style="display:flex">
        <div style="margin-right: 5px;">
            <label for="sede">Ubicación:</label>
            <input
                type="text"
                name="sede"
                class="w3-input w3-border"
                bind:value={filtro.sede}
            />
        </div>
        <div style="margin-right: 5px;">
            <label for="edificio">Edificio:</label>
            <input
                name="edificio"
                class="w3-input w3-border"
                type="text"
                bind:value={filtro.edificio}
            />
        </div>
        <div style="margin-right: 5px;">
            <label for="unidad">Unidad:</label>
            <input
                type="text"
                name="unidad"
                class="w3-input w3-border"
                bind:value={filtro.unidad}
            />
        </div>
        <div style="margin-right: 5px;">
            <label for="espacio">Espacio:</label>
            <input
                type="text"
                name="espacio"
                class="w3-input w3-border"
                bind:value={filtro.espacio}
            />
        </div>
        <div style="margin-right: 5px;">
            <label for="planta">Planta:</label>
            <input
                type="text"
                name="planta"
                class="w3-input w3-border"
                bind:value={filtro.planta}
            />
        </div>
    </div>
    <div class="w3-row-padding w3-tiny">
        {#each filtrados as d}
            <div class="w3-half">
                <table
                    class="w3-table-all w3-hover-border-blue"
                    on:click={() => elegir(d)}
                    style="cursor: pointer;"
                >
                    <tbody>
                        <tr>
                            <td width="100px">Ubicación:</td>
                            <td>{d.sede}</td>
                        </tr>
                        <tr>
                            <td>Edificio:</td>
                            <td>{d.edificio}</td>
                        </tr>
                        <tr>
                            <td>Unidad A/G:</td>
                            <td>{d.unidad}</td>
                        </tr>
                        <tr>
                            <td>Espacio:</td>
                            <td>{d.espacio}</td>
                        </tr>
                        <tr>
                            <td>Planta:</td>
                            <td>{d.planta}</td>
                        </tr>
                        <tr>
                            <td>Capacidad:</td>
                            <td>{d.capacidad}</td>
                        </tr>
                        <tr>
                            <td>Cap. Aut.:</td>
                            <td>{d.capacidad_autorizada}</td>
                        </tr>
                    </tbody>
                </table>
                <br />
            </div>
        {/each}
    </div>
</div>

<div class="w3-modal" style="display:{displayConfirmar}">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div
                class="w3-display-container"
                style="height: 45px; margin-top:15px"
            >
                <div class="w3-display-topleft">
                    <h3>Confirmar</h3>
                </div>
                <div class="w3-display-topright">
                    <button
                        class="w3-btn w3-red"
                        on:click={() => (displayConfirmar = "none")}
                    >
                        <i class="fa fa-close w3-text-white" />
                    </button>
                </div>
            </div>
            <div class="w3-section">
                Se cambiará el Espacio de la Reserva seleccionada, por el
                Espacio que se muestra a continuación.
            </div>
            <div class="w3-section">
                <div class="w3-responsive">
                    <table class="w3-table-all w3-hover-border-blue">
                        <tbody>
                            <tr>
                                <td width="100px">Ubicación:</td>
                                <td>{elegido.sede}</td>
                            </tr>
                            <tr>
                                <td>Edificio:</td>
                                <td>{elegido.edificio}</td>
                            </tr>
                            <tr>
                                <td>Unidad A/G:</td>
                                <td>{elegido.unidad}</td>
                            </tr>
                            <tr>
                                <td>Espacio:</td>
                                <td>{elegido.espacio}</td>
                            </tr>
                            <tr>
                                <td>Planta:</td>
                                <td>{elegido.planta}</td>
                            </tr>
                            <tr>
                                <td>Capacidad:</td>
                                <td>{elegido.capacidad}</td>
                            </tr>
                            <tr>
                                <td>Cap. Aut.:</td>
                                <td>{elegido.capacidad_autorizada}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-blue w3-round w3-block"
                    on:click={cambiar_espacio}
                    >Click aquí para confirmar el cambio</button
                >
            </div>
        </div>
    </div>
</div>

<Mensajes
    display={displayMensajes}
    {mensajes}
    on:salir={() => (displayMensajes = "none")}
/>

<ConfirmarBorrar
    display={displayConfirmarBorrar}
    mensaje={mensajeConfirmarBorrar}
    on:confirmado={borrar_repeticion}
    on:cerrar={() => (displayConfirmarBorrar = "none")}
/>
