<script>
    import { createEventDispatcher } from "svelte";

    export let titulo ='Confirmar acción'
    export let mensaje = "";
    export let display = "none";

    const dispatch = createEventDispatcher();
</script>

<div class="w3-modal" style="display:{display}; z-index:100">
    <div class="w3-modal-content w3-round-large">
        <div class="w3-padding">
            <div
                class="w3-display-container"
                style="height: 40px; margin-top:8px"
            >
                <div
                    class="w3-display-topleft w3-xlarge w3-text-red"
                    style="font-weight: bold;"
                >
                    {titulo}
                </div>
                <div class="w3-display-topright">
                    <i
                        class="fa fa-close w3-btn w3-red w3-text-white"
                        on:click={() => dispatch("cerrar")}
                    />
                </div>
            </div>

            <div
                class="w3-center w3-text-red w3-large"
                style="font-weight: bold; margin-top:20px; margin-bottom:20px"
            >
                {@html mensaje}
            </div>
            <div class="w3-section">
                <div class="w3-row-padding">
                    <div class="w3-half">
                        <button
                            class="w3-btn w3-round w3-blue w3-block" style="margin-top: 16px; font-weight:bold; font-size:16px"
                            on:click={() => dispatch("si")}>Si</button
                        >
                    </div>

                    <div class="w3-half">
                        <button
                            class="w3-btn w3-round w3-red w3-block" style="margin-top: 16px; font-weight:bold; font-size:16px"
                            on:click={() => dispatch("no")}>No</button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    button {
        width: px;
    }
</style>
