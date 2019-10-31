import Obj from './objFunctional.js'
import objList from './objList.js'
import objTransaction from './objTransaction.js'

const model = {
    'name': 'Nova conta',
    'color': '#ffffff',
    'balance': 0,
    'transactions': new objList({
        'type': 'Transaction'
    })
};

export default class Wallet extends Obj {
    constructor(prm = model) {
        console.log(prm);
        super([
            {
                'name': 'name',
                'type': 'String',
                'null': true
            }, {
                'name': 'color',
                'type': 'String'
            }, {
                'name': 'balance',
                'type': 'Number',
                'def': model.balance
            }, {
                'name': 'transactions',
                'type': 'List',
                'def': model.transactions
            }
        ], prm);
    }   

    reset() {
        return this.change(model);
    }
    
    in() {
        return this.transactions.items.reduce((a, i) => a + (i.type === 1 ? i.value : 0), 0);
    }

    out() {
        return this.transactions.items.reduce((a, i) => a + (i.type === 2 ? i.value : 0), 0);
    }

    transaction(pValue, pType) {
        let _clone = this.clone();
        _clone.transactions = _clone.transactions.insert(new objTransaction({
            'type': pType,
            'value': pValue
        }));
        return this.change(_clone);
    }

    adjust(pValue) {
        let _clone = this.clone();
        _clone.balance = pValue;
        return this.change(_clone);
    }
};