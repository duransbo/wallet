<style>
    form :global(.campo) {
        width: 100%;
        height: 20px;
        padding: 5px;
        margin-bottom: 15px;
    }
    form :global(.enviar) {
        width: 100%;
        height: 30px;
        padding: 5px;
        margin-bottom: 15px;
        background-color: green;
        color: #fff;
        border: none;
    }
    form :global(.enviar[disabled]) {
        background-color: gray;
    }
    form :global(.botao) {
        width: 100%;
        height: 30px;
        padding: 5px;
        margin-bottom: 15px;
        background-color: green;
        color: #fff;
        border: none;
    }
    form :global(.botao:hover) {
        background-color: darkslategray;
    }
</style>

<form>
    <slot>Form Error</slot>
</form> 