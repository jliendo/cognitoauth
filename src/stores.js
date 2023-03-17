import { writable } from "svelte/store";

export const token_store = writable({
  id_token: "",
  access_token: "",
  refresh_token: "",
  expires_in: 0,
});

export const tokenDetail = writable()
