const db = firebase.firestore().collection("review");
var images_arr = new Array();
var finished_upload_result = [];
var validate_pending_upload_task = null;
let mainNav = document.getElementById("js-menu");
var navBarToggle = document.getElementById("js-nav-toggle");
navBarToggle.addEventListener("click", function() {
  mainNav.classList.toggle("active");
});

db.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
  });
});


function getFile() {
  document.getElementById("photo").click();
}

function previewFiles() {
  var preview = document.querySelector('#image');
  var files   = document.querySelector('input[type=file]').files;

  function readAndPreview(file) {

    // Make sure `file.name` matches our extensions criteria
    if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
      var reader = new FileReader();

      reader.addEventListener("load", function () {
        var image = new Image();
        image.height = 50;
        image.title = file.name;
        image.src = this.result;
        preview.appendChild( image );
      }, false);

      reader.readAsDataURL(file);
    }

  }

  if (files.length > 0) {
    [].forEach.call(files, readAndPreview);
  }
}

function uploadImage() {
  const file_arr = document.querySelector("#photo").files;
  if(file_arr.length == 0){
    alert("กรุณาเลือกไฟล์ที่ต้องการอัพโหลด");
    return;
  }
  var upload_btn = document.getElementById("button-img");
  upload_btn.setAttribute("disabled" ,true);
  upload_btn.innerHTML = "<span>Uploading...<i class=\"fas fa-spinner fa-spin\"></i></span>";
  finished_upload_result = [];
  const ref = firebase.storage().ref();
  
  for (var i = 0; i < file_arr.length; i++) {
    var unfinished_result = [];
    unfinished_result.status = "U";
    unfinished_result.data = "";
    var file = file_arr[i];
    var name = new Date() + "-" + file.name;
    finished_upload_result[name] = unfinished_result;
    var metadata = {
      contentType: file.type
    };
    var task = ref.child(name).put(file, metadata);
    handleUploadingTask(task,name);
  }
  
  //Check every 100ms if all files are uploaded and set them to images_arr
  validate_pending_upload_task = setInterval(function(){ 
    var all_task_finished = true;
    for(var key in finished_upload_result){
      var value = finished_upload_result[key];
      if(value.status == "U"){
        all_task_finished = false;
        break;
      }
    }
    if(all_task_finished){
      for(var key in finished_upload_result){
        //Push only success upload into image_arr
        var value = finished_upload_result[key];
        if(value.status == "S"){
          images_arr.push(key);
        }
      }
      var upload_btn = document.getElementById("button-img");
      upload_btn.removeAttribute("disabled");
      upload_btn.innerHTML = "<span>Upload Image!</span>";
      //clear file input
      document.querySelector("#photo").value = "";
      clearInterval(validate_pending_upload_task);
    }
  }, 100);
}

function handleUploadingTask(task,image_ref){
  task
    .then(snapshot => {finished_upload_result[snapshot.ref.fullPath].status = "S";},
    error => {
      // console.log(error); 
      finished_upload_result[image_ref].status = "F";
      finished_upload_result[image_ref].data = error });
}


function addData(actName, attrName, textReview) {
  var actName = document.getElementById('actname').value;
  var attrName = document.getElementById('attrname').value;
  var textReview = document.getElementById('textreview').value;

  if (actName != "" && attrName != "" && textReview != "") {
      db.add({
       activityName: actName,
       touristAttraction: attrName,
       descriptionReview: textReview,
       images : images_arr
       }).then((newdataref) => {
          // console.log("Review written with ID: ", newdataref.id);
          alert("กรอกข้อมูลเสร็จเรียบร้อย!");
          window.location = "reviewPage.html";
        //   window.location.reload(false);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        alert("เพิ่มข้อมูลล้มเหลว กรุณาลองใหม่อีกครั้ง");
    });
  }else{
      alert("กรุณากรอกข้อมูลให้ครบถ้วน")
  }
}