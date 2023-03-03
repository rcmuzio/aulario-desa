<script>
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import Datatable from "$lib/datatable.svelte";
    import Mensaje from "$lib/components/mensaje.svelte";
    import Confirmar from "$lib/components/confirmar.svelte";
    import Detalle from "./reservar/seleccionar/select_horario/select_espacio/detalle_espacio/index.svelte";

    let reserva;

    let params = {
        on: false,
        paginado: {
            ok: true,
            pagina: 1,
            paginas: 1,
            rxp: 10,
            registros: 1,
        },
        action: "crud",
        widthcolbtns: "100px",
        btnh: [
            {
                class: "fa fa-plus w3-text-grey w3-hover-text-blue",
                action: "Agregar",
                title: "Agregar",
            },
        ],
        btnf: [
            {
                class: "fa fa-ellipsis-h w3-text-grey w3-hover-text-light-green",
                action: "VerDetalle",
                title: "Características del espacio",
            },
            {
                class: "fa fa-close w3-text-grey w3-hover-text-red",
                action: "Borrar",
                title: "Cancelar reserva",
            },
        ],
        items: [
            {
                name: "fecha",
                title: "Fecha",
                filtro: "",
            },
            {
                name: "horario",
                title: "Horario",
                filtro: "",
            },
            {
                name: "sede",
                title: "Ubicación",
                filtro: "",
            },
            {
                name: "edificio",
                title: "Edificio/Lugar",
                filtro: "",
            },
            {
                name: "espacio",
                title: "Espacio",
                filtro: "",
            },
        ],
        filas: [],
    };

    let paramsMensaje = {
        display: "none",
        titulo: "Atención",
        mensajes: ["hola"],
    };

    let paramsConfirmar = {
        titulo: "Confirmar acción",
        mensaje: "",
        display: "none",
    };

    let detalleDisplay = "none";
    let detalleEspacioId = 0;

    onMount(async () => {
        await cargar();
    });

    async function cargar() {
        const res = await apiFetch({
            ruta: "/api/publico/misreservas/consulta",
            method: "POST",
            token: false,
            body: {
                paginado: params.paginado,
                items: params.items,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            params.on = false;
            params.filas = [...jsn.filas];
            params.paginado = { ...jsn.paginado };
            console.log("jsn:", jsn);
        } else {
            console.log("error");
        }
    }

    function filas_seleccionadas() {}

    function accion(event) {
        console.log(event.detail);
        // return;

        switch (event.detail.action) {
            case "Agregar":
                goto("/app/publico/misreservas/reservar");
                return;
            case "Borrar":
                reserva = { ...event.detail.fila };
                if (reserva.f3 > reserva.f1) {
                    paramsMensaje.mensajes = [
                        "La reserva no puede ser anulada una vez que pasó el horario de inicio de la misma.",
                    ];
                    paramsMensaje.display = "block";
                } else {
                    paramsConfirmar.mensaje = `¿Cancela la reserva seleccionada (${reserva.fecha})?`;
                    paramsConfirmar.display = "block";
                }
                return;
            case "VerDetalle":
                reserva = { ...event.detail.fila };
                detalleEspacioId = reserva.espacio_id;
                detalleDisplay = "block";
                return;
            default:
                alert("Accion:" + event.detail.action);
        }
    }

    function elegido() {}

    async function actualizar(event) {
        params = { ...event.detail.params };
        await cargar();
    }

    async function borrar() {
        paramsConfirmar.display = "none";

        // const res = await apiFetch({
        //     ruta: `/api/reserva/publico/misreservas`,
        //     method: "DELETE",
        //     token: false,
        //     body: {
        //         reserva_ocupada_id: reserva.reserva_ocupada_id,
        //     },
        // });

        const res = await apiFetch({
            ruta: `/api/publico/misreservas`,
            method: "DELETE",
            token: false,
            body: {
                reserva_ocupada_id: reserva.reserva_ocupada_id,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
            console.log("RESULTADO BORRAR:", jsn);
            if (jsn.error) {
                paramsMensaje.mensajes = [jsn.mensaje];
                paramsMensaje.display = "block";
            } else {
                await cargar();
            }
        } else {
            console.log("error al borrar");
        }
    }
</script>

<div class="w3-padding">
    <div class="w3-display-container" style="height: 45px;">
        <div class="w3-display-toplef w3-text-indigo">
            <h3 style="font-weight: bold;">Mis reservas</h3>
        </div>
        <div class="w3-display-topright">
            <button class="w3-btn w3-red" on:click={() => goto("/app")}>
                <i class="fa fa-close w3-text-white" />
            </button>
        </div>
    </div>

    <Datatable
        {params}
        on:continuar={filas_seleccionadas}
        on:action={accion}
        on:elegido={elegido}
        on:actualizar={actualizar}
    />
</div>

<Mensaje
    param={paramsMensaje}
    on:continuar={() => (paramsMensaje.display = "none")}
/>

<Confirmar
    param={paramsConfirmar}
    on:no={() => (paramsConfirmar.display = "none")}
    on:si={borrar}
/>

<Detalle
    display={detalleDisplay}
    espacio_id={detalleEspacioId}
    on:cerrar={() => (detalleDisplay = "none")}
/>
