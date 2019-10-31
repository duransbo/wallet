<script>
    export let style;
</script>

<style>    
    button {
        width: 3.5rem;
        height: 3.5rem;
        background-color: #111111;
        color: #ffffff;
        border: none;
        border-radius: 5px 5px 0px 5px;
        box-shadow: 1px 1px 2px #111111;
    }
    .border {
        border: 0.2rem solid#ffffff;
    }
</style>

<button class="-icon {style}" on:click><slot></slot></button>