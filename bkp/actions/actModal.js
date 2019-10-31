const modal = {
	'create': (pList = [], pIndex = 0, pReturn = []) => {
        if (pList.length > pIndex) {
            pReturn[pList[pIndex]] = false;
            return modal.create(pList, pIndex + 1, pReturn);
        } else {
            return pReturn;
        }
    },
	'open': (pModal, pExecBefore = () => {}) => {
        pExecBefore();
        pModal.$set({'show': true});
    },
	'close': (pModal, pExecBefore = () => {}) => {
        pExecBefore();
        pModal.$set({'show': false});
    }
};

export default modal;