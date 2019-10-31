<script>
	import App from './actions/actApp.js';
	import Header from './components/header.svelte';
	import Wallets from './components/wallets.svelte';

	export let title;
</script>

<style>
	/*@font-face{
		font-family: 'Icon';
		font-weight: 400;
		src: url('../font/fontawesome/fa-brands-400.eot');
		src: url('../font/fontawesome/fa-brands-400.eot?#iefix') format("embedded-opentype"),
			url('../font/fontawesome/fa-brands-400.woff2') format("woff2"),
			url('../font/fontawesome/fa-brands-400.woff') format("woff"),
			url('../font/fontawesome/fa-brands-400.ttf') format("truetype"),
			url('../font/fontawesome/fa-brands-400.svg#fontawesome') format("svg")
	}
	@font-face{
		font-family: 'Icon';
		font-weight: 100;
		src: url('../font/fontawesome/fa-regular-400.eot');
		src: url('../font/fontawesome/fa-regular-400.eot?#iefix') format("embedded-opentype"),
			url('../font/fontawesome/fa-regular-400.woff2') format("woff2"),
			url('../font/fontawesome/fa-regular-400.woff') format("woff"),
			url('../font/fontawesome/fa-regular-400.ttf') format("truetype"),
			url('../font/fontawesome/fa-regular-400.svg#fontawesome') format("svg")
	}*/
	@font-face{
		font-family: 'Icon';
		/*font-weight: 900;*/
		src: url('../font/fontawesome/fa-solid-900.eot');
		src: url('../font/fontawesome/fa-solid-900.eot?#iefix') format("embedded-opentype"),
			url('../font/fontawesome/fa-solid-900.woff2') format("woff2"),
			url('../font/fontawesome/fa-solid-900.woff') format("woff"),
			url('../font/fontawesome/fa-solid-900.ttf') format("truetype"),
			url('../font/fontawesome/fa-solid-900.svg#fontawesome') format("svg")
	}
	@font-face {
		font-family: 'Inconsolata';
		src: url('../font/Inconsolata.otf');
	}



	:global(.-container) {
		padding: 50px 5%;
		justify-content: space-between;
	}
	:global(.-icon) {
		font-family: 'Icon';
		font-weight: 400;
		text-align: center;
	}



	:global(body) {
		font-size: 1.8rem;
		font-family: 'Inconsolata';
	}
	:global(h1) {
		letter-spacing: 0.2rem;
		text-transform: uppercase;
	}
	:global(p) {
		width: 100%;
		line-height: 150%;
	}
</style>

<Header {title}/>
<Wallets {App}/>