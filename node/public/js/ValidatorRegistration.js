'use strict'
;(function () {

    var self;
    function Validator(form) {
        self = this;
        this.form = $(form);
    }

    Validator.prototype.init = function (data) {
        console.log(data);

        this.form.on("submit", function (event) {
            event.preventDefault();
        });
    };

    function make(form) {
        var tmpValid = new Validator(form);

        return tmpValid;
    }

    window._ = make;
})();