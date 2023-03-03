<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import Datatable from "$lib/datatable.svelte";

    export let display = "none";
    export let reserva = 1;

    const dispatch = createEventDispatcher();

    let mostrar_pagina = true;

    let espacio_elegido = {};
    let espacio_accion = "Agregar";

    let error = false;
    let error_mensaje = "";

    let params = {
        on: false,
        paginado: {
            ok: true,
            pagina: 1,
            paginas: 1,
            rxp: 10,
            registros: 1,
            filtros:[]
        },
        action: "radio",
        widthcolbtns: "100px",
        btnh: [
            {
                class: "fa fa-plus w3-text-blue",
                action: "Agregar",
                title: "Agregar",
            },
        ],
        btnf: [
            {
                class: "fa fa-pencil w3-text-green",
                action: "Editar",
                title: "Editar",
            },
            {
                class: "fa fa-trash-o w3-text-red",
                action: "Borrar",
                title: "Borrar",
            },
        ],
        items: [
            {
                name: "sede",
                title: "Ubicación",
                filtro: "",
            },
            {
                name: "edificio",
                title: "Edificio",
                filtro: "",
            },
            {
                name: "unidad",
                title: "Unidad",
                filtro: "",
            },
            {
                name: "tipo_espacio",
                title: "Tipo de espacio",
                filtro: "",
            },
            {
                name: "espacio",
                title: "Espacio",
                filtro: "",
            },
            {
                name: "planta",
                title: "Planta",
                filtro: "",
            },
            {
                name: "capacidad",
                title: "Capacidad",
                filtro: "",
            },
            {
                name: "capacidad_autorizada",
                title: "Capacidad autorizada",
                filtro: "",
            },
            {
                name: "espacio_reserva",
                title: "Se puede reservar",
                filtro: "",
            },
            {
                name: "verificado",
                title: "Verificado",
                filtro: "",
            },
            {
                name: "sis_vigente",
                title: "Vigente",
                filtro: "",
            },
        ],
        filas: [],
    };

    onMount(async () => {
        cargar();
    });

    async function cargar() {
        params.paginado.filtros = ["reservables"];

        const res = await apiFetch({
            ruta: `/api/publico/buscar/espacios`,
            method: "POST",
            token: false,
            body: {
                paginado: params.paginado,
                items: params.items,
            },
        });

        mostrar_pagina = true;

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                error_mensaje = jsn.mensaje;
                error = true;
            } else {
                params.on = false;
                params.filas = [...jsn.filas];
                params.paginado = jsn.paginado;
            }
        } else {
            console.log("Se produjo un error inesperado.");
        }
    }

    function filas_seleccionadas(event) {
        console.log(event.detail);
    }

    function accion(event) {
        espacio_elegido = { ...event.detail.fila };
        espacio_accion = event.detail.action;
        mostrar_pagina = false;

        // goto(
        //     `/app/mantenimiento/espacios/${event.detail.action}-${event.detail.fila.id}`
        // );
    }

    async function elegido(event) {
        let x = { ...event.detail };
        dispatch("elegido", x);
        await limpiar_filtro();
    }

    async function actualizar(event) {
        params = { ...event.detail.params };
        await cargar();
    }

    async function limpiar_filtro() {
        params.items.map((i) => {
            i.filtro = "";
            return;
        });
        await cargar();
    }
</script>

<div class="w3-modal" style="display: {display};">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 50px;">
                <div class="w3-display-topleft">
                    <h3>Elegir Espacio.</h3>
                </div>
                <div class="w3-display-right">
                    <button
                        class="w3-btn w3-red"
                        on:click={() => dispatch("salir")}
                    >
                        <i class="fa fa-close" />
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
    </div>
</div>
