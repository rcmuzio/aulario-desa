<script>
    let registro = {
        sede: "",
    };
    let horarios = {
        dias: [0, 0, 0, 0, 0, 0],
        hdesde: "",
        hhasta: "",
    };
    let serie = {
        espacio_id: 0,
        sede: "",
        edificio: "",
        espacio: "",
        cod_uni: "",
        cod_car: "",
        cod_mate: "",
        cod_prof: "",
        descri: "",
        asistentes: 0,
        fdesde: "",
        fhasta: "",
        horarios: [],
    };
</script>

<div class="w3-container">
    <h2>Serie - </h2>
    <h3>Ubicación</h3>
    <hr>
    <div class="w3-section">
        <label for="sede">Ubicación:</label>
        <input
            type="text"
            name="sede"
            class="w3-input w3-round w3-light-grey"
            readonly
            bind:value={registro.sede}
        />
    </div>
    <div class="w3-section">
        <label for="edificio">Edificio:</label>
        <input
            type="text"
            name="edificio"
            class="w3-input w3-round w3-light-grey"
            readonly
            bind:value={registro.edificio}
        />
    </div>
    <div class="w3-section">
        <label for="espacio">Espacio:</label>
        <input
            type="text"
            name="espacio"
            class="w3-input w3-round w3-light-grey"
            readonly
            bind:value={registro.espacio}
        />
    </div>
  
    <div class="w3-row-padding">
        <div class="w3-third">
            <label for="planta">Planta:</label>
            <input
                type="text"
                name="planta"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.planta}
            />
        </div>
        <div class="w3-third">
            <label for="sede">Capacidad:</label>
            <input
                type="text"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.capacidad}
            />
        </div>
        <div class="w3-third">
            <label for="sede">Capacidad autorizada:</label>
            <input
                type="text"
                class="w3-input w3-round w3-light-grey"
                readonly
                bind:value={registro.capacidad_autorizada}
            />
        </div>
    </div>
</div>

<div class="w3-container">
    <h3>Actividad</h3>
    <hr>
    <div class="w3-section">
        <label for="unidad">Unidad:</label>
        <input
            type="text"
            name="unidad"
            class="w3-input w3-round w3-light-grey"
            readonly
            bind:value={registro.unidad}
        />
    </div>
    <div class="w3-section">
        <label for="carrera">Carrera:</label>
        <input
            type="text"
            name="carrera"
            class="w3-input w3-round w3-light-grey"
            readonly
            bind:value={registro.carrera}
        />
    </div>
    <div class="w3-section">
        <label for="materia">Materia:</label>
        <input
            type="text"
            name="materia"
            class="w3-input w3-round w3-light-grey"
            readonly
            bind:value={registro.materia}
        />
    </div>
    <div class="w3-section">
        <label for="docente">Docente:</label>
        <input
            type="text"
            name="docente"
            class="w3-input w3-round w3-light-grey"
            readonly
            bind:value={registro.docente}
        />
    </div>
</div>