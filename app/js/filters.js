angular.module('bfstats.filters', [])
    .filter('titlecase', function () {
        return function (input) {
            return input
                .split(' ')
                .map(function (x) {
                    return x[0].toUpperCase() + x.slice(1);
                })
                .join(' ');
        };
    })
    .filter('percentage', function () {
        return function (input) {
            var val = parseFloat(input) || 0;
            return (Math.round(val * 10000) / 100).toFixed(2) + '%';
        };
    })
    .filter('stat', function () {
        return function (input) {
            var val = parseFloat(input) || 0;
            var output;
            if (val.toString().indexOf(input) === 0) {
                if (Math.floor(val) === val) {
                    // no decimal part
                    output = val.toString();
                } else {
                    output = val.toFixed(2);
                }
            } else {
                output = input;
            }
            return output;
        };
    })
    .filter('statName', function () {
        return function (input) {
            return input
                .split('_')
                .map(function (x) {
                    return x.charAt(0).toUpperCase() + x.slice(1);
                })
                .join(' ');
        };
    })
    .filter('fromNow', function() {
        return function (input) {
            return moment(input + ' GMT+0000', 'YYYY-MM-DD HH:mm:ss ZZ').fromNow();
        };
    })
    .filter('monthYear', function () {
        return function (input) {
            return moment(input).format('MMM YYYY');
        };
    });