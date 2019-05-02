import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data-home.component.html',
  styleUrls: ['./master-data-home.component.css']
})
export class MasterDataComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  medPress() {
    alert('Medicine Button Pressed');
  }

  sympPress() {
    alert('Symptoms Pressed');
  }
}
