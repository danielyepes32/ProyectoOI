class DateService {
// Se define la clase de servicio y formateo de fecha y hora actual

    static getCurrentDate(format='DD-MM-YYYY'){

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "Octubre", "Noviembre", "Diciembre"
        ];
        const now = new Date();
        switch (format) {
            case 'DD-MM-YYYY':
                const month = monthNames[now.getMonth()]
                return `${now.getDate().toString().padStart(2, '0')} de ${month}, ${now.getFullYear()}`;
            case 'YYYY-MM-DD':
                return `${now.getFullYear()}-${now.getMonth().toString().padStart(2, '0')-now.getDate().toString().padStart(2, '0')}`;
            case 'MM/DD/YYYY':
                return `${now.getMonth().toString().padStart(2, '0')} / ${now.getDate().padStart(2, '0')} / ${now.getFullYear()}`
            default:
                return now.toISOString();
        }
    }

// Metodo para obtener la diferencia en dias

    static getDateDifference(startTime, endTime){
        const date1 = new Date(startTime);
        const date2 = new Date(endTime);
        const difference = Math.abs(date2 - date1)
        return Math.ceil(difference /  (1000 * 60 * 60 * 24))
    }

// Metodo para validar si una fecha es valida

    static isValidate(date){
        return !isNaN(new Date(date).getTime())
    }
}

export default DateService