<script>
    import Horario from "./horario.svelte";

    export let consulta = {
        fecha: "",
        cod_uni: "03",
        vista: 1,
        espacio_id: 0,
        tipo: "semanal",
        confirmada: 1,
        muestra: 1,
    };   
</script>

<Horario {consulta} on:reserva_apuntada on:reservar_evento/>
