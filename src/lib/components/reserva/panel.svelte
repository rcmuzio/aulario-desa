<script>
    import { createEventDispatcher } from "svelte";
    import { sre_data, sre_reserva } from "$lib/stores";
    import Calendario from "./calendario/calendario.svelte";
    import { goto } from "$app/navigation";

    export let fecha;

    const dispatch = createEventDispatcher();

    let buscar = "";
    let displayBtbMonitor = "none";

    $: {
        dispatch("buscar_texto", { buscar });
    }

    $: {
        displayBtbMonitor = "none";
        $sre_data.unidades_vinculadas.map((uv) => {
            if (uv.cod_uni == $sre_reserva.cod_uni) displayBtbMonitor = "block";
        });
    }
</script>

<div class="w3-padding">
    <div class="w3-section">
        <Calendario {fecha} on:fecha on:cambia_muestra />
    </div>
    <div class="w3-section">
        <button
            class="w3-btn w3-block w3-blue w3-round"
            on:click={() => goto("/app/reserva/serie/Agregar-0")}
            >Reservar
            <!-- <a
                href="/app/reserva/serie/Agregar-0"
                class="w3-btn w3-block w3-blue w3-round">Reservar</a
            > -->
        </button>
    </div>
    <div class="w3-section" style="display: {displayBtbMonitor};">
        <button
            style="border: none; background-color:transparent"
            class="w3-btn w3-block w3-blue w3-round"
            on:click={() => goto("/app/reserva/monitor")}
        >
            Monitores
            <!-- <a
                href="/app/reserva/monitor"
                class="w3-btn w3-block w3-blue w3-round">Monitor</a
            > -->
        </button>
    </div>

    <div class="w3-section">
        <!-- <button style="border: none; background-color:transparent">
            <a
                href="/app/reserva/disponibles"
                class="w3-btn w3-block w3-blue w3-round">Disponibilidad</a
            ></button
        > -->
        <button
            style="border: none; background-color:transparent"
            class="w3-btn w3-block w3-blue w3-round"
            on:click={() => goto("/app/reserva/disponibles")}
        >
            Disponibilidad
            <!-- <a
                href="/app/reserva/monitor"
                class="w3-btn w3-block w3-blue w3-round">Monitor</a
            > -->
        </button>
    </div>

    <div class="w3-section">
        <div class="w3-round w3-border">
            <div style="padding: 5px 5px 5px 5px">
                <table>
                    <tr>
                        <td
                            ><input
                                type="text"
                                class="w3-tiny"
                                style="border:none; width:100%; /* background-color:lightskyblue */"
                                bind:value={buscar}
                                placeholder="buscar..."
                            /></td
                        >
                        <td align="center" style="width: 20px;">
                            <button
                                style="border: none; background-color:transparent; cursor: pointer;"
                                title="Borrar texto"
                                on:click={() => (buscar = "")}
                            >
                                <i class="fa fa-trash-o" />
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <div class="w3-section" style="display: {displayBtbMonitor};">
        <button
            style="border: none; background-color:transparent; height:40px"
            class="w3-btn w3-block w3-blue w3-round w3-tiny"
            on:click={() => goto("/app/reserva/espacios_publicos")}
        >
            Espacios Públicos
        </button>
    </div>
</div>
