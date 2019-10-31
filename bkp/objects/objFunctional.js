export default class FunctionalObject {
	constructor(pConf, pNew = {}) {
		const isNull = (pVal) => (!pVal && pVal !== 0 && pVal !== '' && pVal !== false);
		const valType = (pVal, pType) => (pVal.__proto__.constructor.name === pType) ? pVal : false;
		const valNull = (pVal) => isNull(pVal) ? null : pVal;
		const valAttr = (pConfAttr) => {
			if (isNull(pNew[pConfAttr.name])) {
				if (pConfAttr.null)  {
					return false;
				} else {
					return valNull(pConfAttr.def);
				}
			} else {
				return valType(pNew[pConfAttr.name], pConfAttr.type);
			}
		};

		pConf.forEach((confAttr) => {
			this[confAttr.name] = valAttr(confAttr);
		});
		this.attrs = Object.keys(this);
		Object.freeze(this);
	}

	clone() {
		let _clone = {};
		this.attrs.forEach((attr) => _clone[attr] = this[attr]);		
		return _clone;
	}

	change(pValue = {}) {
		return new this.constructor(pValue);
	}
};