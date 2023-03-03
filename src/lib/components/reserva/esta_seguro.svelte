<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let display = "none";
</script>

<div class="w3-modal" style="display: {display};">
    <div class="w3-modal-content w3-round" style="max-width: 400px;">
        <div class="w3-padding">
            <h3>Confirmar acción</h3>
            <div
                class="w3-center w3-text-red w3-large"
                style="padding-top:30px; padding-bottom:30px"
            >
                ¿Está seguro?
            </div>
            <div class="w3-row-padding">
                <div class="w3-half">
                    <button
                        class="w3-btn w3-round w3-red w3-left"
                        on:click={() => dispatch("si")}>Si</button
                    >
                </div>
                <div class="w3-half">
                    <button
                        class="w3-btn w3-round w3-blue w3-right"
                        on:click={() => dispatch("no")}>No</button
                    >
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    button {
        width: 60px;
    }
</style>
