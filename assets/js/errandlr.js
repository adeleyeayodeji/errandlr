jQuery(document).ready(function ($) {
  let errandlrGetshipment = function () {
    //if the checkout form is valid
    if ($("form.checkout").length > 0) {
      //get the form data
      var data = {
        action: "errandlr_validate_checkout",
        nonce: errandlr_delivery.nonce,
        data: $("form.checkout").serialize()
      };
      //log
      $.ajax({
        type: "POST",
        url: errandlr_delivery.ajax_url,
        data,
        dataType: "json",
        beforeSend: function () {
          //block the checkout form
          $("form.checkout").block({
            message: null,
            overlayCSS: {
              background: "#fff",
              opacity: 0.6
            }
          });
        },
        success: function (response) {
          //unblock the checkout form
          $("form.checkout").unblock();
          console.log(response);
        }
      });
    }
  };
  //on focus out on any input field or select box in the checkout form 'checkout woocommerce-checkout'
  $("body").on(
    "focusout",
    "form.checkout #billing_address_1, form.checkout #billing_address_2, form.checkout #billing_city, form.checkout #billing_state, form.checkout #billing_postcode, form.checkout #billing_country, form.checkout #billing_phone, form.checkout #billing_email",
    errandlrGetshipment
  );

  errandlrGetshipment();
});
