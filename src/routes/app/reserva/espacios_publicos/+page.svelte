<script>
    import { goto } from "$app/navigation";
    import { apiFetch } from "$lib/client/api";
    import { sre_cod_uni_actual } from "$lib/stores";
    import Datatable from "$lib/datatable.svelte";
    import Horarios from "./horarios.svelte";
    import Config from "./config/index.svelte";
    import Confirmar from "$lib/components/confirmar.svelte";
    import ConfirmarQuitarEspacio from "$lib/components/confirmar.svelte";
    import SelectEspacios from "$lib/components/buscar/espacios.svelte";
    import Mensaje from "$lib/components/mensaje.svelte";

    let anio_academico = new Date().getFullYear();

    let anios = [];

    for (let i = anio_academico; i > 2021; i--) {
        anios.push(i);
    }

    let displayHorarios = "none";
    let displaySelectEspacios = "none";
    let filtroSelectEspacios;

    let espacio_elegido;

    let paramConfirmar = {
        titulo: "Confirmar acción",
        mensaje: "",
        display: "none",
    };

    let paramConfirmarQuitarEspacio = {
        titulo: "Confirmar acción",
        mensaje: "",
        display: "none",
    };

    let paramMensaje = {
        display: "none",
        titulo: "Atención",
        mensajes: ["hola"],
    };

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
                action: "agregar",
                title: "Agregar",
            },
        ],
        btnf: [
            {
                class: "fa fa-calendar-plus-o w3-text-grey w3-hover-text-black",
                action: "asignar_horarios",
                title: "Asignar horarios",
            },
            {
                class: "fa fa-calendar-times-o  w3-text-grey w3-hover-text-black",
                action: "borrar_horarios",
                title: "Borrar hoarios",
            },
            {
                class: "fa fa-close w3-text-grey w3-hover-text-red",
                action: "quitar_espacio",
                title: "Quitar Espacio",
            },
        ],
        items: [
            {
                name: "sede",
                title: "Sede",
                filtro: "",
            },
            {
                name: "edificio",
                title: "Edficio",
                filtro: "",
            },
            {
                name: "planta",
                title: "Planta",
                filtro: "",
            },
            {
                name: "espacio",
                title: "Espacio",
                filtro: "",
            },
            {
                name: "horarios",
                title: "Horarios",
                filtro: "",
            },
            {
                name: "reservadas",
                title: "Reservas",
                filtro: "",
            },
            {
                name: "sis_vigente_desc",
                title: "Vigente",
                filtro: "",
            },
        ],
        filas: [],
    };

    $: {
        anio_academico = anio_academico;
        cargar();
    }

    async function cargar() {
        const res = await apiFetch({
            ruta: "/api/reserva/espacios/publicos",
            method: "POST",
            token: false,
            body: {
                paginado: params.paginado,
                items: params.items,
                cod_uni: $sre_cod_uni_actual,
                anio: anio_academico,
            },
        });

        const jsn = await res.json();

        if (res.ok) {
            if (!jsn.error) {
                params.on = false;
                params.filas = [...jsn.filas];
                params.paginado.registros = jsn.paginado.registros;
                params.paginado.pagina = jsn.paginado.pagina;
                params.paginado.paginas = jsn.paginado.paginas;
            }
        }
    }

    async function actualizar(event) {
        params = { ...event.detail.params };
        await cargar();
    }

    function filas_seleccionadas() {}

    function accion(event) {
        espacio_elegido = { ...event.detail.fila };
        if (espacio_elegido.sis_vigente == 0) {
            paramMensaje.mensajes = ["El espacio no está vigente."];
            paramMensaje.display = "block";
            return;
        }
        switch (event.detail.action) {
            case "agregar":
                displaySelectEspacios = "block";
                break;
            case "quitar_espacio":
                paramConfirmarQuitarEspacio.mensaje = `<div style='text-align:left'>
                    <ul>
                    <li>Se quitará el Espacio si nunca fue reservado.<br></li>
                    <li>Si tiene una o más reservas, no se quitará el Espacio pero dejará de estar Vigente.<br></li>
                    <li>Si el Espacio no está Vigente, nadie lo podrá reservar.<br></li>
                    <li>Si el Espacio deja de estar Vigente, las reservas realizadas no se borran, siguen existiendo.<br>
                    <br></li>
                    </ul>
                    ¿Continua con esta acción?
                    </div>
                `;
                paramConfirmarQuitarEspacio.display = "block";
                break;

            case "asignar_horarios":
                displayHorarios = "block";
                break;
            case "borrar_horarios":
                paramConfirmar.mensaje = `
                    Esta acción solamente borrará los horarios que NO<br>
                    hayan sido reservados en el año académico ${anio_academico}.<br><br>
                    ¿Continua con esta acción?
                `;
                paramConfirmar.display = "block";
                break;
        }
    }

    async function borrar_horarios() {
        const res = await apiFetch({
            ruta: `/api/reserva/espacios_publicos_horarios`,
            method: "DELETE",
            token: false,
            body: {
                cod_uni: $sre_cod_uni_actual,
                anio_academico,
            },
        });

        if (res.ok) {
            const jsn = await res.json();
        } else {
            console.log("ERROR");
        }

        paramConfirmar.display = "none";

        await cargar();
    }

    function elegido(event) {
        console.log(event.detail);
    }

    async function espacioElegido(event) {
        console.log("espacio elegido:", event.detail);
        displaySelectEspacios = "none";
        let e = { ...event.detail };

        await agregar(e);
    }

    async function agregar(espacio) {
        displaySelectEspacios = "none";

        const res = await apiFetch({
            ruta: `/api/reserva/espacios_publicos`,
            method: "POST",
            token: false,
            body: espacio,
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                paramMensaje.mensajes = [jsn.mensaje];
                paramMensaje.display = "block";
            } else {
                await cargar();
            }
        } else {
            paramMensaje.mensajes = ["Se produjo un error inesperado."];
            paramMensaje.display = "block";
        }
    }

    async function quitar_espacio() {
        paramConfirmarQuitarEspacio.display = "none";

        const res = await apiFetch({
            ruta: "/api/reserva/espacios_publicos",
            method: "DELETE",
            token: false,
            body: { ...espacio_elegido },
        });

        await cargar();
    }
