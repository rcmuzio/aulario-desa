<script>
    import SelectSede from "./seleccionar/select_sede/index.svelte";
    import SelectEdificio from "./seleccionar/select_edificio/index.svelte";
    import SelectHorario from "./seleccionar/select_horario/index.svelte";

    let displaySelectSede = "block";
    let displaySelectEdificio = "none";
    let displaySelectHorario = "none";

    let sede_id = 0;
    let sede;
    let edificio_id = 0;
    let edificio;

    function sede_seleccionada(event) {
        sede_id = event.detail.sede_id;
        sede = event.detail.nombre;
        console.log("SEDE ELEGIDA:", event.detail);
        console.log("id SEDE ELEGIDA:", event.detail.sede_id);
        displaySelectSede = "none";
        displaySelectEdificio = "block";
    }

    function edificio_seleccionado(event) {
        displaySelectEdificio = "none";
        displaySelectHorario = "block";
        edificio_id = event.detail.edificio_id;
        edificio = event.detail.nombre;
    }

    function horario_seleccionado(event) {
        console.log('HORARIO SELECCIONADO:', event)
    }
</script>

<SelectSede
    display={displaySelectSede}
    on:elegido={sede_seleccionada}
    on:cerrar={() => (displaySelectSede = "none")}
/>

<SelectEdificio
    display={displaySelectEdificio}
    {sede_id}
    on:elegido={edificio_seleccionado}
    on:cerrar={() => (displaySelectEdificio = "none")}
/>


<SelectHorario
    display={displaySelectHorario}
    {edificio_id}
    {sede}
    {edificio}
    on:elegido={horario_seleccionado}
    on:cerrar={() => (displaySelectHorario = "none")}
/>
