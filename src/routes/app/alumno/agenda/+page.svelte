<script>
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import { goto } from "$app/navigation";
    import Datatable from "$lib/datatable.svelte";
    import { fecha } from "$lib/variables";

    let error = false;
    let error_mensaje = "";

    let fecha_elegida = fecha;

    let params = {
        on: false,
        paginado: {
            ok: true,
            pagina: 1,
            paginas: 1,
            rxp: 10,
            registros: 1,
        },
        action: "consulta",
        widthcolbtns: "40px",
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
                name: "unidad",
                title: "Unidad",
                filtro: "",
            },
            {
                name: "carrera",
                title: "Carrera",
                filtro: "",
            },
            {
                name: "materia",
                title: "Materia",
                filtro: "",
            },
            {
                name: "descri",
                title: "Descripción",
                filtro: "",
            },
            {
                name: "horario",
                title: "Horario",
                filtro: "",
            },
            {
                name: "sede",
                title: "Sede",
                filtro: "",
            },
            {
                name: "edificio",
                title: "Edificio",
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
        ],
        filas: [],
    };

    $:{
        fecha_elegida=fecha_elegida;
        cargar();
    }

    // onMount(async () => {
    //     cargar();
    // });

    async function cargar() {
        const res = await apiFetch({
            ruta: `/api/alumnos/agenda`,
            method: "POST",
            token: false,
            body: {
                paginado: params.paginado,
                items: params.items,
                fecha: fecha_elegida,
            },
        });

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
            console.log("ERROR");
        }
    }

    function filas_seleccionadas(event) {
        console.log(event.detail);
    }

    function accion(event) {
        const { action, fila } = event.detail;
        goto(`/app/mantenimiento/sedes/${action}-${fila.id}`);
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
{:else}
    <div class="w3-padding">
        <div class="w3-display-container" style="height: 50px;">
            <!-- <div class="w3-display-topleft">
                <h3>Agenda Académica</h3>
            </div> -->
            <div class="w3-display-toplef w3-text-indigo">
                <h3 style="font-weight: bold;">Agenda Académica</h3>
            </div>
            <div class="w3-display-right">
                <a href="/app">
                    <button class="w3-btn w3-red">
                        <i class="fa fa-close" />
                    </button></a
                >
            </div>
        </div>

        <div class="w3-section">
            Se muestran las actividades que se desarrollan en las unidades académicas en las cuales estás inscripto.
        </div>

        <div class="w3-section w3-text-blue">
            Fecha: <input type="date" class="w3-text-blue" style="border: none; font-weight: bold" bind:value={fecha_elegida}>
        </div>

        <Datatable
            {params}
            on:continuar={filas_seleccionadas}
            on:action={accion}
            on:elegido={elegido}
            on:actualizar={actualizar}
        />
    </div>
{/if}
