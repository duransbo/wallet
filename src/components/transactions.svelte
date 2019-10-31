<script>
    import {onDestroy} from 'svelte'
    import Modal from './modal.svelte';
    import strWalletFocus from '../stores/strWalletFocus.js';

    export let App;

    let modal = App.modal.create(['saldo', 'entrada', 'saida']);
    
    $: saldo = $strWalletFocus.balance;
    $: entrada = $strWalletFocus.in();
    $: saida = $strWalletFocus.out();
</script>

<style>
	.resumo {
        padding: 10px 10%;
        border: 2px solid #ffffff;
	}
    .linha {
        margin: 0.5rem 0;
        justify-content: space-between;        
    }
    .total {
        width: calc(100% - 50px);
        margin: 0;
        line-height: 3.0rem;
        display: flex;
        justify-content: space-between;
    }
    .total b {
        font-weight: 400;
    }
    .editar, .novo {
        width: 3.0rem;
        height: 3.0rem;
        background-color: #111111;
        color: #ffffff;
        border: none;
        border-radius: 5px 5px 0px 5px;
        box-shadow: 1px 1px 2px #111111;
    }
</style>

<div class="resumo" style="border-color: {$strWalletFocus.color}">
    <div class="linha">
        <p class="total">
            <b class="titulo">Saldo</b>
            <b class="valor">R$ {saldo}</b>
        </p>
        <button class="editar -icon" on:click={() => App.modal.open(modal['saldo'])}>&#xf304;</button>
    </div>
    <div class="linha">
        <p class="total">
            <b class="titulo">Entrada</b>
            <b class="valor">R$ {entrada}</b>
        </p>
        <button class="novo -icon" on:click={() => App.modal.open(modal['entrada'])}>&#xf067;</button>
    </div>
	<div class="linha">
        <p class="total">
            <b class="titulo">Saida</b>
            <b class="valor">R$ {saida}</b>
        </p>
        <button class="novo -icon" on:click={() => App.modal.open(modal['saida'])}>&#xf067;</button>
    </div>
</div>



<Modal bind:this={modal['saldo']}>
    <input placeholder="saldo" />
</Modal>

<Modal bind:this={modal['entrada']}>
    <input placeholder="entrada" />
</Modal>

<Modal bind:this={modal['saida']}>
    <input placeholder="saida" />
</Modal>