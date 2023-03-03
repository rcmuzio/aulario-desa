<script>
    import { onMount, createEventDispatcher } from "svelte";
    import Datatable from "$lib/datatable.svelte";

    const dispatch = createEventDispatcher();

    export let display = "none";
    export let cod_uni = "00";

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
                name: "espacio",
                title: "Espacio",
                filtro: "",
            },
        ],
        filas: [],
    };

    $:{
        if(cod_uni!='00') cargar()
    }

    onMount(async () => {
        await cargar();
    });

    async function cargar() {
        const res = await fetch(`/api/publico/buscar/espacios`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                paginado: params.paginado,
                items: params.items,
                cod_uni
            }),
        });

        if (res.ok) {
            const jsn = await res.json();
            params.on = false;
            params.paginado.pagina=jsn.paginado.pagina;
            params.paginado.paginas=jsn.paginado.paginas;
            params.paginado.registros=jsn.paginado.registros;
            params.filas = [...jsn.filas];

            
        }
    }

    async function actualizar(event) {
        params = event.detail.params;
        console.log(params);
        await cargar();
    }
</script>

<div class="w3-modal" style="display: {display}">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 60px;">
                <div class="w3-display-topleft w3-text-blue">
                    <h4>Elegir Espacio</h4>
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
