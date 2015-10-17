/* attach a submit handler to the form */
    $("#reportabuse").submit(function(event) {

      /* stop form from submitting normally */
      event.preventDefault();

      /* get some values from elements on the page: */
      var $form = $( this ),
          url = $form.attr( 'action' );

      /* Send the data using post */
      var posting = $.post( url, 
      // { 
            //   memeid: $('#memeid').val(), 
            //   trademark: $('#trademark').val(),
            //   advertising: $('#advertising').val(),
            //   offensive: $('#offensive').val(),
            //   others: $('#others').val(),
            //   othersText: $('#othersText').val(),
            // }
            $("form").serialize()
            );

      /* Alerts the results */
      posting.done(function( data ) {
        var successString = "<p>Thank you. Your request has been submitted successfully."+
                            " We will take necessary action soon. </p>";
        $("#reportabusestatus").html(successString);
        $("#reportabusestatus").css("color", "#00adef");
        $("#reportabusestatus").css("display", "block");
        setTimeout(function(){
          $("#reportabusestatus").css("color", "#000");
          $("#reportabusestatus").css("display", "none");
        }, 10000)
      });
      posting.fail(function(){
        var failString = "<p> Sorry. There was an error processing your request." +
                        " Please write to us at info@shudhdesimemes.com or try again later.";
        $("#reportabusestatus").html(failString);
        $("#reportabusestatus").css("color", "#ed1c24");
        $("#reportabusestatus").css("display", "block");
        setTimeout(function(){
          $("#reportabusestatus").css("color", "#000");
          $("#reportabusestatus").css("display", "none");
        }, 10000)
      })
      posting.always(function(){
        $('#overlay').css('display','none');
      })
    });

    $("#closereportabuse").click(function(){
      $('#overlay').css('display','none');
    });

    $("#reportit").click(function(){
      $('#overlay').css('display','block');
    })