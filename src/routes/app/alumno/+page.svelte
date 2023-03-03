<script>
    import { goto } from "$app/navigation";
</script>

<div style="padding:28px 12px 0px 12px">
    <div class="w3-row-padding w3-xlarge" style="font-weight: bold;">
        <div class="w3-half">
            <div
                class="w3-display-container w3-card-4 w3-hover-text-blue"
                style="margin-bottom: 20px; height:100px; cursor:pointer"
                on:click={() => goto('/app/alumno/agenda')}
            >
                <div class="w3-display-middle">Agenda de clases</div>
            </div>
        </div>
        <div class="w3-half">
            <div
                class="w3-display-container w3-card-4 w3-hover-text-blue"
                style="margin-bottom: 20px; height:100px; cursor:pointer"
                on:click={() => goto('/app/publico/misreservas')}
            >
                <div class="w3-display-middle">Mis reservas</div>
            </div>
        </div>
    </div>
</div>