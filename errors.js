const seedrandom = require("seedrandom");

function sumASCII(str) {
    // Преобразуем строку в массив символов
    const charArray = str.split('');

    // Используем метод reduce для суммирования ASCII-кодов
    return charArray.reduce((total, char) => {
        return total + char.charCodeAt(0);
    }, 0);
}

function introduceErrors(string, errorRate, region, seed) {
    Math.random = seedrandom(seed + errorRate + sumASCII(string) + string.length);
    let maxDelta = 5

    if(string.length <= 10){
        maxDelta = 2
    }
    const originalLength = string.length

    const alphabet = {
        us: 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789',
        pl: "AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpQqRrSsŚśTtUuVvWwXxYyZzŹźŻż0123456789",
        ru: 'АаБбВвГгДдЕеЁёЖжЗзИиЙйКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшЩщЪъЫыЬьЭэЮюЯя0123456789'
    }

    function getRandomChar(alphabet) {
        return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    function introduceSingleError(string) {
        const errorType = Math.floor(Math.random() * 3);
        const len = string.length;
        const pos = Math.floor(Math.random() * len);

        switch (errorType) {
            case 0:
                // delete char if length is good
                if(string.length >= originalLength - maxDelta){
                    return string.slice(0, pos) + string.slice(pos + 1);
                }
                // add char
                return string.slice(0, pos) + getRandomChar(alphabet[region]) + string.slice(pos);
            case 1:
                // add char
                if(string.length <= originalLength + maxDelta){
                    return string.slice(0, pos) + getRandomChar(alphabet[region]) + string.slice(pos);
                }
                // delete char
                return string.slice(0, pos) + string.slice(pos + 1);
            case 2:
                // change position
                if (pos === len - 1) return string;
                return string.slice(0, pos) + string[pos + 1] + string[pos] + string.slice(pos + 2);
        }
    }

    let result = string;
    const wholeErrors = Math.floor(errorRate);
    const fractionalError = errorRate - wholeErrors;

    for (let i = 0; i < wholeErrors; i++) {
        result = introduceSingleError(result);
    }

    if (Math.random() < fractionalError) {
        result = introduceSingleError(result);
    }

    return result;
}

module.exports = { introduceErrors }
