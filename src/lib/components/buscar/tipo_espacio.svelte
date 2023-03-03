<script>
    import { onMount, createEventDispatcher } from "svelte";
    import Datatable from "$lib/datatable.svelte";
    import { apiFetch } from "$lib/client/api";

    const dispatch = createEventDispatcher();

    export let display = "none";

    let error = false;
    let error_mensaje = "";

    let params = {
        on: true,
        paginado: {
            ok: true,
            pagina: 1,
            paginas: 1,
            rxp: 10,
            registros: 1,
        },
        action: "radio",
        widthcolbtns: "50px",
        btnh: [],
        btnf: [],
        items: [
            {
                name: "tipo_espacio",
                title: "Denominación",
                filtro: "",
            },
        ],
        filas: [],
    };

    onMount(async () => {
        await cargar();
    });

    async function cargar() {

        const res = await apiFetch({
            ruta: `/api/mantenimiento/tipo_espacio/consulta`,
            method: "POST",
            token: false,
            body: params,
        });

        if (res.ok) {
            const jsn = await res.json();
            if (jsn.error) {
                error_mensaje = "No tiene permiso para utilizar esta ventana.";
                error = true;
            } else {
                params.on = false;
                params.filas = [...jsn.filas];
            }
        }
    }

    async function actualizar(event) {
        params = event.detail.params;
        console.log(params);
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
    <div class="w3-modal" style="display: {display}">
        <div class="w3-modal-content w3-round">
            <div class="w3-padding">
                <div class="w3-display-container" style="height: 60px;">
                    <div class="w3-display-topleft w3-text-blue">
                        <h4>Elegir tipo de espacio</h4>
                    </div>
                    <div class="w3-display-right">
                        <button
                            class="w3-btn w3-red"
                            on:click={() => dispatch("cerrar")}
                        >
                            <i class="fa fa-close" />
                        </button>
                    </div>
                </div>
                <div class="w3-margin-bottom">
                    <Datatable {params} on:actualizar={actualizar} on:elegido />
                </div>
            </div>
        </div>
    </div>
{/if}
