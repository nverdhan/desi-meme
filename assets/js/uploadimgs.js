$('#upload').css('display','none');

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    f = files[0];
    if (f.type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
        return function(e) {
          
          $.ajax({
                 url : 'http://www.edroot.com/shudhdesimemes/uploadsavedimg.php',
                 crossDomain: true,
                 type : 'POST',
                 data: JSON.stringify({img: e.target.result}) ,
                 processData: false,  // tell jQuery not to process the data
                 contentType: 'text/xml',  // tell jQuery not to set contentType
                 success : function(data) {
                    data = JSON.parse(data);
                    if(data.status != 0){
                        $("#url").val(data.filename);
                        $('#upload').css('display','block');
                    }else{
                        $("#url").val("SomeErrorTryLater");
                    }
                 },
                 error: function(){
                    $("#url").val("OhOhOhSomeErrorTryLater");
                 }
          });


          document.getElementById('output').innerHTML = ['<img class="output-img" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById("files").style.height="0px";
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    } else{
        reloadDialog("Please use a valid image file. Reload?");
    }
}

function reloadDialog(msg){
  if (window.confirm(msg))
        {
            window.location.href="/mcconaughey";
        }
        else
        {
            
        }
}

// $("#upload").click(function(e){
  
//   e.preventDefault();
//   console.log($("#url").val());

// })

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById("reload").addEventListener("click", function(){
  reloadDialog("Reload this page?");
});