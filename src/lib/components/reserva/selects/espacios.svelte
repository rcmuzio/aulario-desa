<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { sre_reserva } from "$lib/stores"
    import { apiFetch } from "$lib/client/api";

    export let cod_uni = "00";
    export let solo_lectura = false;
    // export let espacio_id = "0";

    let espacio_id=0;
    
    const dispatch = createEventDispatcher();
    let espacios = [];

    let otros_espacios = [
        {id:'0', nombre: '*** Todos ***', cod_uni:$sre_reserva.cod_uni},
        {id:'PU', nombre: '*** Públicos ***', cod_uni:$sre_reserva.cod_uni},
        {id:'PO', nombre: '*** Públicos reservados ***', cod_uni:$sre_reserva.cod_uni},
    ]

    $: if (cod_uni != "00") {
        cargar();
    }

    onMount(async () => {
        await cargar();
    });

    async function cargar() {
        // const res = await apiFetch({
        //     ruta:
        //         "/aulario/mantenimiento/espacios/idNombrePorCodUni?cod_uni=" + cod_uni,
        //     method: "GET",
        //     body: "",
        // });

        // const res = await fetch(
        //     `/api/mantenimiento/espacios/idNombrePorCodUni`,
        //     {
        //         method: "POST",
        //         body: JSON.stringify({ cod_uni }),
        //     }
        // );

        const res = await apiFetch({
            ruta: `/api/publico/buscar/espacios/por_cod_uni`,
            method: "POST",
            token: false,
            body: { cod_uni, filtros:['reservables'] }
        })

        const jsn = await res.json();

        if (res.ok) {
            console.log('ESPACIOS:', jsn)
            espacios = [...otros_espacios,  ...jsn.espacios];
        } else {
            alert("NO RECUPERÓ ESPACIOS");
        }

        espacio_id = 0;
    }

    function cambia() {
        
        dispatch("cambia_espacio", { espacio_id });
        let x = {...$sre_reserva}
       
        x.espacio_id=espacio_id
        // sre_reserva.actualizar()
    }
</script>

<label for="espacio_id">Espacios predeterminados:</label>
<select
    name="espacio_id"
    id="espacio_id"
    class="w3-input w3-round w3-light-grey "
    bind:value={espacio_id}
    disabled={solo_lectura}
    on:change={cambia}
>
    <!-- <option value="0">*** Todos ***</option>
    <option value="PU">*** Públicos ***</option>
    <option value="PO">*** Públicos reservados ***</option> -->
    {#each espacios as s}
        <option value={s.id}>{s.nombre}</option>
    {/each}
</select>
