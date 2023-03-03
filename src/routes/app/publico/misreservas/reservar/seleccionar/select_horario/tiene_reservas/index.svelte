<script>
    import { apiFetch } from "$lib/client/api";

    export let fecha = false;
    
    let tiene_reserva = {
        ok: false,
        espacio: "",
        horario: "",
        reservas: [],
    };

    $: cargar()

    async function cargar() {
        if(!fecha) return;

        tiene_reserva.ok = false;

        const res = await apiFetch({
            ruta: `/api/reserva/publico/misreservas/${fecha}`,
            method: "GET",
            token: false,
            body: "",
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("TIENE RESERVAS::::", jsn);
            if (jsn.length > 0) {
                tiene_reserva = {
                    ok: true,
                    reservas: [...jsn],
                };
            }
        }
    }
</script>

<div
    class="w3-text-red w3-tiny w3-center"
    style="display:{tiene_reserva.ok ? 'block' : 'none'}"
>
    <table class="w3-table-all w3-tiny">
        <thead>
            <tr>
                <td class="w3-small w3-center" colspan="4" align="center"
                    ><b>Tiene las siguientes reservas</b></td
                >
            </tr>
            <tr>
                <th>Sede</th>
                <th>Edificio/Lugar</th>
                <th>Espacio</th>
                <th>Horario</th>
            </tr>
        </thead>
        <tbody>
            {#each tiene_reserva.reservas as r}
                <tr>
                    <td>{r.sede}</td>
                    <td>{r.edificio}</td>
                    <td>{r.espacio}</td>
                    <td>{r.horario}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
