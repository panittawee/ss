const db = firebase.firestore().collection("review");
let mainNav = document.getElementById("js-menu");
let navBarToggle = document.getElementById("js-nav-toggle");
navBarToggle.addEventListener("click", function() {
   mainNav.classList.toggle("active");
});
var slideIndexArr = [];
var master_container = document.querySelector(".main_container");
db.get().then((querySnapshot) => {
  //Generate review list
  querySnapshot.forEach((doc) => {
    var data = doc.data();
    data.id = doc.id;
    master_container.innerHTML += generateBoxReview(data);
  });
  
  //Download image and display at correct element
  querySnapshot.forEach((doc) => {
    var data = doc.data();
    data.id = doc.id;
    if(data.images !== undefined && data.images.length > 0){
      for(var ind = 0;ind < data.images.length;ind++){
        downloadAndSetImage(data.id,ind,data.images[ind]);
      }
      setInterval(() => {showSlides(data.id)}, 2000);
    }
  });
});

function downloadAndSetImage(classid,img_index,img_ref){
  var storageRef = firebase.storage().ref();
  var slideparent = document.getElementsByClassName("mySlides" + classid)[img_index];
  storageRef.child(img_ref).getDownloadURL().then(function(url) {
    slideparent.querySelector("img").src = url;
  }).catch(function(error) {
    // console.log(error);
    slideparent.querySelector("img").alt = img_ref;
  });
}

function generateBoxReview(data){
  var htmlBoxReview = "";
  htmlBoxReview += '<div class="boxReview">';
    htmlBoxReview += '<h2 class="reviewTitle">' + data.activityName + '</h2>';
    htmlBoxReview += '<h3 class="reviewPlace">' + data.touristAttraction + '</h3>';
    if(data.images !== undefined && data.images.length > 0){
      slideIndexArr[data.id] = 0;
      htmlBoxReview += '<div class="slideshow-container">';
      for(var ind = 0;ind < data.images.length;ind ++){
        htmlBoxReview += '<div class="mySlides'+ data.id +' fade">';
          htmlBoxReview +=  '<div class="numbertext">' + (ind+1) +' / ' + data.images.length + '</div>';
          htmlBoxReview +=  '<img src="" style="width:100%" height="500px"/>';
        htmlBoxReview +=  '</div>';
      }
      htmlBoxReview += '</div>';
    }
    htmlBoxReview += '<div class="descriptText">';
      htmlBoxReview += '<p class="desText">'+ data.descriptionReview +'</p>';
    htmlBoxReview += '</div>';
  htmlBoxReview += '</div>';
  return htmlBoxReview;
}

function showSlides(classid) {
  var i;
  var slides = document.getElementsByClassName("mySlides" + classid);
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slideIndexArr[classid]++;
  if (slideIndexArr[classid] > slides.length) {slideIndexArr[classid] = 1}    
  slides[slideIndexArr[classid]-1].style.display = "block";  
}