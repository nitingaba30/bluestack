import { Component, OnInit } from "@angular/core";
import { Data } from "../data";
declare var $: any;
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  dataList: Data[];
  finalcompaigns: any;
  days: any;
  today: any;
  language: string;
  statusData: Data[];
  localisationText: {};
  status: string;
  compaignDetail: Data[];
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    var month = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1);
    var date = new Date().getDate() + 1;
    this.today =  new Date().getFullYear() + '-' + month +'-' + date;
    this.language = "en";
    this.localisationText = {
      en: {
        pageHeading: "Manage Compaigns",
        tabheading1: "UPCOMING COMPAIGNS",
        tabheading2: "LIVE COMPAIGNS",
        tabheading3: "PAST COMPAIGNS",
        beta: "BETA",
        selectDate: "Select date",
        selectLanguage: "Select Language",
        date: "DATE",
        manage: "Manage",
        viewPrice: "VIEW PRICE",
        compaigns: "Compaigns",
        compaign: "COMPAIGN",
        view: "VIEW",
        action: "ACTION",
        submit: "SUBMIT",
        close: "CLOSE",
        title: "Title",
        price: "Price",
        scheduled: "Scheduled"
      },
      fr: {
        pageHeading: "Gérer les campagnes",
        viewPrice: "VOIR PRI",
        tabheading1: "COMPAIGNES À VENIR",
        tabheading2: "CAMPAGNES EN DIRECT",
        tabheading3: "CAMPAGNES PASSÉES",
        selectLanguage: "Choisir la langue",
        beta: "BÊTA",
        title: "Titre",
        price: "prix",
        scheduled: "Prévu",
        selectDate: "sélectionner une date",
        submit: "SOUMETTRE",
        close: "Fermer",
        compaigns: "campagnes",
        manage: "gérer",
        date: "RENDEZ-VOUS AMOUREUX",
        compaign: "CAMPAGNE",
        view: "VUE",
        action: "ACTION"
      }
    };
    this.getData("./assets/data.json");
  }

  getData(url): void {
    this.dataList = [];
    this.http.get(url).subscribe(compaigns => {
      this.finalcompaigns = compaigns;
      this.finalcompaigns.forEach(compaign => {
        this.days = Math.floor(
          (new Date(compaign.scheduleDate).getTime() - new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime()) /
            (24 * 60 * 60 * 1000)
        );
        if (this.days < 0) {
          compaign["daysDiff_en"] = Math.abs(this.days) + " days ago";
          compaign["daysDiff_fr"] = Math.abs(this.days) + " jours à venir";
          compaign["status"] = "past";
        } else if (this.days > 0) {
          compaign["daysDiff_en"] = Math.abs(this.days) + " days ahead";
          compaign["daysDiff_fr"] = Math.abs(this.days) + " jours à venir";
          compaign["status"] = "upcoming";
        } else {
          compaign["daysDiff_en"] = "Schedule for today";
          compaign["daysDiff_fr"] = "Horaire pour aujourd'hui";
          compaign["status"] = "live";
        }
        this.dataList.push(compaign);
      });
      this.showTab("upcoming");
    });
  }
  showTab(status: any): void {
    this.statusData = [];
    this.dataList.forEach(compaign => {
      var localStorageCompaign = JSON.parse(
        localStorage.getItem(compaign.title + this.language)
      );
      if (
        localStorageCompaign &&
        compaign.title == localStorageCompaign.title
      ) {
        if (localStorageCompaign.status == status) {
          this.statusData.push(
            JSON.parse(localStorage.getItem(compaign.title + this.language))
          );
        }
      } else if (compaign.status == status) {
        this.statusData.push(compaign);
      }
    });
  }

  changeLanguage(language): void {
    if (language == "en") {
      this.getData("./assets/data.json");
    } else {
      this.getData("./assets/data_fr.json");
    }
  }

  showModal(compaign: any): void {
    this.compaignDetail = compaign;
    setTimeout(function() {
      $("#compaignDetailModal").modal("show");
    });
  }
  showDateModal(compaign: any): void {
    this.compaignDetail = compaign;
    setTimeout(function() {
      $("#dateModal").modal("show");
    });
  }
  scheduleCompaign(compaign: any, model: string): void {
    this.status = compaign.status;
    if (model && new Date().getTime() < new Date(model).getTime()) {
      $("#dateModal").modal("hide");
      compaign["scheduleDate"] = model.split("-").join("/");
      this.days = Math.floor(Math.round(new Date(compaign["scheduleDate"]).getTime() -
      new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime()) /
          (24 * 60 * 60 * 1000));
      compaign["daysDiff_en"] = Math.abs(this.days) + " days ahead";
      compaign["daysDiff_fr"] = Math.abs(this.days) + " jours à venir";
      compaign["status"] = "upcoming";
      localStorage.setItem(
        compaign.title + this.language,
        JSON.stringify(this.compaignDetail)
      );
    } else {
      alert("Please select valid Date");
    }
    this.showTab(this.status);
  }
}
