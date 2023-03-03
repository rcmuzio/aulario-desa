<script>
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import Datatable from "$lib/datatable.svelte";
    import Formulario from "./fromulario/index.svelte";

    let error = false;
    let error_mensaje = "";

    let mostrar_pagina = true;
    let fila_elegida;
    let accion_elegida = "";

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
                name: "planta",
                title: "Planta",
                filtro: "",
            },
            {
                name: "monitor",
                title: "Monitor",
                filtro: "",
            },
            {
                name: "unidad",
                title: "Unidad",
                filtro: "",
            },
        ],
        filas: [],
    };

    onMount(async () => {
        cargar();
    });

    async function cargar() {
        mostrar_pagina = true;
        const res = await apiFetch({
            ruta: `/api/mantenimiento/monitores/consulta`,
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
            console.log("Se produjo un error inesperado.");
        }
    }

    function filas_seleccionadas(event) {
        //alert('seleccionada')
        //console.log(event.detail);
    }

    function accion(event) {
        
        if(event.detail.action=='Agregar'){
            fila_elegida = undefined
        }else{
            fila_elegida = { ...event.detail.fila };
        }
        
        accion_elegida = event.detail.action;
        mostrar_pagina = false;
    }

    function elegido(event) {
        //alert('elegido')
        //console.log("elegido:", event.detail);
    }

    async function actualizar(event) {
        //alert('actualizar')
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
                <h3>Monitores</h3>
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
    <Formulario
        FILA={fila_elegida}
        ACCION={accion_elegida}
        on:actualizar={() => cargar()}
    />
{/if}
