<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let display = "none";
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content w3-round" style="max-width: 400px;">
        <div class="w3-padding">
            <div class="w3-display-container" style="height: 45px;">
                <div class="w3-display-topright">
                    <i
                        class="fa fa-close w3-btn w3-red"
                        on:click={() => dispatch("salir")}
                    />
                </div>
            </div>
            <div
                class="w3-large"
                style="font-weight:bold; color:red; text-align:center; padding-top:20px; padding-bottom:40px"
            >
                Acceso Restringido
            </div>
        </div>
    </div>
</div>
