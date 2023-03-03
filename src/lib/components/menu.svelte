<script>
    import { sre_usuario } from "$lib/stores";

    function menu(op) {
        console.log(op);
    }
</script>

{#if $sre_usuario.menu.length > 0}
    {#if $sre_usuario.menu.length == 1}
        {#if $sre_usuario.menu[0].items.length == 1}
            <!-- NO MUESTRA MENU NI OPCION -->
        {:else}
            <!-- UN SOLO MENÚ -->
            <div class="w3-bar w3-border-bottom">
                {#each $sre_usuario.menu[0].items as op, i}
                    <!-- <button
                        class="w3-bar-item w3-hover-grey"
                        on:click={() => menu(op)}>{op.titulo}</button
                    > -->
                    <a href={op.ruta} class="w3-bar-item w3-button"
                        >{op.titulo}</a
                    >
                {/each}
            </div>
        {/if}
    {:else}
        <!-- <h4>MÁS DE UN MENÚ</h4> -->
        {#each $sre_usuario.menu as m}
            <div class="w3-dropdown-hover">
                <button class="w3-button ">{m.menu}</button>
                <div
                    class="w3-dropdown-content w3-bar-block w3-border"
                    style="width:400px"
                >
                    {#each m.items as i}
                        <a href={i.ruta} class="w3-bar-item w3-button"
                            >{i.titulo}</a
                        >
                    {/each}
                </div>
            </div>
        {/each}
        <div class="w3-border-top" />
    {/if}
{:else}
    <div class="w3-padding">
        <h4>NO TIENE FUNCIONES DISPONIBLES</h4>
        <h5>Consulte con el administrador.</h5>
    </div>
{/if}

<style>
    button {
        cursor: pointer;
    }
</style>
