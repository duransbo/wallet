export class Hour {
    static agora() {
        let date = new Date();
        return {
            seg : date.getSeconds(),
            min : date.getMinutes(),
            hor : date.getHours(),
            dia : date.getDate(),
            mes : date.getMonth() + 1,
            ano : date.getFullYear()
        };
    }
    
    static formatado(pHorario) {		
        return ('00' + pHorario.dia).slice(-2) + '/' + ('00' + pHorario.mes).slice(-2) + '/' + pHorario.ano +
            ' ' + ('00' + pHorario.hor).slice(-2) + ':' + ('00' + pHorario.min).slice(-2) + ':' + ('00' + pHorario.seg).slice(-2);
    }
};