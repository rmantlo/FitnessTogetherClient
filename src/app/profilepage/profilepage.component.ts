import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { EventsService } from '../services/events.service';
import { AttendingService } from '../services/attending.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import { DeleteAlertComponent } from './delete-alert/delete-alert.component';

// goes with Google maps extension
// import {Title} from '@angular/platform-browser';
// import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
// import {} from '@types/googlemaps';
// import PlaceResult = google.maps.places.PlaceResult;


export interface Event {
  value: string;
  viewValue: string;
}

export interface EventGroup {
  disabled?: boolean;
  name: string;
  event: Event[];
}

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.css']
  // Encapsulation goes with Google maps extension
  // encapsulation: ViewEncapsulation.None,
})

export class ProfilepageComponent implements OnInit {
  event: any;
  certainEvent: any;
  addEvent: FormGroup;

  option: any = {};
  userInfo: any;
  settingPopup: boolean = false;
  deletePopup: boolean = false;
  addEditEventClicked: boolean = false;

  updateInfo: any = {};
  myEventInfo: any;
  myAttendEvents: any = [];
  allAttendEvents: any = [];
  token: any;

  addMap: any = {
    lat: "30.45555",
    lng: "42.35999"
  }
  streetViewControl: boolean = true;
  updateEventInfo: any = {};

  currentUpdateEvent: any = {};
  eventGroup: any = {};

  eventControl = new FormControl();
  eventGroups: EventGroup[] = [
    {
      name: 'Exercise',
      event: [
        { value: 'running', viewValue: 'Running' },
        { value: 'gym', viewValue: 'Gym' },
        { value: 'crossfit', viewValue: 'Crossfit' },
        { value: 'kick boxing', viewValue: 'Kick Boxing' },
        { value: 'yoga', viewValue: 'Yoga' }
      ]
    },
    {
      name: 'Sports',
      event: [
        { value: 'basketball', viewValue: 'Basketball' },
        { value: 'football', viewValue: 'Football' },
        { value: 'tennis', viewValue: 'Tennis' },
        { value: 'soccer', viewValue: 'Soccer' },
        { value: 'golf', viewValue: 'Golf' }
      ]
    },
    {
      name: 'Outdoor',
      event: [
        { value: 'hiking', viewValue: 'Hiking' },
        { value: 'cycling', viewValue: 'Cycling' },
        { value: 'mountain biking', viewValue: 'Mountain Biking' },
        { value: 'rock climbing', viewValue: 'Rock Climbing' },
        { value: 'kayaking', viewValue: 'Kayaking' },

      ]
    }
  ];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private eventService: EventsService, private attendService: AttendingService) { }

  toggleSettingPopup() {
    this.settingPopup = !this.settingPopup;
  }
  deleteAlert() {
    this.deletePopup = !this.deletePopup;
  }

  getUser() {
    this.userService.getUser().subscribe(data => {
      this.userInfo = data;
    })
  }

  myEvents() {
    this.eventService.myEvents().subscribe(
      data => {
        //console.log(data);
        this.myEventInfo = data;
      }
    )
  }
  myAttending() {
    this.attendService.getMyAttending().subscribe(
      data => {
        //console.log(data);
        this.myAttendEvents = data;
        //console.log(this.myAttendEvents)
        for (let e of this.myAttendEvents) {
          //console.log(e.eventId);
          let eventId = e.eventId;
          this.eventService.eventById(eventId).subscribe(
            data => {
              //console.log(data);
              let attendData = data;
              this.allAttendEvents = this.allAttendEvents.concat(attendData)
              //console.log(this.allAttendEvents);
            }
          )
        }

      }
    )
  }
  setToken() {
    this.token = localStorage.getItem('token');
    //console.log(this.token)
  }


  ngOnInit() {
    this.getUser();
    this.myEvents();
    this.myAttending();

    this.setToken();
  }


  openEditEventModal(e) {
    this.addEditEventClicked = !this.addEditEventClicked;
    this.currentUpdateEvent = e;
    console.log(this.updateEventInfo);
  }
  closeEditEventModal() {
    this.addEditEventClicked = false;
  }

  submitEditedEvent(id) {
    this.eventGroup = { ...this.updateEventInfo, ...this.addMap };
    // console.log(this.addEvent)
    // console.log(this.addMap)
    console.log(this.eventGroup)
    this.eventService.editEvent(id, this.eventGroup).subscribe(
      data => {
        console.log(data);
      }
    )
    this.addEditEventClicked = !this.addEditEventClicked;
  }


  // Need delete confimation pop-up
  deleteEvent(id: number) {
    console.log(id);
    this.attendService.deleteAttend(id).subscribe(data=>console.log('attend deleted'))
    this.eventService.deleteEvent(id).subscribe(
      data => {
        console.log('deleted');
        window.location.reload();
        this.myEvents();
      }
    )
  }

  onUserUpdateSubmit() {
    console.log(this.updateInfo)
    this.userService.updateUser(this.updateInfo).subscribe(
      data => {
        console.log(data)
        this.getUser();
      }
    )
  }


  latitude: number = 39.96514511660002;
  longitude: number = -86.00871011355463;
  locationChosen: boolean = false;

  onChoseLocation(event) {
    console.log(event);
    this.addMap = event.coords;
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true;
  }

  latConvert(lat) {
    return Number(lat)
  }

  lngConvert(lng) {
    return Number(lng)
  }

  unattendDelete(event) {
    let indexValue = this.allAttendEvents.indexOf(event);
    this.allAttendEvents.splice(indexValue, 1)
    //console.log(this.allAttendEvents);
    this.attendService.deleteAttend(event.id).subscribe(
      data => {
        console.log(data);
      }
    )
  }
}

