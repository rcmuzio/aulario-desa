<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { sre_data, sre_usuario } from "$lib/stores";
    
    
    export let data = {error: true, mensaje:'NO SE INICIÓ SESIÓN'};

    console.log('DATA::', data);

    if (browser) {
        
        if (!data.error) {
            
            const {
                usuario, 
                refresh_token,
                unidades, 
                unidades_vinculadas,
                menu,
            } = data;

            sre_usuario.actualizar({
                apenom: usuario.fullName,
                email: usuario.mail,
                logOn: true,
                refresh_token,
                menu,
            })

            sre_data.actualizar({
                unidades,
                unidades_vinculadas,
            })

            localStorage.setItem("ucc-rcm", JSON.stringify({refresh_token}));

            console.log('LOIN +page sre_usuario:', $sre_usuario)
            
            goto("/app");
        }
    }

</script>

{#if data.error}
    <div class="w3-padding">
        {data.mensaje}
    </div>
    <div class="w3-padding">
        <a href="/">
            <button class="w3-btn w3-round w3-red">Continuar</button>
        </a>
    </div>
{/if}
