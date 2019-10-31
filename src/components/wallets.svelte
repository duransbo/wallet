<script>
    import Modal from './modal.svelte';
    import SysButton from './systems/sysButton.svelte'
    import NewWallet from './forms/frmNewWallet.svelte';
    import objList from '../objects/objList.js';
    
    export let App;   

    let modal = App.modal.create(['new']);
    let walletsList = new objList({
        'type': 'Wallet'
    });

    const addWalletList = (pNewWallet) => {
        walletsList = walletsList.insert(pNewWallet);
        App.modal.close(modal['new']);
    };
</script>

<style>
    .align {
        position: fixed;
        bottom: 0px;
        justify-content: center;
        padding-bottom: 10px;
    }
</style>

<ul>
    {#each walletsList.items as item}
       <li>{item.name}</li> 
    {/each}
</ul>

<div class="align">
    <SysButton on:click={() => App.modal.open(modal['new'])}>&#xf067;</SysButton>
</div>

<Modal bind:this={modal['new']}>
    <NewWallet returnExec={addWalletList}/>
</Modal>