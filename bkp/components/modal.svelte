<script>
    export let show = false;

    const close = () => show = false;
</script>

<style>
    .modal {
        padding: 25px 10% 10px;
        background-color: #111111;
        box-shadow: 0px -2px 6px #111111;
        position: fixed;
        bottom: 0;
        justify-content: center;
        transform: translateY(100vh);
        transition: transform .3s;
    }
    .modal.show {
        transform: translateY(0);
    }
    .close {
        width: 3.4rem;
        height: 3.4rem;
        color: #ffffff;
        background-color: #111111;
        border: 0.2rem solid #ffffff;
        box-shadow: 0px 0px 0px 4px #111111, 0px 0px 6px 4px #111111;
        border-radius: 5px 5px 0px 5px;
        position: absolute;
        top: -1.7rem;
    }
    .slot :global(.campo) {
        width: 100%;
        height: 20px;
        padding: 5px;
        margin-bottom: 15px;
    }
    .slot :global(.enviar) {
        width: 100%;
        height: 30px;
        padding: 5px;
        background-color: green;
        color: #fff;
        border: none;
    }
    .slot :global(.enviar[disabled]) {
        background-color: gray;
    }
    .slot :global(.botao) {
        width: 100%;
        height: 30px;
        padding: 5px;
        margin-bottom: 15px;
        background-color: green;
        color: #fff;
        border: none;
    }
    .slot :global(.botao:hover) {
        background-color: darkslategray;
    }
</style>


<div class="modal" class:show={show}>
    <button class="close" on:click={close}>X</button>
    <div class="slot">
        <slot>Erro ao abrir modal</slot>
    </div>           
</div>