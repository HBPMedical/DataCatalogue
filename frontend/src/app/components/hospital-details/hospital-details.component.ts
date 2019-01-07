import {AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {HospitalService} from "../../shared/hospital.service";
import {ActivatedRoute, Params} from '@angular/router';
import {Location} from '@angular/common';
import 'rxjs/add/operator/switchMap';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from 'rxjs/operators';
import {IOption,} from "ng-select";
import * as d3 from 'd3';


@Component({
  selector: 'app-hospital-details',
  templateUrl: './hospital-details.component.html',
  styleUrls: ['./hospital-details.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HospitalDetailsComponent implements OnInit, OnChanges, AfterViewInit {

  myOptions2: Array<IOption> = [{label: '', value: ''}];
  value: any = {};
  disabled = false;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  diagramOpen = false;
  hospitalVersions: Array<any>;
  hospital: any;
  url = this.location.path();
  currentVersionId = 3; /// be careful when changing the database , it should be assigned to an existing id
  currentVersionName;
  downloadName = "variables_";
  searchTermVar: String = "";
  viewInitialized: boolean;
  filterDisabled = true;
  constructor(private hospitalService: HospitalService, private route: ActivatedRoute, private location: Location) {

  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.hospitalService.getVersionsByHospitalId(+params['hospital_id']))
      .subscribe(versions => {
        this.hospitalVersions = versions
      });

    this.route.params.switchMap((params: Params) => this.hospitalService.getHospitalById(+params['hospital_id'])).subscribe(hosp => {
      this.hospital = hosp
    });
    this.currentVersionId = 3; //check this

  }

  ngAfterViewInit() {
    this.viewInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentVersionId']) {
      this.route.params
        .switchMap((params: Params) => this.hospitalService.getVersionsByHospitalId(+params['hospital_id']))
        .subscribe(versions => {
          this.hospitalVersions = versions
        });

      this.route.params.switchMap((params: Params) => this.hospitalService.getHospitalById(+params['hospital_id'])).subscribe(hosp => {
        this.hospital = hosp
      });


    }

  }
  public selected(option: IOption): void {
    this.searchTermVar = option.label;
  }


  public deselected(option: IOption): void {
    this.searchTermVar = "";
  }
  public filterInputChanged(option: IOption): void{
    this.searchTermVar = option.label;
  }

  public arrayIterationByLabel(originalArray) {
    for (let obj of originalArray) {
      this.myOptions2.push({label: obj['name'].toString(), value: obj['variable_id'].toString()});
    }
    return this.myOptions2;
  }




  createSampleFileName() {
    var oldName = parseInt(this.hospitalVersions[this.hospitalVersions.length - 1].name.replace('v', ''));
    oldName = oldName + 1;
    return this.hospital.name + "_" + "v" + oldName.toString() + ".xlsx";
  }

  changeVersionId(verId) {
    this.currentVersionId = verId;
  }

  changeVersionName(verName) {
    this.currentVersionName = verName;
  }

  tabChanged(event) {
    this.changeVersionId(this.hospitalVersions[event.index].version_id);
    this.changeVersionName(event.tab.textLabel);
    this.searchTermVar = "";
  }


  goBack(): void {
    this.location.back();
  }
}
