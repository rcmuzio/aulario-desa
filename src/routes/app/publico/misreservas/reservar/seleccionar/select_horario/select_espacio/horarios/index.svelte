<script>
    import { createEventDispatcher } from "svelte";
    import { sre_usuario } from "$lib/stores";
    // import Confirmar from "$lib/components/reserva/confirmar.svelte";
    import Confirmar from "$lib/components/confirmar.svelte";
    import Mensaje from "$lib/components/mensaje.svelte";
    import { apiFetch } from "$lib/client/api";

    export let espacio_id = 0;
    export let edificio_id = 0;
    export let x_cod_uni = "XX";
    export let fecha_elegida = {};
    export let tiene_reserva = { ok: false };

    const dispatch = createEventDispatcher();

    let horarios = [];
    let reserva_id;
    
    // let tiene_una_reserva = { display: "none", horario: "", espacio: "" };

    let paramMensaje = {
        display: "none",
        titulo: "Atención",
        mensajes: ["hola"],
    };

    let paramConfirmar = {
        titulo: "Confirmar reserva",
        mensaje: "",
        display: "none",
    };

    $: {
        espacio_id = espacio_id;
        fecha_elegida = { ...fecha_elegida };
        cargar();
    }

    // $: {
    //     tiene_una_reserva.display = "none";
    //     horarios.map((u) => {
    //         if (u.username == $sre_usuario.username) {
    //             tiene_una_reserva.display = "block";
    //             tiene_una_reserva.horario = u.horario;
    //             tiene_una_reserva.espacio = u.espacio;
    //         }
    //     });
    // }
    async function cargar() {
        // const res = await fetch(`/api/reserva/publico/espacios/horarios`, {
        //     method: "POST",
        //     body: JSON.stringify({
        //         espacio_id,
        //         fecha: fecha_elegida.fecha,
        //     }),
        // });

        const res = await apiFetch({
            ruta: `/api/publico/misreservas/espacios/horarios`,
            method: "POST",
            token: false,
            body: {
                espacio_id,
                fecha: fecha_elegida.fecha,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("HORARIOS:", jsn);
            jsn.datos.map((d) => {
                d.color = "w3-light-grey";
                if (d.username == $sre_usuario.username) {
                    d.color = "w3-blue";
                } else {
                    if (d.estado == "Ocupado") {
                        d.color = "w3-red";
                    }
                }
                return d;
            });
            horarios = [...jsn.datos];
        }
    }

    function confirmar(h) {
        let mismo_edificio = false;
        let mismo_horario = false;
        let sede = "";
        let edificio = "";
        let espacio = "";
        let hhhh = "";
        let cantidad = 0;

        if (tiene_reserva.ok) {
            tiene_reserva.reservas.map((r) => {
                if (r.edificio_id == edificio_id) {
                    mismo_edificio = true;
                }
                if (r.horario == h.horario) {
                    mismo_horario = true;
                    sede = r.sede;
                    edificio = r.edificio;
                    espacio = r.espacio;
                    hhhh = r.horario;
                }

                if (r.cod_uni == x_cod_uni) cantidad++;

                // if (mismo_edificio || mismo_horario) {
                // if ( mismo_horario) {
                //     sede = r.sede;
                //     edificio = r.edificio;
                //     espacio = r.espacio;
                //     hhhh = r.horario;
                // }
            });
        }

        // if (mismo_edificio || mismo_horario) {
        if (mismo_horario) {
            paramMensaje.mensajes = [
                `Ya tiene una reserva este día en <br>
                <table align='center' class='w3-small w3-text-grey'>
                    <tr>
                        <td align='left'>Ubicación:</td>
                        <td class='w3-text-black w3-left-align'>${sede}</td>
                    </tr>
                    <tr>
                        <td align='left'>Edificio/Lugar:</td>
                        <td class='w3-text-black w3-left-align'>${edificio}</td>
                    </tr>
                    <tr>
                        <td align='left'>Espacio:</td>
                        <td class='w3-text-black w3-left-align'>${espacio}</td>
                    </tr>
                    <tr>
                        <td align='left'>Horario:</td>
                        <td class='w3-text-black w3-left-align'>${hhhh}</td>
                    </tr>
                </table>`,
            ];

            paramMensaje.display = "block";
            return;
        }

        if (cantidad > h.max_reserva_dia - 1) {
            paramMensaje.mensajes = [
                `Solo puede hacer hasta ${h.max_reserva_dia} ${
                    h.max_reserva_dia > 1 ? "reservas" : "reserva"
                } por día en la misma unidad de gestión.`,
            ];

            paramMensaje.display = "block";
            return;
        }

        reserva_id = h.id;

        paramConfirmar.mensaje = `¿Confirma la reserva para el día <br>${fecha_elegida.descri2} <br>en el horario ${h.horario} ?`;
        paramConfirmar.display = "block";
    }

    async function reservar() {
        let body = {
            reserva_id,
            username: $sre_usuario.username,
            token: $sre_usuario.id_token,
        };

        paramConfirmar.display = "none";

        // const res = await apiFetch({
        //     ruta: `/api/reserva/publico/misreservas`,
        //     method: "POST",
        //     token: false,
        //     body,
        // });

        const res = await apiFetch({
            ruta: `/api/publico/misreservas`,
            method: "POST",
            token: false,
            body,
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("jsn:", jsn);
        } else {
            console.log("ERROR NO AGREGO");
        }
        // alert('ver resultado')

        await cargar();
        // alert('tiene que releer si tiene reserva')
        dispatch("actualizar_tiene_reserva");
    }
</script>

<!-- <div
    class="w3-center w3-text-red w3-tiny"
    style="display:{tiene_una_reserva.display}"
>
    tiene una reserva de {tiene_una_reserva.horario}
</div> -->

<div class="w3-small ">
    {#each horarios as h}
        <button
            class="w3-button w3-round {h.color} "
            style="margin: 5px;"
            disabled={h.estado == "Ocupado" || h.f2 < h.f3 ? true : false}
            on:click={() => confirmar(h)}>{h.horario}</button
        >
    {:else}
        <div>No hay horarios dispobibles</div>
    {/each}
</div>

<div class="w3-tiny w3-hide-medium w3-hide-large">
    {#each horarios as h}
        <button
            class="w3-button w3-round {h.color} "
            style="margin: 5px; "
            disabled={h.estado == "Ocupado" || h.f2 < h.f3 ? true : false}
            on:click={() => confirmar(h)}>{h.horario}</button
        >
    {:else}
        <div>No hay horarios dispobibles</div>
    {/each}
</div>

<Confirmar
    param={paramConfirmar}
    on:no={() => (paramConfirmar.display = "none")}
    on:si={reservar}
/>

<Mensaje
    param={paramMensaje}
    on:continuar={() => (paramMensaje.display = "none")}
/>

<style>
    .resaltado {
        font-weight: bold;
        text-align: left;
        font-style: italic;
        color: black;
    }
</style>
