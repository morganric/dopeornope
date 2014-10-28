var Payola = {
    setUpStripeCheckoutButton: function(options) {
        var handler = StripeCheckout.configure({
            key: options.publishable_key,
            image: options.product_image_path,
            token: function(token) { Payola.tokenHandler(token, options) }
        });

        document.getElementById(options.button_id).addEventListener('click', function(e) {
            handler.open({
                name: options.name,
                description: options.description,
                amount: options.amount,
                panelLabel: options.panel_label,
                allowRememberMe: options.allow_remember_me,
                zipCode: options.verify_zip_code,
                email: options.email || undefined
            });
            e.preventDefault();
        });
    },

    tokenHandler: function(token, options) {
        var form = $("#" + options.form_id);
        console.log(options.form_id);
        form.append($('<input type="hidden" name="stripeToken">').val(token.id));
        form.append($('<input type="hidden" name="stripeEmail">').val(token.email));
        $(".payola-checkout-button").prop("disabled", true);
        $(".payola-checkout-button-text").hide();
        $(".payola-checkout-button-spinner").show();
        $.ajax({
            type: "POST",
            url: options.base_path + "/buy/" + options.product_class + "/" + options.product_permalink,
            data: form.serialize(),
            success: function(data) { Payola.poll(data.guid, 60, options) },
            error: function(data) { Payola.showError(data.responseJSON.error, options) }
        });
    },

    showError: function(error, options) {
        var error_div = $("#" + options.error_div_id);
        error_div.html(error);
        error_div.show();
        $(".payola-checkout-button").prop("disabled", false);
        $(".payola-checkout-button-spinner").hide();
        $(".payola-checkout-button-text").show();
    },

    poll: function(guid, num_retries_left, options) {
        if (num_retries_left == 0) {
            Payola.showError("This seems to be taking too long. Please contact support and give them transaction ID: " + guid, options);
            return;
        }

        $.get(options.base_path + "/status/" + guid, function(data) {
            if (data.status === "finished") {
                window.location = options.base_path + "/confirm/" + guid;
            } else if (data.status === "errored") {
                Payola.showError(data.error, options);
            } else {
                setTimeout(function() { Payola.poll(guid, num_retries_left - 1, options) }, 500);
            }
        });
    }
}
;
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//

;
