<script>
    import Modal from './modal.svelte';
    import SysButton from './systems/sysButton.svelte'
    import NewWallet from './forms/frmNewWallet.svelte';
    import objList from '../objects/objList.js';
    import objWallet from '../objects/objWallet.js';
    
    export let App;   

    let modal = App.modal.create(['new']);
    let walletsList = new objList({
        'type': 'Wallet'
    });

    const addWalletList = (pNewWallet) => {
        walletsList = walletsList.insert(pNewWallet);
        App.modal.close(modal['new']);
    };

    walletsList = walletsList .insert(new objWallet({
        'name': 'Conta teste',
        'color': '#0fc0fc'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#ffffff'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#ff0000'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#00ff00'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#0000ff'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#ffff00'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#ff00ff'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#00ffff'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#000000'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#000000'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#000000'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#000000'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#000000'
    })).insert(new objWallet({
        'name': 'Conta teste',
        'color': '#000000'
    }));
</script>

<style>
    li {
        padding: 1rem;
        justify-content: center;
        border: 0.3rem solid #111111;
        background-color: #111111;
        border-radius: 7px 7px 0 7px;
        color: #ffffff;
        margin: 1rem;
    }
    .align {
        position: fixed;
        bottom: 0px;
        justify-content: center;
        padding: 1rem 0;
        background-color: #111111;
        box-shadow: 0px -2px 6px #111111;
    }
</style>

<ul class="-container">
    {#each walletsList.items as item}
       <li style="
        box-shadow: 0 0 0 0.2rem {item.color} inset">{item.name}</li> 
    {/each}
</ul>

<div class="align">
    <SysButton style="border" on:click={() => App.modal.open(modal['new'])}>&#xf067;</SysButton>
</div>

<Modal bind:this={modal['new']}>
    <NewWallet returnExec={addWalletList}/>
</Modal>