<script>
    import Horarios from "./horarios.svelte";
    export let horarios = [];
    import Agregar from "./agregar.svelte";
    let displayAgregar = "none";

    function agregar(event) {
        displayAgregar = "none";
    }
</script>

<div class="w3-container">
    <h3>Horarios</h3>
    <div class="w3-responsive">
        <table
            width="90%"
            cellpadding="5"
            align="center"
            border="1"
            style="align:center; border-collapse: collapse; border-spacing: 10px  border: 1px solid grey"
        >
            <thead>
                <tr>
                    <td rowspan="2" align="center">
                        <button
                            style="background-color:transparent; border:none; cursor:pointer"
                            on:click={() => (displayHorario = "block")}
                        >
                            <i class="fa fa-plus w3-large" /></button
                        >
                    </td>
                    <td colspan="2">Horario</td>
                    <td colspan="7">Días</td>
                </tr>
                <tr>
                    <td>Desde</td>
                    <td>Hasta</td>
                    <td>Dom</td>
                    <td>Lun</td>
                    <td>Mar</td>
                    <td>Mie</td>
                    <td>Jue</td>
                    <td>Vie</td>
                    <td>Sab</td>
                </tr>
            </thead>
            <tbody>
                <Horarios {horarios} />
            </tbody>
        </table>
    </div>
</div>

<Agregar
    display={displayAgregar}
    on:salir={() => (displayAgregar = "none")}
    on:agregar={agregar}
/>
