<script>
    import { goto } from "$app/navigation";
    import { apiFetch } from "$lib/client/api";

    import EspaciosDisponibles from "$lib/components/reserva/espacios_disponibles.svelte";

    import { onMount } from "svelte";

    export let data;

    let reserva_id = 0;

    let serie = {};

    let filas = [];

    let fila = {};

    let display = "none";

    let displayDetalle = "block";

    let displayEspaciosDisponibles = "none";

    let displayAvisoNoConfirmadas = "none";

    let fecha = "";

    let desde = "";

    let hasta = "";

    let noconfirmadas = 0;

    onMount(async () => {
        await cargar_serie();
        await cargar_detalle();
    });

    async function cargar_serie() {
        // const res = await fetch(`/api/reserva/series?serie=${data.serie}`, {
        //     method: "GET",
        // });

        const res = await apiFetch({
            ruta: `/api/reserva/series?serie=${data.serie}`,
            method: "GET",
            token: false,
            body: "",
        });

        const jsn = await res.json();

        if (res.ok) {
            serie = { ...jsn[0] };
        } else {
            alert("No se pudo recuperar la serie solicitada.");
            goto("/app/reserva");
        }
    }

    async function cargar_detalle() {
        noconfirmadas = 0;

        const res = await apiFetch({
            ruta: `/api/reserva/series_detalle?serie=${data.serie}`,
            method: "GET",
            token: false,
            body: "",
        });

        const jsn = await res.json();

        if (res.ok) {
            filas = [...jsn];
            display = "block";
        } else {
            alert("No se pudo recuperar el detalle de la serie solicitada.");
            goto("/app/reserva");
        }

        filas.map((f) => {
            if (!f.confirmada) noconfirmadas++;
        });

        displayAvisoNoConfirmadas = noconfirmadas > 0 ? "block" : "none";
    }

    async function refrescar() {
        displayEspaciosDisponibles = "none";
        displayDetalle = "block";
        await cargar_detalle();
    }
</script>

<div class="w3-container">
    <div class="w3-display-container" style="height: 45px;">
        <div class="w3-display-toplef"><h2>Consulta Serie</h2></div>
        <div class="w3-display-topright">
            <button class="w3-btn w3-red" on:click={() => goto("/app/reserva")}>
                <i class="fa fa-close w3-text-white" />
            </button>
        </div>
    </div>

    <div class="" style="display:{display}">
        <div class="w3-row-padding">
            <div class="w3-quarter">
                <label for="unidad">Unidad:</label>
                <input
                    class="w3-input w3-round w3-light-grey"
                    type="text"
                    name="unidad"
                    value={serie.unidad}
                />
            </div>
            <div class="w3-quarter">
                <label for="unidad">Carrera:</label>
                <input
                    class="w3-input w3-round w3-light-grey"
                    type="text"
                    name="unidad"
                    value={serie.carrera}
                />
            </div>
            <div class="w3-quarter">
                <label for="unidad">Materia:</label>
                <input
                    class="w3-input w3-round w3-light-grey"
                    type="text"
                    name="unidad"
                    value={serie.materia}
                />
            </div>
            <div class="w3-quarter">
                <label for="unidad">Docente:</label>
                <input
                    class="w3-input w3-round w3-light-grey"
                    type="text"
                    name="unidad"
                    value={serie.docente}
                />
            </div>
        </div>
        <div class="w3-padding">
            <label for="descri">Descripción:</label>
            <textarea
                class="w3-input w3-round w3-light-grey"
                type="text"
                name="descri"
                value={serie.descri}
            />
        </div>

        <div class="w3-responsive w3-padding" style="display:{displayDetalle}">
            <div
                class="w3-padding w3-center w3-text-red w3-xlarge"
                style="font-weight:bold"
            >
                Reservas NO confirmadas: {noconfirmadas}
            </div>
            <table class="w3-table-all w3-small">
                <thead>
                    <tr class="w3-grey w3-text-white">
                        <td>Fecha</td>
                        <td>Horario</td>
                        <td>Sede / Edificio / Espacio</td>
                        <td>Confirmado</td></tr
                    >
                </thead>
                <tbody>
                    {#each filas as f}
                        <tr
                            class="w3-text-{f.confirmado_color}"
                            on:click={() => {
                                fila = { ...f };
                                console.log(fila);
                                reserva_id = f.id;
                                fecha = f.fecha;
                                desde = f.desde;
                                hasta = f.hasta;
                                displayDetalle = "none";
                                displayEspaciosDisponibles = "block";
                            }}
                        >
                            <td>{f.dia} {f.num_dia} de {f.nom_mes}</td>
                            <td>{f.desde} - {f.hasta}</td>
                            <td>
                                {f.sede} <br />
                                {f.edificio} <br />
                                {f.espacio} ({f.planta})
                            </td>
                            <td
                                >{f.confirmado}
                                {#if f.sp_docente > 0}(Docente){/if}
                                {#if f.sp_actividad > 0}(Actividad){/if}</td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <EspaciosDisponibles
            display={displayEspaciosDisponibles}
            repeticion={fila}
            {reserva_id}
            {fecha}
            {desde}
            {hasta}
            on:actualizar={refrescar}
            on:salir={() => {
                displayEspaciosDisponibles = "none";
                displayDetalle = "block";
            }}
        />
    </div>
</div>

<div class="w3-modal" style="display:{displayAvisoNoConfirmadas}">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            ATENCIÓN ! ! ! <br /> <br />
            Existen actividades sin confirmar, posiblemente por superposición horaria.
            <br />
            Revise la lista. <br /> <br />
            <button
                class="w3-btn w3-orange w3-round"
                on:click={() => (displayAvisoNoConfirmadas = "none")}
                >Continuar</button
            >
        </div>
    </div>
</div>
