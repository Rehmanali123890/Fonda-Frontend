import { Component, Input } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-confirmation-screen',
  templateUrl: './confirmation-screen.component.html',
  styleUrls: ['./confirmation-screen.component.css']
})
export class ConfirmationScreenComponent {
  @Input() orderData: any;
  @Input() merchantData: any;
  @Input() isDelivery: any;
  @Input() slug: any;
  formattedDate: string = ''; 
  navigateToOrder() {
    // Use window.location.href to navigate to the new URL
    window.location.href = `/${this.slug}`;
  }
  initLocation() {
    // Address string
    const address = this.merchantData.address;

    // Geocode the address to get the coordinates
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
            const position = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            
            console.log('Geocoding successful');
            console.log('Latitude:', position.lat);
            console.log('Longitude:', position.lng);
            console.log('Geocoding Results:', results);
            // Display the location on the screen
            // For example, you can display it in a div with id 'location'
            const mapElement = document.getElementById('map');
            if (mapElement) {
                const map = new google.maps.Map(mapElement, {
                    zoom: 15,
                    center: position,
                });

                // Add a marker to the map
                new google.maps.Marker({
                    position,
                    map,
                    title: "Merchant Location",
                });
            } else {
                console.error('Map element not found');
            }

            // Update the "Get Directions" link
            const directionsLink = document.querySelector('.directions-link') as HTMLAnchorElement;
            if (directionsLink) {
                directionsLink.href = `https://www.google.com/maps/search/?api=1&query=${position.lat},${position.lng}`;
                directionsLink.target = "_blank";
            }
        } else {
            console.error('Geocode was not successful for the following reason:', status);
        }
    });
}   

  ngOnInit() {
    console.log("AAAAAAAAA");
    console.log("Order date", this.orderData.orderDateTime);
    const date = new Date(this.orderData.orderDateTime);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    
    this.formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    this.formattedDate = this.formattedDate.replace(/([APM]{2})$/, (match) => match.toLowerCase());
    
    this.formattedDate = this.formattedDate.replace(/(\d{1,2}) /, '$1, ');
    this.formattedDate = this.formattedDate.replace(/(\d{4}),/, '$1 ');
    this.formattedDate = this.formattedDate.replace(/(\d{2}:\d{2}), (am|pm)/, '$1 $2');
    
    console.log("Formatted Date", this.formattedDate);
    
    console.log('Order Data Received:', this.orderData);
    console.log('Merchant Data:', this.merchantData);
    // this.initMap();
    this.initLocation()
  }
  
}
