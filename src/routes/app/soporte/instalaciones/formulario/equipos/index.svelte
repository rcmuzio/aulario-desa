<script>
    import Mensaje from "$lib/components/mensaje.svelte";
    import Confirmar from "$lib/components/borrar.svelte";
    import Formulario from "./formulario/index.svelte";
    import { apiFetch } from "$lib/client/api";

    export let espacio_id = 0;

    let equipos = [];
    let equipo;
    let display = "none";

    let registro = {};
    let params = {};

    let displayMensaje = "none";
    let displayConfirmar = "none";
    let mensaje = "";

    let paramsFormulario = {
        display: "none",
        accion: "POST",
        color: "blue",
        titulo: "Agregar",
        boton_titulo: "Grabar",
        readonly: false,
    };

    $: {
        cargar();
    }

    async function cargar() {
        if (espacio_id == 0) return;
        const res = await apiFetch({
            ruta: `/api/soporte/instalaciones/equipos?espacio_id=${espacio_id}`,
            method: "GET",
            token: false,
            body: "",
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                mensaje = jsn.error;
                displayMensaje = "block";
            } else {
                equipos = [...jsn.filas];
            }
        } else {
            mensaje =
                "Se produjo un error inesperado. Intente nuevamente más tarde.";
            displayMensaje = "block";
        }
    }

    function confirmar(e) {
        equipo = e;
        mensaje = "¿Confirma la eliminación del registro seleccionado?";
        displayConfirmar = "block";
    }

    async function borrar() {
        displayConfirmar = "none";

        const res = await apiFetch({
            ruta: `/api/soporte/instalaciones/equipos`,
            method: "DELETE",
            token: false,
            body: { id: registro.id },
        });

        if (res.ok) {
            await cargar();
        } else {
            mensaje =
                "Se produjo un error inesperado. Intente nuevamente más tarde.";
            displayMensaje = "block";
        }
    }

    async function cargar_equipos() {
        params.display = "none";
        await cargar();
    }
</script>

<div>Equipos instalados:</div>
<div class="w3-responsive ">
    <table class="w3-table-all">
        <thead>
            <tr>
                <td width="50px" colspan="2">
                    <button
                        style="cursor: pointer; border: none; background-color:transparent"
                        title="Agregar"
                        on:click={() => {
                            registro = {
                                id: 0,
                                espacio_id,
                                equipo_id: 0,
                                nombre: "",
                                marca: "",
                                modelo: "",
                                descri: "",
                                stock: "",
                            };
                            paramsFormulario = {
                                display: "block",
                                accion: "POST",
                                color: "blue",
                                titulo: "Agregar",
                                boton_titulo: "Grabar",
                                readonly: false,
                            };
                        }}
                    >
                        <i class="fa fa-plus w3-text-blue" />
                    </button>
                </td>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Cantidad</th>
            </tr>
        </thead>
        <tbody>
            {#each equipos as e}
                <tr>
                    <td width="25px">
                        <button
                            style="cursor: pointer; border:none; background-color:transparent"
                            title="Modificar"
                            on:click={() => {
                                registro = {
                                    id: e.id,
                                    espacio_id: e.espacio_id,
                                    equipo_id: e.equipo_id,
                                    equipo: e.equipo,
                                    marca: e.marca,
                                    modelo: e.modelo,
                                    stock: e.stock
                                };
                                paramsFormulario = {
                                    display: "block",
                                    accion: "PUT",
                                    color: "green",
                                    titulo: "Modificar",
                                    boton_titulo: "Grabar",
                                };
                            }}
                        >
                            <i class="fa fa-pencil w3-text-green" />
                        </button>
                    </td>
                    <td width="25px">
                        <button
                            style="cursor: pointer; border:none; background-color:transparent
                            
                            "
                            title="Borrar"
                            on:click={() => {
                                registro = { ...e };
                                confirmar(e);
                            }}
                        >
                            <i class="fa fa-trash-o w3-text-red" />
                        </button>
                    </td>
                    <td>{e.equipo}</td>
                    <td>{e.marca}</td>
                    <td>{e.modelo}</td>
                    <td>{e.stock}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<Formulario
    params={paramsFormulario}
    {registro}
    on:salir={()=>{
        paramsFormulario.display='none';
        cargar();
    }}
    on:actualizar={()=>{
        paramsFormulario.display='none';
        cargar();
    }}
/>

<Mensaje
    display={displayMensaje}
    {mensaje}
    on:cerrar={() => (displayMensaje = "none")}
/>

<Confirmar
    display={displayConfirmar}
    {mensaje}
    on:cerrar={() => (displayConfirmar = "none")}
    on:confirmado={() => borrar()}
/>
