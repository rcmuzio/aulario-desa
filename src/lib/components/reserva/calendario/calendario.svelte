<script>
    //import Anios from "./anios.svelte";
    //import Meses from "./meses.svelte";
    import Dias from "./dias.svelte";

    export let fecha = ""; //new Date()
    export let displaySelectMuestra = 'block'
    // $: {
    //     console.log("fecha desde calendario:", fecha);
    // }
</script>

<!-- <Anios /> -->
<!-- <Meses {fecha}/> -->
<Dias strfecha={fecha} {displaySelectMuestra} on:fecha on:cambia_muestra />
