//get the search button
const searchButton = document.getElementById('searchButton');
//get the location details h3s
const detailsIP = document.querySelector('#IP h3');
const detailsLocation = document.querySelector('#location h3');
const detailsTimezone = document.querySelector('#timezone span');
const detailsISP = document.querySelector('#ISP h3');

searchButton.onclick = function() {
	//get ip address from search bar
	const ipAddress = document.getElementById('ipSearch').value;
	//query the ip location API
	(async function() {
		let data = await fetchIPData(ipAddress).catch((e) => {
			console.log(`
				there has been an error
				${e}
			`);
		});
		if (!data.code) {
			detailsIP.innerText = ipAddress;
			detailsLocation.innerText = `${data.location.city}, ${data.location.country}`;
			detailsTimezone.innerText = data.location.timezone;
			detailsISP.innerText = data.isp;
			mymap.setView(
				[
					data.location.lat,
					data.location.lng
				],
				15
			);

			marker
				.setLatLng([
					data.location.lat,
					data.location.lng
				])
				.addTo(mymap);
		} else {
			alert(`
There has been an error
***********************
code: ${data.code}
message: ${data.messages}
			`);
		}
	})();
};

// initialise map

var mymap = L.map('mapid').setView(
	[
		52.5855,
		-2.12296
	],
	15
);
var icon = L.icon({
	iconUrl : '../images/icon-location.svg'
});

var marker = L.marker(
	[
		52.5855,
		-2.12296
	],
	{ icon }
).addTo(mymap);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution :
		'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom     : 18,
	id          : 'mapbox/streets-v11',
	tileSize    : 512,
	zoomOffset  : -1,
	accessToken : 'pk.eyJ1IjoiamFnZ3lzbmFrZTU3IiwiYSI6ImNrOW9heGQ1djBhMDYzaG84d3IyMXd0NDIifQ.P5TysgDWQsMSfbfkaPuVBw'
}).addTo(mymap);

async function fetchIPData(ipAddress) {
	const querry = `https://geo.ipify.org/api/v1?apiKey=at_4EdsU3h7aOlaBO835VDWPhy9HExT3&ipAddress=${ipAddress}`;
	const res = await fetch(querry);
	const data = await res.json();
	return data;
}
