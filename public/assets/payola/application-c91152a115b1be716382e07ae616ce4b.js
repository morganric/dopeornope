var PayolaCheckout = {
    setUpStripeCheckoutButton: function(options) {
        var handler = StripeCheckout.configure({
            key: options.publishable_key,
            image: options.product_image_path,
            token: function(token) { PayolaCheckout.tokenHandler(token, options) }
        });

        document.getElementById(options.button_id).addEventListener('click', function(e) {
            handler.open({
                name: options.name,
                description: options.description,
                amount: options.price,
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
        if (options.signed_custom_fields) {
          form.append($('<input type="hidden" name="signed_custom_fields">').val(options.signed_custom_fields));
        }

        $(".payola-checkout-button").prop("disabled", true);
        $(".payola-checkout-button-text").hide();
        $(".payola-checkout-button-spinner").show();
        $.ajax({
            type: "POST",
            url: options.base_path + "/buy/" + options.product_class + "/" + options.product_permalink,
            data: form.serialize(),
            success: function(data) { PayolaCheckout.poll(data.guid, 60, options) },
            error: function(data) { PayolaCheckout.showError(data.responseJSON.error, options) }
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
            PayolaCheckout.showError("This seems to be taking too long. Please contact support and give them transaction ID: " + guid, options);
            return;
        }

        $.get(options.base_path + "/status/" + guid, function(data) {
            if (data.status === "finished") {
                window.location = options.base_path + "/confirm/" + guid;
            } else if (data.status === "errored") {
                PayolaCheckout.showError(data.error, options);
            } else {
                setTimeout(function() { PayolaCheckout.poll(guid, num_retries_left - 1, options) }, 500);
            }
        });
    }
}
;
var PayolaPaymentForm = {
    initialize: function() {
        $(document).on('submit', '.payola-payment-form', function() {
            return PayolaPaymentForm.handleSubmit($(this));
        });
    },

    handleSubmit: function(form) {
        form.find(':submit').prop('disabled', true);
        $('.payola-spinner').show();
        Stripe.card.createToken(form, function(status, response) {
            PayolaPaymentForm.stripeResponseHandler(form, status, response);
        });
        return false;
    },

    stripeResponseHandler: function(form, status, response) {
        if (response.error) {
            PayolaPaymentForm.showError(form, response.error.message);
            form.find(':submit').prop('disabled', false);
        } else {
            var email = form.find("[data-payola='email']").val();

            var base_path = form.data('payola-base-path');
            var product = form.data('payola-product');
            var permalink = form.data('payola-permalink');

            var data_form = $('<form></form>');
            data_form.append($('<input type="hidden" name="stripeToken">').val(response.id));
            data_form.append($('<input type="hidden" name="stripeEmail">').val(email));
            data_form.append(form.find('input[name="authenticity_token"]'));
            
            $.ajax({
                type: "POST",
                url: base_path + "/buy/" + product + "/" + permalink,
                data: data_form.serialize(),
                success: function(data) { PayolaPaymentForm.poll(form, 60, data.guid, base_path) },
                error: function(data) { PayolaPaymentForm.showError(form, data.responseJSON.error) }
            });
        }
    },

    poll: function(form, num_retries_left, guid, base_path) {
        if (num_retries_left == 0) {
            PayolaPaymentForm.showError(form, "This seems to be taking too long. Please contact support and give them transaction ID: " + guid)
        }
        $.get(base_path + '/status/' + guid, function(data) {
            if (data.status === "finished") {
                form.append($('<input type="hidden" name="payola_sale_guid"></input>').val(guid));
                form.get(0).submit();
            } else if (data.status === "errored") {
                PayolaPaymentForm.showError(form, data.error);
            } else {
                setTimeout(function() { PayolaPaymentForm.poll(form, num_retries_left - 1, guid, base_path) }, 500);
            }
        });
    },

    showError: function(form, message) {
        $('.payola-spinner').hide();
        var error_selector = form.data('payola-error-selector');
        if (error_selector) {
            $(error_selector).text(message);
        } else {
            form.find('.payola-payment-error').text(message);
        }
    }
};

$(function() { PayolaPaymentForm.initialize() } );
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
