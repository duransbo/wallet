<style>
    form :global(input[type=button]),
    form :global(input[type=file]),
    form :global(input[type=reset]),
    form :global(input[type=submit]),
    form :global(input[type=color]),
    form :global(input[type=date]),
    form :global(input[type=email]),
    form :global(input[type=number]),
    form :global(input[type=password]),
    form :global(input[type=range]),
    form :global(input[type=search]),
    form :global(input[type=text]),
    form :global(input[type=time]),
    form :global(input[type=url]),
    form :global(select),
    form :global(button),
    form :global(textarea) {
        width: 100%;
        height: 3.5rem;
        margin-bottom: 1.5rem;
    }
    form :global(input[type=checkbox]),
    form :global(input[type=radio]) {
        height: 3.5rem;
    }
    form :global(textarea) {
        height: 10rem;
    }
    form :global(input[type=button]) {
        background-color: green;
        color: #fff;
        border: none;
    }
    form :global(input[type=button][disabled]) {
        background-color: gray;
    }
</style>

<form>
    <slot>Form Error</slot>
</form> 