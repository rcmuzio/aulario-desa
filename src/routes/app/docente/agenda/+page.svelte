<script>
    import { onMount } from "svelte";
    import { apiFetch } from "$lib/client/api";
    import { goto } from "$app/navigation";
    import { fecha } from "$lib/variables";
    import Datatable from "$lib/datatable.svelte";

    let error = false;
    let error_mensaje = "";

    let tipo = 1;

    let fecha_elegida = fecha;
    
    let tipos = [
        { valor: 1, descri: "Mi agenda" },
        { valor: 2, descri: "Agenda materias" },
    ];

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
                name: "docente",
                title: "Docente",
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

    onMount(async () => {
        cargar();
    });

    $:{
        tipo=tipo;
        fecha_elegida=fecha_elegida;
        cargar();
    }

    async function cargar() {
        const res = await apiFetch({
            ruta: `/api/docentes/agenda`,
            method: "POST",
            token: false,
            body: {
                paginado: params.paginado,
                items: params.items,
                fecha: fecha_elegida,
                tipo,
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
            {#each tipos as t}
                <input type="radio" name="tipo" bind:group={tipo} value={t.valor}/>
                <span class="rotulo w3-text-blue" style="margin-right:10px">{t.descri}</span>
            {/each}
            <input type="date" bind:value={fecha_elegida} class="w3-text-blue" style="border:none">
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
