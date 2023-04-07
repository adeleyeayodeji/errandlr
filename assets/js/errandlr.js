jQuery(document).ready(function ($) {
  let errandlrGetshipment = function () {
    //get errandlr
    let image = $(".Errandlr-delivery-logo");
    //get parent
    let parent = image.parent().parent();
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
          //check if response code is 200
          if (response.code == 200) {
            //get shipment_info
            let shipment_info = response.shipment_info;
            //economy_cost
            let economy_cost = shipment_info.economy_cost;
            //premium_cost
            let premium_cost = shipment_info.premium_cost;
            //currency
            let currency = shipment_info.currency;
            //append to li
            parent.append(`
              <div style="
                  margin-top: 5px;
              ">
                  <p class="errandlr_premium_delivery" onclick="errandlrUpdatePrice(this, event)">
                      Premium delivery 2-4 hrs ${currency} ${premium_cost}
                  </p>
                  <p class="errandlr_economy_delivery" onclick="errandlrUpdatePrice(this, event)">
                      Economy delivery 1-5 days ${currency} ${economy_cost}
                  </p>
              </div>
            `);
          }
        },
        error: function (response) {
          //unblock the checkout form
          $("form.checkout").unblock();
          //log the error
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

  setTimeout(() => {
    errandlrGetshipment();
  }, 2000);
});

//errandlrUpdatePrice
let errandlrUpdatePrice = function (elem, e) {
  e.preventDefault();
  jQuery(document).ready(function ($) {
    //get terminal shipping input
    let terminalimage = $(".Terminal-delivery-logo");
    //get parent element
    let terminal_image_parent = terminalimage.parent();
    //get previous element
    let terminal_image_prev = terminal_image_parent.prev();
    //check if terminal_image_prev is not empty
    if (terminal_image_prev.length) {
      //check if terminal_image_prev is input type radio
      if (terminal_image_prev.is("input[type='radio']")) {
        //check the input
        terminal_image_prev.prop("checked", true);
      }
    }
    let carriername = $(elem).attr("data-carrier-name");
    let amount = $(elem).attr("data-amount");
    let duration = $(elem).attr("data-duration");
    let pickup = $(elem).attr("data-pickup");
    let email = $('input[name="billing_email"]').val();
    let rateid = $(elem).attr("data-rateid");
    let carrierlogo = $(elem).attr("data-image-url");
    //save to session
    $.ajax({
      type: "POST",
      url: terminal_africa.ajax_url,
      data: {
        action: "terminal_africa_save_shipping_carrier",
        nonce: terminal_africa.nonce,
        carriername: carriername,
        amount: amount,
        duration: duration,
        email: email,
        rateid: rateid,
        pickup: pickup,
        carrierlogo: carrierlogo
      },
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
        //if response code 200
        if (response.code == 200) {
          //update woocommerce
          $(document.body).trigger("update_checkout");
        } else {
          //alert
          alert("Something went wrong: " + response.message);
        }
      },
      error: function (response) {
        //unblock the checkout form
        $("form.checkout").unblock();
        //log the error
        console.log(response);
      }
    });
  });
};
