<script>
    import { page } from '$app/stores';
  </script>
  
  <h1>{$page.status}: {$page.error.message}</h1>
  <h2>El id no es válido</h2>
  <a href="/app/mantenimiento/edificios">Volver</a>