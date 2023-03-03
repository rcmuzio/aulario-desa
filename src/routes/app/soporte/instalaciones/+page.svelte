<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { apiFetch } from "$lib/client/api";
    import Datatable from "$lib/datatable.svelte";

    import Formulario from "./formulario/index.svelte";

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
        },
        action: "crud",
        widthcolbtns: "100px",
        btnh: [
            {
                class: "fa fa-print w3-text-brown",
                action: "Imprimir",
                title: "Imprimir",
            },
        ],
        btnf: [
            {
                class: "fa fa-pencil w3-text-green",
                action: "Editar",
                title: "Editar",
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
                name: "equipos",
                title: "Equipos",
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
        const res = await apiFetch({
            ruta: `/api/soporte/instalaciones/consulta`,
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

    function elegido(event) {
        console.log("elegido:", event.detail);
    }

    async function actualizar(event) {
        params = { ...event.detail.params };
        await cargar();
    }
</script>

{#if error}
    <div class="w3-padding">
        <div class="w3-center w3-text-red">
            <h3>{error_mensaje}</h3>
        </div>
    </div>
{:else if mostrar_pagina}
    <div class="w3-padding">
        <div class="w3-display-container" style="height: 50px;">
            <div class="w3-display-topleft">
                <h3>Equipamiento instalado</h3>
            </div>
            <div class="w3-display-right">
                <a href="/app">
                    <button class="w3-btn w3-red">
                        <i class="fa fa-close" />
                    </button></a
                >
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
{:else}
    <Formulario FILA={espacio_elegido} ACCION={espacio_accion} on:actualizar={cargar} />
{/if}
