export function customRound(number) {
    // Convertir el número en un string para manipularlo
    let numStr = number.toString();
    let [integerPart, decimalPart] = numStr.split(".");
    
    if (!decimalPart || decimalPart.length === 1) {
        // Si no tiene parte decimal o ya tiene solo un decimal
        return parseFloat(number.toFixed(1));
    }

    // Tomar el primer decimal a redondear y el siguiente
    let firstDecimal = parseInt(decimalPart[0]);
    let secondDecimal = parseInt(decimalPart[1] || "0");

    // Aplicar las reglas del redondeo
    if (firstDecimal < 5) {
        // Caso 1: El primer decimal es menor que 5
        return parseFloat(number.toFixed(1));
    } else if (firstDecimal > 5 || (firstDecimal === 5 && secondDecimal > 0)) {
        // Caso 2: El primer decimal es mayor que 5 o es igual a 5 con un dígito significativo
        return parseFloat((Math.floor(number * 10) + 1) / 10);
    } else if (firstDecimal === 5 && secondDecimal === 0) {
        // Caso 3: El primer decimal es igual a 5 y seguido solo por ceros
        if (parseInt(integerPart[integerPart.length - 1]) % 2 === 0) {
            // Si el último dígito es par
            return parseFloat(number.toFixed(1));
        } else {
            // Si el último dígito es impar
            return parseFloat((Math.floor(number * 10) + 1) / 10);
        }
    }
}

