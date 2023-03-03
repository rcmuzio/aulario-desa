<script>
    export let dias = [];
</script>

<div style="">
    <div
        style="height:50px; width:50px; background-color: orange; float:left"
    />
    <div
        style="height:50px;  /*background-color:grey; */float:none; display:flex; flex-direction:row; border-top: dotted 1px grey"
    >
        {#each dias as d}
            <div
                style=" height:50px; width:16.6%; z-index:8; border-right:1px dotted grey; border-bottom:1px dotted; color: grey;"
            >
                <div
                    style="padding-top:14px ; text-align:center; font-size:11px"
                >
                    {d.nombre}
                    {d.num_dia}
                    {d.nom_mes}
                </div>
            </div>
        {/each}
    </div>
</div>
