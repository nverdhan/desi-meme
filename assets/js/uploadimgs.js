function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    f = files[0];
    if (f.type.match('image.*')) {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
        return function(e) {
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

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById("reload").addEventListener("click", function(){
  reloadDialog("Reload this page?");
});