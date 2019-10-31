import Obj from './objFunctional.js'

export default class Transaction extends Obj {
    constructor(prm) {
        super([
            {
                'name': 'type',
                'type': 'Number',
                'null': true
            }, {
                'name': 'value',
                'type': 'Number',
                'null': true
            }
        ], prm);
    }
};