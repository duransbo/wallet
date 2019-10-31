<script>
    import SysButton from './systems/sysButton.svelte'

    export let show = false;

    const close = () => show = false;
</script>

<style>
    .modal {
        padding: 25px 10% 10px;
        max-height: calc(100vh - 10rem);
        background-color: #111111;
        box-shadow: 0px -2px 6px #111111;
        position: fixed;
        bottom: 0;
        justify-content: center;
        transform: translateY(100vh);
        transition: transform .3s;
        overflow: auto;
    }
    .modal.show {
        transform: translateY(0);
    }
</style>


<div class="modal" class:show={show}>
    <slot>Modal Error</slot>
    <SysButton style="border" on:click={close}>X</SysButton>        
</div>