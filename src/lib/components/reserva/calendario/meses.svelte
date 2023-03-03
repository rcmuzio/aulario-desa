<script>
    export let fecha = new Date();
    // $:{console.log('fecha desde meses:',fecha)}
    let mes = fecha.getMonth();
    let meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
</script>

<div>
    <i class="fa fa-minus" />
    <select class="mes" bind:value={mes}>
        {#each meses as m, mi}
            <option value={mi}>{m}</option>
        {/each}
    </select>
    <i class="fa fa-plus" />
</div>

<style>
    .mes {
        font-size: 10px;
    }
</style>
