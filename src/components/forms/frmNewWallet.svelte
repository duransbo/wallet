<script>
    import SysForm from '../systems/sysForm.svelte';
    import objWallet from '../../objects/objWallet.js';

    export let returnExec;
    
    let wallet = new objWallet().clone();
    
    const submit = () => {
        returnExec(new objWallet(wallet));
        wallet = new objWallet().clone();
    };
</script>

<SysForm>
    <input type="text" placeholder="Nome da Conta" bind:value={wallet.name} />
    <input type="number" placeholder="Valor da Conta" bind:value={wallet.balance} />
    <input type="color" bind:value={wallet.color} />
    <input type="button" on:click={submit} disabled={!(wallet.name && wallet.balance > 0)} value="Salvar" />
</SysForm>