</script>

<div class="w3-padding">
    <div class="w3-display-container" style="height: 60px;">
        <div class="w3-display-toplef">
            <h3>Espacios Públicos ({$sre_cod_uni_actual})</h3>
        </div>
        <div class="w3-display-topright">
            <button class="w3-btn w3-red" on:click={() => goto("/app/reserva")}>
                <i class="fa fa-close w3-text-white" />
            </button>
        </div>
    </div>

    <div class="w3-section w3-center">
        <span>Año académico</span>
        <select bind:value={anio_academico}>
            {#each anios as a}
                <option value={a}>{a}</option>
            {/each}
        </select>
    </div>

    <Config />

    <div class="w3-section w3-center w3-hide-small w3-hide-medium">
        Agregue a la lista, los Espacios que pueden ser reservados directamente
        por alumnos y docentes.
    </div>

    <div class="w3-section w3-hide-large ">
        Agregue a la lista, los Espacios que pueden ser reservados directamente
        por alumnos y docentes.
    </div>

    <div class="w3-section">
        <Datatable
            {params}
            on:actualizar={actualizar}
            on:continuar={filas_seleccionadas}
            on:action={accion}
            on:elegido={elegido}
        />
    </div>
</div>

<!-- // <Horarios
//     anio={anio_academico}
//     espacio={espacio_elegido}
//     display={displayHorarios}
//     on:cerrar={() => (displayHorarios = "none")}
// /> -->

<Horarios
    anio={anio_academico}
    espacio={espacio_elegido}
    display={displayHorarios}
    on:cerrar={() => (displayHorarios = "none")}
/>

<Confirmar
    param={paramConfirmar}
    on:no={() => (paramConfirmar.display = "none")}
    on:si={borrar_horarios}
/>

<ConfirmarQuitarEspacio
    param={paramConfirmarQuitarEspacio}
    on:no={() => (paramConfirmarQuitarEspacio.display = "none")}
    on:si={quitar_espacio}
/>

<Mensaje
    param={paramMensaje}
    on:continuar={() => (paramMensaje.display = "none")}
/>

<SelectEspacios
    display={displaySelectEspacios}
    cod_uni={$sre_cod_uni_actual}
    on:elegido={espacioElegido}
    on:cerrar={() => (displaySelectEspacios = "none")}
/>
