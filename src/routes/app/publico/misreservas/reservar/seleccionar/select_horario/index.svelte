<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { meses, diasem } from "$lib/variables";
    import { apiFetch } from "$lib/client/api";

    import EncabezadoPagina from "$lib/encabezado_pagina.svelte";
    import SelectFecha from "./select_fecha/index.svelte";
    import SelectEspacio from "./select_espacio/index.svelte";
    // import TieneReservas from  "./tiene_reservas/index.svelte";
    

    export let display = "none";
    export let edificio_id = 0;
    export let sede;
    export let edificio;

    const dispatch = createEventDispatcher();

    let fecha;
    let fecha_elegida = false;
    let fechas = [];
    let intervalo_dias = 15;
    let indice = 0;

    let tiene_reserva = {
        ok: false,
        espacio: "",
        horario: "",
        reservas: [],
    };

    onMount(async () => {
        fecha = new Date();
        let i = 0;
        do {
            let mm = fecha.getMonth();
            let ds = fecha.getDay();
            let dd = fecha.getDate().toString();

            let aaa = fecha.getFullYear().toString();
            let mmm = (fecha.getMonth() + 1).toString();
            let ddd = fecha.getDate().toString();

            if (mmm.length == 1) mmm = "0" + mmm;
            if (ddd.length == 1) ddd = "0" + ddd;

            if (!fecha_elegida && ds != 0) {
                fecha_elegida = {
                    fecha: `${aaa}-${mmm}-${ddd}`,
                    descri: `${diasem[ds].substring(0, 3)} ${dd} ${meses[
                        mm
                    ].substring(0, 3)}`,
                    descri2: `${diasem[ds]} ${dd} de ${meses[mm]}`,
                };
                await consulta_tiene_reserva();
            }

            if (ds != 0) {
                fechas.push({
                    fecha: `${aaa}-${mmm}-${ddd}`,
                    descri: `${diasem[ds].substring(0, 3)} ${dd} ${meses[
                        mm
                    ].substring(0, 3)}`,
                    descri2: `${diasem[ds]} ${dd} de ${meses[mm]}`,
                });
            }

            i++;
            fecha = new Date(fecha.valueOf() + 60 * 60 * 24 * 1000);
        } while (i < intervalo_dias);
        fechas = [...fechas];
    });

    async function consulta_tiene_reserva() {
        tiene_reserva.ok = false;

        // alert('consulta tiene reserva para fecha:'+fecha_elegida.fecha)
        const res = await apiFetch({
            ruta: `/api/publico/misreservas/${fecha_elegida.fecha}`,
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

    async function fecha_seleccionada(event) {
        fecha_elegida = { ...fechas[event.detail.indice] };
        await consulta_tiene_reserva();
    }

    async function fecha_proxima(event) {
        if (indice < fechas.length - 1) {
            indice++;
            fecha_elegida = { ...fechas[indice] };
            await consulta_tiene_reserva();
        }
    }

    async function fecha_anterior(event) {
        if (indice > 0) {
            indice--;
            fecha_elegida = { ...fechas[indice] };
            await consulta_tiene_reserva();
        }
    }
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <EncabezadoPagina
                titulo={"Seleccione un Horario"}
                ruta={"/app/publico/misreservas"}
            />
            <hr />
            <table width="100%" class="w3-large">
                <colgroup>
                    <col style="width:50%; text-align:right" />
                    <col style="width:50%; text-align:left" />
                </colgroup>
                <tr>
                    <td align="right">Ubicación:</td>
                    <td><b>{sede}</b></td>
                </tr>
                <tr>
                    <td align="right">Edificio/Área:</td>
                    <td><b>{edificio}</b></td>
                </tr>
            </table>

            <hr />

            <div class="w3-padding">
                <SelectFecha
                    {fechas}
                    {fecha_elegida}
                    on:elegida={fecha_seleccionada}
                />
            </div>

            <div
                class="w3-text-red w3-tiny w3-center"
                style="display:{tiene_reserva.ok ? 'block' : 'none'}"
            >
                <table class="w3-table-all w3-tiny">
                    <thead>
                        <tr>
                            <td
                                class="w3-small w3-center"
                                colspan="4"
                                align="center"
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

            <!-- <TieneReservas fecha={fecha_elegida.fecha} /> -->

            <div class="w3-padding">
                <SelectEspacio
                    {fecha_elegida}
                    {edificio_id}
                    {tiene_reserva}
                    on:fecha_proxima={fecha_proxima}
                    on:fecha_anterior={fecha_anterior}
                    on:actualizar_tiene_reserva={()=>{
                        // alert('pide actualizar tiene reserva')
                        consulta_tiene_reserva()
                    }}
                />
            </div>
        </div>
    </div>
</div>
