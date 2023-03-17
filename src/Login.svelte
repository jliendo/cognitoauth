<script lang="ts">
  import axios from "axios";
  import { token_store } from "./stores.js";
  // para login y obtencion de code el url del hosted auth portal de cognito
  let loginUrl =
    "https://apigwuserpool.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=5mfs7nbhink2scatop9evc4s34&response_type=code&scope=email+myapi%2Fprofile_read+myapi%2Fprofile_write+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F";
  let isLogged = false;

  // obtienes los oauth2 tokens a partir del grant de cognito
  async function getTokens(code: string) {
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
      grant_type: "authorization_code",
      client_id: "5mfs7nbhink2scatop9evc4s34",
      redirect_uri: "http://localhost:5173/",
      // el codigo lo actualizamos posteriormente
      code: "",
    };

    // 1. obtener tokes
    interface Tokens {
      id_token: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }
    tokenParams.code = code;
    options.data = tokenParams;
    const client = axios.create();
    try {
      const response = await client<Tokens>(options);
      const id_token = response.data["id_token"];
      const access_token = response.data["access_token"];
      const refresh_token = response.data["refresh_token"];
      const expires_in = response.data["expires_in"];

      // guardamos los tokens en el store
      token_store.set({
        id_token,
        access_token,
        refresh_token,
        expires_in,
      });
      console.log("tokens guardados en store...");

      // nos identificamos como loggeados
      isLogged = true;
    } catch (error) {
      console.log(error);
    }
  }

  function doLogin() {
    isLogged = !isLogged;
    // redirijimos al hosted auth portal de cognito
    location.href = loginUrl;
  }

  // almomento de invocacion buscamos si tenemos el code grant
  // en el query string del url que nos invoco
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("code")) {
    const code: string = urlParams.get("code") || ""; // para dejar tranquilo a TS
    console.log(`code = ${code}`);
    // si tenemos el grant, lo cambiamos por tokens y
    // y los guardamos en el store
    getTokens(code).catch((e) => {
      if (e instanceof Error) console.error(e);
    });
  } else {
    // llamados por primera vez?
    console.log("No code...");
  }
</script>

{#if !isLogged}
  <!-- <button on:click={doLogin}>Login</button> -->
  <button class="btn btn-primary" on:click={doLogin}>Login</button>
{:else}
  <button class="btn btn-primary">Logout</button>
{/if}
