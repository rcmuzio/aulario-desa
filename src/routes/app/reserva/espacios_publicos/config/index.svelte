<script>
    import { apiFetch } from "$lib/client/api";
    import { sre_cod_uni_actual } from "$lib/stores";
    import { onMount } from "svelte";

    let max_reserva_dia = 0;

    onMount(async () => {
        await leer_config();
    });

    async function leer_config() {
        if($sre_cod_uni_actual=='XX') return;

        const res = await apiFetch({
            ruta: `/api/reserva/espacios_publicos/config?cod_uni=${$sre_cod_uni_actual}`,
            method: "GET",
            token: false,
            body: "",
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                await crear_config();
            } else {
                max_reserva_dia = jsn.max_reserva_dia;
            }
        } else {
            await crear_config();
        }
    }

async function crear_config() {
    const res = await apiFetch({
        ruta: `/api/reserva/espacios_publicos/config`,
        method: "POST",
        token: false,
        body: {
            cod_uni: $sre_cod_uni_actual,
            max_reserva_dia: 2,
        },
    });

    if (res.ok) {
        max_reserva_dia = 2;
    } else {
        max_reserva_dia = 0;
    }
}

async function modificar_config() {
    if(max_reserva_dia===undefined || max_reserva_dia<0 || isNaN(max_reserva_dia) || max_reserva_dia>10 ){
        alert('El parámetro no es válido, debe ser un número entre 0 y 10');
        return;
    }

    const res = await apiFetch({
        ruta: `/api/reserva/espacios_publicos/config`,
        method: "PUT",
        token: false,
        body: {
            cod_uni: $sre_cod_uni_actual,
            max_reserva_dia,
        },
    });

    if (!res.ok) {
        alert('No se pudo actualizar el parámetro');
    }
}
</script>

<div class="w3-padding w3-center">
    <span>Máximo número de reservas por día por persona:</span>
    <input
        type="text"
        bind:value={max_reserva_dia}
        maxlength="2"
        style="width: 50px; text-align:center"
    />
    <button on:click={modificar_config}>Actualizar</button>
</div>
