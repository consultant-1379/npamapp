define([
    'i18n/number',
    'npamlibrary/constants'
],
    function (i18nNumber, Constants) {
        var format = '0,0';

        return {

            getNumber: function (number) {
                if (number === Constants.NA) {
                    return Constants.NA;
                } else if (Number(number)) {
                    return i18nNumber(number).format(format);
                } else {
                    return number;
                }
            },
            printf: function(pattern) {
                if (pattern && pattern !== '') {
                    var args = arguments;
                    return pattern.replace(/{(\d+)}/g, function(match, number) {
                        number = parseInt(number) + 1;

                        return typeof args[number] !== 'undefined' ? (typeof args[number] === "number" ? Number(args[number]).format("0,0") : args[number] ) : match;
                    });
                }
            }

        };
    });