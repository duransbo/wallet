import Obj from './objFunctional.js'

const valType = (pValue, pType) => (pValue.__proto__.constructor.name === pType) ? pValue : false;

export default class List extends Obj {
    constructor(prm = []) {
        if (valType(prm, 'Array')) {
            prm = {'items': [...prm]};
        } else {
            if (prm.items && valType(prm.items, 'Array')) {
                prm.items = prm.items.map((item) => valType(item, prm.type));
            }
        }
        super([
            {
                'name': 'type',
                'type': 'String'
            }, {
                'name': 'items',
                'type': 'Array',
                'def': []
            }
        ], prm);
    }

    item(pIndex) {
        return {
            'pos': pIndex,
            'val': this.items[pIndex]
        };
    }
    
    first() {
        return this.item(0);
    }
    
    last() {
        return this.item(this.items.length - 1);
    }
    
    update(pIndex, pItem) {
        return (this.items[pIndex]) ?
            this.change({
                'type': this.type,
                'items': [
                    ...this.items.slice(0, pIndex),
                    (this.type) ? valType(pItem, this.type) : pItem,
                    ...this.items.slice(pIndex + 1)
                ]
            }) :
            this;
    }
    
    insert(pItem, pIndex = false) {
        const _item = (this.type) ? valType(pItem, this.type) : pItem;
        return this.change({
            'type': this.type,
            'items': (pIndex) ?
                [...this.items.slice(0, pIndex), _item, ...this.items.slice(pIndex)] :
                [...this.items, _item]
        });        
    }
    
    remove(pIndex) {
        return (this.itens[pIndex]) ?
            this.change({
                'type': this.type,
                'items': [...this.items.slice(0, pIndex), ...this.items.slice(pIndex + 1)]
            }) :
            this.itens;
    }
}