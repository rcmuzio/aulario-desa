<script>
    import { createEventDispatcher } from "svelte";
    export let display = "none";
    export let mensajes = [];
    const dispatch = createEventDispatcher();
</script>

<div class="w3-modal" style="display: {display};">
    <div class="w3-content w3-white w3-round">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 60px;">
                <div class="w3-display-topright">
                    <button
                        class="w3-btn w3-red"
                        on:click={() => dispatch("salir")}
                    >
                        <i class="fa fa-close w3-text-white" />
                    </button>
                </div>
            </div>
            <div style="padding:2px">
                <ul class="w3-text-red">
                    {#each mensajes as m}
                        <li>{@html m}</li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>
