import Login from "./Login.svelte";
import DespliegaToken from "./DespliegaTokens.svelte";
import Transacciones from "./Transacciones.svelte";
import DetalleToken from "./DetalleToken.svelte";
const login = new Login({
    target: document.getElementById("login")
});
const displayTokens = new DespliegaToken({
    target: document.getElementById("despliega-token")
});
const txs = new Transacciones({
    target: document.getElementById("transacciones")
});
const token_detail = new DetalleToken({
    target: document.getElementById("detalle-token")
});
export default { login, displayTokens, txs, token_detail };
//# sourceMappingURL=main.js.map