<script>
  import axios from "axios";
  import { token_store } from "./stores.js";

  // array de transacciones
  let txs = [""]
  let response;

  async function getTransactions() {

    const url =
      "https://zr1lpctya8.execute-api.us-east-1.amazonaws.com/test/gettransactions";
    let access_token = "";
    let expires_in = 0;
    console.log(`expires_in = ${expires_in}`);

    token_store.subscribe((value) => {
      access_token = value.access_token;
      expires_in = value.expires_in;
    });

    const headers = {
      Authorization: access_token,
      "Access-Control-Allow-Origin": "*",
    };
    const options = {
      url,
      method: "get",
      headers,
    };
    const client = axios.create();
    try {
      response = await client(options);
      let data = "";
      if(response.status == 401) {
        console.log(response.status)
        console.log(response.statusText)
        data = "Acceso no autorizado"
      } else {
        data = response?.data.body
      }
      console.log(data);
      // agregamos la respuesta a las txs que ya tenemos
      txs = [...txs, [data]]
    } catch (error) {
      console.log(error);
    }
  }
</script>

<button class="btn btn-primary" on:click={getTransactions}>Traer transacción</button>

<table class="table mt-3">
  <thead>
    <th>Transacciones</th>
  </thead>
    <tbody>
    {#each txs as row }
    <tr>
        {#each row as cell}
      <td>
        { cell }
      </td>
      {/each}
    </tr>
    {/each}
  </tbody>
</table>
