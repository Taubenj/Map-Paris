// votre code JS
var mymap = L.map("mapid").setView([48.8534, 2.3488], 13);

var layerGroup = L.layerGroup().addTo(mymap);

var popup = L.popup();

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoianVsaWVua29tcCIsImEiOiJjanR1NGFuYjkxMmNvNDBucGI1aXZ4Y285In0.hiSplFD5CODUd9yxRO_qkg"
  }
).addTo(mymap);

async function getData(query) {
  if (query == undefined) {
    query = "";
  }

  let url =
    "https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=" +
    query +
    "&facet=category&facet=tags&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type";

  console.log(url);

  let response = await fetch(url);

  let data = await response.json();

  layerGroup.clearLayers();

  data.records.forEach(function(event) {
    if (!event.fields.lat_lon) {
      return;
    }
    // le titre de l'événement
    let title = event.fields.title;
    // la latitude
    let latitude = event.fields.lat_lon[0];
    // la longitude
    let longitude = event.fields.lat_lon[1];
    // on pourrait récupérer d'autres infos..
    let price = event.fields.price_type;
    let address_city = event.fields.address_city;
    let address = event.fields.address_street;
    let price_detail = event.fields.price_detail;
    let image1 = event.fields.cover_url;

    // hello ! ~~~~~
    // pour tester, on les affiche dans la console
    // console.log(
    //   title +
    //     " " +
    //     latitude +
    //     " " +
    //     longitude +
    //     price +
    //     address_city +
    //     address +
    //     image1 +
    //     price_detail
    // );

    // .. mais ce serait mieux de les afficher sur la carte !
    var marker = L.marker([latitude, longitude]).addTo(layerGroup);
    marker.bindPopup(
      title +
        " <br> " +
        "<div class='prix'>" +
        price +
        "</div>" +
        " <br> " +
        price_detail +
        address_city +
        " <br> " +
        address +
        "<br>" +
        "<img class=image src='" +
        image1 +
        "' ></img>"
    );
  });
}
getData();

function onFormSubmit(event) {
  event.preventDefault();
  getData(serchInput.value);
}
function payant() {
  getData("payant");
}
function gratuit() {
  getData("gratuit");
}
