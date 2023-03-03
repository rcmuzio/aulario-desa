<script>
    import { sre_usuario } from "$lib/stores";
    import Mensaje from "$lib/components/mensaje.svelte";
    import Confirmar from "$lib/components/borrar.svelte";
    import Formulario from "./formulario/index.svelte";
    import { apiFetch } from "$lib/client/api";

    export let espacio_id = 0;

    let articulos = [];
    let articulo;
    let display = "none";

    let registro = {};
    let params = {};

    let displayMensaje = "none";
    let displayConfirmar = "none";
    let mensaje = "";

    // let headers = new Headers();
    // headers.append("Content-Type", "application/json");
    // headers.append("Accept", "application/json");

    $: {
        cargar();
    }

    async function cargar() {
        if (espacio_id == 0) return;
        const res = await apiFetch({
            ruta: `/api/mantenimiento/espacios/articulos?espacio_id=${espacio_id}`,
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
                articulos = [...jsn.filas];
            }
        } else {
            mensaje =
                "Se produjo un error inesperado. Intente nuevamente más tarde.";
            displayMensaje = "block";
        }
    }

    // async function articulo_elegido(event) {
    //     let existe = 0;
    //     let articulo = event.detail;
    //     articulos.map((e) => {
    //         if (e.id == articulo.id) existe++;
    //     });

    //     if (existe > 0) {
    //         display = "none";
    //         return;
    //     }

    //     const res = await fetch(`/api/articulos/instalados`, {
    //         method: "POST",
    //         headers,
    //         body: JSON.stringify({
    //             espacio_id,
    //             articulo_id: articulo.id,
    //             username: $sre_usuario.username,
    //         }),
    //     });

    //     if (res.ok) {
    //         const jsn = await res.json();
    //         if (jsn.error) {
    //             mensaje = jsn.error;
    //             displayMensaje = "block";
    //         } else {
    //             await cargar();
    //         }
    //     } else {
    //         mensaje =
    //             "Se produjo un error inesperado. Intente nuevamente más tarde.";
    //         displayMensaje = "block";
    //     }
    // }

    function confirmar(e) {
        articulo = e;
        mensaje = "¿Confirma la eliminación del artículo seleccionado?";
        displayConfirmar = "block";
    }

    async function borrar() {
        displayConfirmar = "none";

        const res = await apiFetch({
            ruta: `/api/mantenimiento/espacios/articulos`,
            method: "DELETE",
            token: false,
            body: { id: registro.id },
        });

        if (res.ok) {
            // const jsn = await res.json();
            // if (jsn.error) {
            //     mensaje = jsn.error;
            //     displayMensaje = "block";
            // } else {
            await cargar();
            // }
        } else {
            mensaje =
                "Se produjo un error inesperado. Intente nuevamente más tarde.";
            displayMensaje = "block";
        }
    }

    async function cargar_articulos() {
        params.display = "none";
        await cargar();
    }
</script>

<div>Artículos instalados:</div>
<div class="w3-responsive">
    <table class="w3-table-all">
        <thead>
            <tr>
                <td width="50px" colspan="2">
                    <button
                        style="cursor: pointer; border:none; background-color:transparent"
                        title="Agregar"
                        on:click={() => {
                            registro = {
                                id: 0,
                                espacio_id,
                                articulo_id: 0,
                                tipo: "",
                                articulo: "",
                                stock: "",
                            };
                            params = {
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
                <th>Tipo</th>
                <th>Articulo</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            {#each articulos as e}
                <tr>
                    <td width="25px">
                        <button
                            style="cursor: pointer; background-color:transparent; border:none"
                            title="Modificar"
                            on:click={() => {
                                registro = {
                                    id: e.id,
                                    espacio_id: e.espacio_id,
                                    articulo_id: e.articulo_id,
                                    tipo: e.tipo,
                                    articulo: e.articulo,
                                    stock: e.stock,
                                };
                                params = {
                                    display: "block",
                                    accion: "PUT",
                                    color: "green",
                                    titulo: "Modificar",
                                    boton_titulo: "Grabar",
                                };
                            }}
                            ><i class="fa fa-pencil w3-text-green" />
                        </button>
                    </td>
                    <td width="25px">
                        <button
                            style="cursor: pointer; border:none; background-color:transparent"
                            title="Borrar"
                            on:click={() => {
                                registro = { ...e };
                                confirmar(e);
                            }}
                            ><i class="fa fa-trash-o w3-text-red" />
                        </button>
                    </td>
                    <td>{e.tipo}</td>
                    <td>{e.articulo}</td>
                    <td>{e.stock}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<Formulario
    {params}
    {registro}
    on:salir={cargar_articulos}
    on:actualizar={cargar_articulos}
/>

<!-- <SelectTipoArticulo
    {display}
    on:elegido={articulo_elegido}
    on:salir={() => (display = "none")}
/> -->

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
