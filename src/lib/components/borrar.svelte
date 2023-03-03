<script>
    import { createEventDispatcher } from "svelte";
    export let display = "none";
    export let mensaje = "";
    const dispatch = createEventDispatcher();
</script>

<div class="w3-modal" style="display:{display}">
    <div class="w3-modal-content w3-round">
        <div class="w3-padding">
            <div
                class="w3-display-container"
                style="height:45px; margin-top:10px"
            >
                <div class="w3-display-topright">
                    <button
                        style="cursor: pointer; background-color:transparent; border:none"
                        on:click={() => dispatch("cerrar")}
                    >
                        <i class="fa fa-close w3-btn w3-red" />
                    </button>
                </div>
            </div>
            <div
                class="w3-center w3-text-red w3-large"
                style="font-weight: bold; margin-bottom:20px"
            >
                {mensaje}
            </div>
            <div class="w3-section w3-center">
                <button
                    class="w3-btn w3-red w3-round"
                    on:click={() => dispatch("confirmado")}>Confimar</button
                >
            </div>
        </div>
    </div>
</div>
