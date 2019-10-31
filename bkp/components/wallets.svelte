<script>
    import Modal from './modal.svelte';
    import Transactions from './transactions.svelte';
    import strWalletsList from '../stores/strWalletsList.js';
    import strWalletFocus from '../stores/strWalletFocus.js';
    import objWallet from '../objects/objWallet.js';
    
    export let App;   

    let modal = App.modal.create(['novo', 'editar', 'ativar']);
    let posWalletList = 0;
    let newWallet = new objWallet().clone();
    let editWallet;

    const editarConta = () => {
        strWalletsList.set($strWalletsList.update(posWalletList, $strWalletFocus.change(editWallet)));
        strWalletFocus.set($strWalletsList.item(posWalletList).val);
    };

    const adicionarConta = () => {
        strWalletsList.set($strWalletsList.insert(new objWallet(newWallet)));
        newWallet = $strWalletFocus.reset().clone();
        ativarConta($strWalletsList.last().pos)();
    };

    const ativarConta = pItem => () => {
        strWalletFocus.set($strWalletsList.item(pItem).val);
        editWallet = $strWalletFocus.clone();
        posWalletList = pItem;        
    };

    // TESTE //
        strWalletsList.set($strWalletsList.insert(new objWallet()));
        strWalletsList.set($strWalletsList.update(0, $strWalletsList.items[0].adjust(500)));
        strWalletsList.set($strWalletsList.update(0, $strWalletsList.items[0].transaction(10, 1)));
        strWalletsList.set($strWalletsList.update(0, $strWalletsList.items[0].transaction(5, 1)));
        strWalletsList.set($strWalletsList.update(0, $strWalletsList.items[0].transaction(10, 2)));
        strWalletsList.set($strWalletsList.update(0, $strWalletsList.items[0].transaction(10, 3)));
        strWalletsList.set($strWalletsList.update(0, $strWalletsList.items[0].transaction(17, 1)));
        strWalletsList.set($strWalletsList.update(0, $strWalletsList.items[0].transaction(2, 2)));
        strWalletsList.set($strWalletsList.insert(new objWallet()));
        strWalletsList.set($strWalletsList.update(1, $strWalletsList.items[1].transaction(10, 3)));
        strWalletsList.set($strWalletsList.update(1, $strWalletsList.items[1].transaction(17, 1)));
        strWalletsList.set($strWalletsList.update(1, $strWalletsList.items[1].transaction(2, 2)));
    // TESTE //

    ativarConta(posWalletList)();
</script>

<style>
    .contas {
        padding: 10px 10%;
        background-color: #afafaf;
        justify-content: space-between;
    }
    .ativar {
        width: calc(100% - 80px);
        padding-left: 10px;
        text-align: left;
    }
    .ativar::before {
        font-family: 'Icon';
        content: '\f555  ';
    }
    .ativar, .editar, .novo {
        height: 3.0rem;
        background-color: #111111;
        color: #ffffff;
        border: none;
        border-radius: 5px 5px 0px 5px;
        box-shadow: 1px 1px 2px #111111;
    }
    .editar, .novo {
        width: 3.0rem;
    }
</style>

<div class="contas">
    <button class="ativar" on:click={() => App.modal.open(modal['ativar'])}>{$strWalletFocus.name}</button>
    <button class="editar -icon" on:click={() => App.modal.open(modal['editar'])}>&#xf304;</button>
    <button class="novo -icon" on:click={() => App.modal.open(modal['novo'])}>&#xf067;</button>
</div>
<Transactions {App}/>



<Modal bind:this={modal['ativar']}>
    {#each $strWalletsList.items as item, i}
       <button class="botao" on:click={() => App.modal.close(modal['ativar'], ativarConta(i))}>{item.name}</button> 
    {/each}
</Modal>

<Modal bind:this={modal['editar']}>
    <input class="campo" type="text" placeholder="Nome da Conta" bind:value={editWallet.name}/>
    <input class="campo" type="color" bind:value={editWallet.color}>
    <button class="enviar" on:click={() => App.modal.close(modal['editar'], editarConta)} disabled={!editWallet.name}>Salvar</button>
</Modal>

<Modal bind:this={modal['novo']}>
    <input class="campo" type="text" placeholder="Nome da Conta" bind:value={newWallet.name}/>
    <input class="campo" type="number" placeholder="Valor da Conta" bind:value={newWallet.balance}/>
    <input class="campo" type="color" bind:value={newWallet.color}>
    <button class="enviar" on:click={() => App.modal.close(modal['novo'], adicionarConta)} disabled={!(newWallet.name && newWallet.balance > 0)}>Salvar</button>
</Modal>