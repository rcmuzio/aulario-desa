<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Datatable from "$lib/datatable.svelte";
    import { apiFetch } from "$lib/client/api";

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
                name: "tipo_espacio",
                title: "Denominación",
                filtro: "",
            },
            {
                name: "reserva_desc",
                title: "Reservable",
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
            ruta: `/api/mantenimiento/tipo_espacio/consulta`,
            method: "POST",
            token: false,
            body: {
                paginado: params.paginado,
                items: params.items,
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
        goto(
            `/app/mantenimiento/tipo_espacio/${event.detail.action}-${event.detail.fila.id}`
        );
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
            <div class="w3-display-topleft">
                <h3>Tipos de espacios</h3>
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
{/if}
