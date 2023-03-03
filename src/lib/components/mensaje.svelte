<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let param = {
        display: "none",
        titulo: "Atención",
        mensajes: ["hola"],
    };
</script>

<div class="w3-modal" style="display: {param.display};">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 40px;"> 
                <div class="w3-display-toplef">
                    <h3>{param.titulo}</h3>
                </div>
                <div class="w3-display-right">
                    <button class="w3-btn w3-red" on:click={() => dispatch("continuar")}>
                        <i class="fa fa-close"></i>
                    </button>
                </div>
            </div>
            
            <ul class="w3-text-red">
                {#each param.mensajes as m}
                    <li>{@html m}</li>
                {/each}
            </ul>
        </div>
    </div>
</div>
