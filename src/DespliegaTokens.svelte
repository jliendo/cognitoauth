<script lang="ts">
  import axios from "axios";
  import jwt_decode from "jwt-decode";
  import { token_store, tokenDetail } from "./stores.js";

  let access_token = "";
  let id_token = "";
  let refresh_token = "";
  let expires_in = 0;

  interface Tokens {
    id_token: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }

  token_store.subscribe((value) => {
    access_token = value.access_token;
    id_token = value.id_token;
    refresh_token = value.refresh_token;
    expires_in = value.expires_in;
  });

  async function refreshTokens() {
    // para fetch de tokens
    const url =
      "https://apigwuserpool.auth.us-east-1.amazoncognito.com/oauth2/token";
    const headers = {
      "Content-type": "application/x-www-form-urlencoded",
    };

    const options = {
      url,
      method: "POST",
      headers,
      // el body lo actualizamos posteriormente
      data: {},
    };
    const tokenParams = {
      grant_type: "refresh_token",
      client_id: "5mfs7nbhink2scatop9evc4s34",
      refresh_token: refresh_token,
    };

    options.data = tokenParams;
    const client = axios.create();
    try {
      const response = await client<Tokens>(options);
      console.log(response);
      const id_token = response.data["id_token"];
      const access_token = response.data["access_token"];
      const expires_in = response.data["expires_in"];

      // guardamos los tokens en el store
      token_store.set({
        id_token,
        access_token,
        refresh_token,
        expires_in,
      });
      console.log("tokens refrescados guardados en store...");
    } catch (error) {
      console.log(error);
    }
  }

  // va marcando cuantos segundos le quedan al token
  const t = setInterval(() => {
    if (expires_in > 0) {
      expires_in--;
    } else {
      clearInterval(t);
    }
  }, 1000);

  // funcion para simplificar impresion de token
  const tokenShortener = (token: string) => {
    const size = 8;
    let label = "";
    if (token) {
      label = `${token.slice(0, size)}...${token.slice(token.length - size)}`;
    } else {
      label = "(Sin token)";
    }
    return label;
  };

  const getTokenDetail = (token: string) => {
    const decoded = jwt_decode(token);
    console.log(decoded);
    tokenDetail.set(decoded);
  };

  console.log(`expires_in = ${expires_in}`);
</script>

<div id="token-card">
  <div class="card">
    <div class="card-header">
      <h5 class="text-start">Tokens</h5>
    </div>
    <div class="card-body">
      <p class="card-text text-start fs-6" />
      <table class="table text-start">
        <thead>
          <th>Tipo</th>
          <th>JWT</th>
          <th>TTL</th>
        </thead>
        <tbody>
          <tr>
            <td>Identity</td>
            <td
              ><a href={"#"} on:click={() => getTokenDetail(id_token)}
                >{tokenShortener(id_token)}</a
              ></td
            >
            <td>{expires_in} segs.</td>
          </tr>
          <tr>
            <td>Acceso</td>
            <td
              ><a href={"#"} on:click={() => getTokenDetail(access_token)}
                >{tokenShortener(access_token)}</a
              ></td
            >
            <td>{expires_in} segs.</td>
          </tr>
          <tr>
            <td>Refresh</td>
            <td>{tokenShortener(refresh_token)}</td>
            <td
              ><button class="btn btn-outline-success" on:click={refreshTokens}
                >Refrescar tokens</button
              ></td
            >
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
