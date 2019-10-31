<script>
    export let title;
</script>

<style>
    .header {
        justify-content: center;
        background-color: #111111;
        color: #ffffff;
        box-shadow: 0px 2px 6px #111111;
        z-index: 2;
    }
    .header h1 {
        margin: 10px;
        padding: 8px;
        border-radius: 7px 7px 0px 7px;
        border: 0.25rem solid #ffffff;
    }
</style>

<header class="header">
    <h1>{title}</h1>
</header>