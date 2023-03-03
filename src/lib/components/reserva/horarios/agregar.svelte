<script>
    import { valida_hora } from "$lib/funciones";
    import { createEventDispatcher } from "svelte";
    import Mensajes from "$lib/components/reserva/mensajes.svelte";

    const dispatch = createEventDispatcher();

    export let display = "none";

    let dias = [false, false, false, false, false, false];

    let horario = {
        desde: "",
        hasta: "",
    };
    let mensajes = [];

    let displayMensajes = "none";

    // function valida_hora(x){
    //     return x;
    // }

    function agregar() {
        mensajes = [];
        let dd = 0;
        if (horario.desde.length < 5)
            mensajes.push("Debe ingresar la hora de inicio.");
        if (horario.hasta.length < 5)
            mensajes.push("Debe ingresar la hora de finalización.");
        if (horario.hasta < horario.desde)
            mensajes.push("El rango horario no es válido.");
        dias.map((d) => {
            if (d) dd++;
        });

        if (dd == 0) {
            mensajes.push(
                "Debe seleccionar al menos un día de lunes a sábado."
            );
        }

        mensajes = [...mensajes];

        if (mensajes.length > 0) {
            displayMensajes = "block";
            return;
        }

        let r = { ...horario };
        r["dias"] = [...dias];
        dispatch("agregar", r);
        reset();
    }

    function reset() {
        horario = {
            desde: "",
            hasta: "",
        };

        dias = [false, false, false, false, false, false];
    }
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content">
        <div class="w3-container">
            <div class="w3-display-container" style="height: 45px;">
                <div class="w3-display-toplef">
                    <h2>Agregar Horario</h2>
                </div>
                <div class="w3-display-topright">
                    <button
                        class="w3-btn w3-red"
                        on:click={() => dispatch("salir")}
                    >
                        <i class="fa fa-close w3-text-white" />
                    </button>
                </div>
            </div>
            <div class="w3-section">
                <div class="w3-responsive">
                    <table
                        width="90%"
                        cellpadding="5"
                        align="center"
                        border="1"
                        style="align:center; border-collapse: collapse; border-spacing: 10px  border: 1px solid grey"
                    >
                        <thead>
                            <tr>
                                <td colspan="2">Horario</td>
                                <td colspan="6">Días</td>
                            </tr>
                            <tr>
                                <td>Desde</td>
                                <td>Hasta</td>
                                <td>Lun</td>
                                <td>Mar</td>
                                <td>Mie</td>
                                <td>Jue</td>
                                <td>Vie</td>
                                <td>Sab</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="width:100px"
                                    ><input
                                        type="text"
                                        style="width:95%"
                                        bind:value={horario.desde}
                                        on:blur={() =>
                                            (horario.desde = valida_hora(
                                                horario.desde
                                            ))}
                                    /></td
                                >
                                <td style="width:100px"
                                    ><input
                                        type="text"
                                        style="width:95%"
                                        bind:value={horario.hasta}
                                        on:blur={() =>
                                            (horario.hasta = valida_hora(
                                                horario.hasta
                                            ))}
                                    /></td
                                >
                                {#each dias as d}
                                    <td
                                        ><input
                                            type="checkbox"
                                            bind:checked={d}
                                        /></td
                                    >
                                {/each}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="w3-section">
                <button
                    class="w3-btn w3-blue w3-text-white w3-round"
                    on:click={agregar}>Agregar</button
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
