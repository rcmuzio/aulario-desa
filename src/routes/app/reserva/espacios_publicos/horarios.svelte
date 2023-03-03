<script>
    import { createEventDispatcher } from "svelte";
    // import { fecha_actual_string } from "$lib/funciones";
    import EncabezadoPagina from "$lib/encabezado_pagina.svelte";
    import { sre_usuario } from "$lib/stores";
    import { goto } from "$app/navigation";
    import { apiFetch } from "$lib/client/api";
    import Mensaje from "$lib/components/mensaje.svelte";

    export let display = "none";
    export let espacio = "";
    export let anio = new Date().getFullYear();

    let f1 = "";
    let f2 = "";

    $: {
        f1 = anio + "-03-01";
        f2 = anio + 1 + "-03-01 ";
        let f3 =
            new Date(anio + 1, 2, 1, 0, 1, 0).valueOf() - 24 * 60 * 60 * 1000;
        let ff = new Date(f3);

        let a = ff.getFullYear();
        let m = (parseInt(ff.getMonth()) + 1).toString();

        let d = ff.getDate().toString();
        if (m.length == 1) m = "0" + m;
        if (d.length == 1) d = "0" + d;

        f2 = a + "-" + m + "-" + d;
    }
    
    const dispatch = createEventDispatcher();

    let paramMensaje = {
        display: "none",
        titulo: "Atención",
        mensajes: [],
    };

    let procesando_reserva = false;

    let horarios = [];

    let dias = [
        // { descri: "Do", value: 0, checked: false },
        { descri: "Lu", value: 0, checked: true },
        { descri: "Ma", value: 1, checked: true },
        { descri: "Mi", value: 2, checked: true },
        { descri: "Ju", value: 3, checked: true },
        { descri: "Vi", value: 4, checked: true },
        { descri: "Sa", value: 5, checked: false },
    ];

    let desde = new Date().toISOString().substring(0, 10);
    let hasta = new Date(desde.substring(0, 5) + "12-20 00:00:1")
        .toISOString()
        .substring(0, 10);

    for (let i = 8; i < 22; i++) {
        let x = i.toString();
        if (x.length == 1) x = "0" + x;
        let z = (i + 1).toString();
        if (z.length == 1) z = "0" + z;
        horarios.push({
            checked: true,
            horario: x + ":00 - " + z + ":00",
            desde: x + ":00:01",
            hasta: z + ":00:00",
        });
        horarios = [...horarios];
    }

    async function asignar() {
        let mm = [];

        if (desde < f1 || hasta > f2) {
            mm.push(
                `El rango de fechas debe estar entre ${f1
                    .split("-")
                    .reverse()
                    .join("-")} y ${f2.split("-").reverse().join("-")}`
            );
        }

        if (mm.length > 0) {
            paramMensaje.mensajes = [...mm];
            paramMensaje.display = "block";
            return;
        }

        procesando_reserva = true;

        let reserva = {
            serie: "",
            espacio_id: espacio.espacio_id,
            cod_uni: espacio.cod_uni,
            cod_car: "",
            cod_mate: "",
            cod_prof: "",
            curso: "",
            catedra: "",
            comision: "",
            tipo_acti: 8 /* de 1 a 7, 7 es otras reserva y 8 destinado a reserva pública*/,
            descri: "Para reserva pública",
            desde: desde,
            hasta: hasta,
            horarios: [],
        };

        // reserva.horarios.map((h) => {
        //     h.desde = h.desde.length < 6 ? h.desde + ":01" : h.desde;
        //     h.hasta = h.hasta.length < 6 ? h.hasta + ":00" : h.hasta;
        //     return h;
        // });

        let ddd = [];
        dias.map((d) => {
            ddd.push(d.checked);
        });

        let hhh = [];
        horarios.map((h) => {
            if (h.checked) {
                hhh.push({
                    desde: h.desde,
                    hasta: h.hasta,
                    dias: [...ddd],
                });
            }
        });

        reserva.horarios = [...hhh];
        reserva.username = $sre_usuario.username;

        // console.log("RESERVAR:", reserva);
        // return;
        // let body = JSON.stringify({
        //     espacio_id: espacio.id,
        //     desde,
        //     hasta,
        //     horarios,
        //     dias,
        // });

        // console.log('body:', body)
        // const res = await fetch(`/api/reserva/publico/horarios/asignar`, {
        //     method: "POST",
        //     body,
        // });

        // if(res.ok){
        //     const jsn = await res.json()
        //     console.log('jsn:', jsn)
        // }

        const res = await apiFetch({
            ruta: "/api/reserva/series",
            method: "PUT",
            token: false,
            body: reserva,
        });

        const jsn = await res.json();
        console.log("RESPUESTA:", jsn);
        if (res.ok) {
            if (jsn.error) {
                // mensajes = [jsn.mensaje];
                // displayMensajes = "block";
                alert(jsn.mensaje);
            } else {
                goto(`/app/reserva/serie/consulta/${jsn.serie}`);
                return;
            }
        } else {
            alert("No se pudo modificar la serie solicitada.");
            // mensajes = ["No se pudo modificar la serie solicitada."];
            // displayMensajes = "block";
        }
    }
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content w3-round" style="max-width:400px ;">
        <div class="w3-padding">
            <EncabezadoPagina
                titulo={"Asignar horarios"}
                accion={"cerrar"}
                on:cerrar={() => dispatch("cerrar")}
            />

            <div
                class="w3-medium w3-round w3-center w3-light-grey w3-margin-top w3-padding"
            >
                <b>{espacio.espacio}</b>
            </div>
            <div class="w3-row-padding w3-small">
                <div class="w3-half">
                    <div class="w3-section">
                        <label for="desde">Desde:</label>
                        <input
                            type="date"
                            name="desde"
                            id="desde"
                            class="w3-input w3-light-grey w3-round"
                            bind:value={desde}
                        />
                    </div>
                    <div class="w3-section">
                        <label for="hasta">Hasta:</label>
                        <input
                            type="date"
                            name="hasta"
                            id="hasta"
                            class="w3-input w3-light-grey w3-round"
                            bind:value={hasta}
                        />
                    </div>
                    <div class="w3-section">
                        <table cellpadding="2" align="center">
                            <tr>
                                {#each dias as d}
                                    <th>{d.descri}</th>
                                {/each}
                            </tr>
                            <tr>
                                {#each dias as d}
                                    <th
                                        ><input
                                            type="checkbox"
                                            style="cursor: pointer;"
                                            bind:checked={d.checked}
                                        /></th
                                    >
                                {/each}
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="w3-half">
                    <div class="w3-responsive w3-small">
                        <table align="center">
                            {#each horarios as h}
                                <tr>
                                    <td
                                        ><input
                                            type="checkbox"
                                            style="cursor: pointer;"
                                            bind:checked={h.checked}
                                        /></td
                                    >
                                    <td>{h.horario}</td>
                                </tr>
                            {/each}
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="w3-padding w3-center">
            <button
                class="w3-btn w3-block w3-blue w3-round"
                on:click={asignar}
                style="display:{procesando_reserva ? 'none' : 'block'}"
                >Asignar</button
            >
            <span style="display:{procesando_reserva ? 'block' : 'none'}"
                >Procesando...</span
            >
        </div>
    </div>
</div>

<Mensaje
    param={paramMensaje}
    on:continuar={() => (paramMensaje.display = "none")}
/>
