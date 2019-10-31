<script>
    export let title;
</script>

<style>
    header {
        justify-content: center;
        background-color: #111111;
        color: #ffffff;
        box-shadow: 0px 2px 6px #111111;
        z-index: 2;
    }
    h1 {
        font-size: 2.5rem;
        margin: 1rem;
        padding: 5px 5px 7px 7px;
        border-radius: 5px 5px 0px 5px;
        border: 0.2rem solid #ffffff;
    }
</style>

<header>
    <h1>{title}</h1>
</header>