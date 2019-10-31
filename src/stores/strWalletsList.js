import { writable } from 'svelte/store';
import objList from '../objects/objList.js';

const walletsList = writable(new objList({
	'type': 'Wallet'
}));

export default walletsList;