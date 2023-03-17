<script lang="ts">
  import { tokenDetail } from "./stores"

  let detail: string
  tokenDetail.subscribe((value:string) => {
    detail = value
  })


</script>

<div class="card">
  <div class="card-header">
    <div class="card-title">
      <h5 class="text-start">Detalles del JWT</h5>
    </div>
  </div>
  <div class="card-body"></div>
  <pre class="card-text">{JSON.stringify(detail, null, 2)}</pre>
</div>
