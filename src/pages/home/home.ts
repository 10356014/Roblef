import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, URLSearchParams } from '@angular/Http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  num:any;
  r:any;
  interval:any;
  duration:any;
  id:any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http:Http) {
    this.readCallingNum();

    var dur = 1;
      this.interval = setInterval(()=>{
         dur = dur +1;
         this.duration = dur;
         this.readCallingNum();
      }, 2000);
  }

  //停止計時器-----------------------------------------------------------------------------
  ionViewWillLeave(){
    clearInterval(this.interval);
  }

  //-----------------------------------------------------------------------
  readCallingNum(){
    let params: URLSearchParams = new URLSearchParams();
      params.set('robNo', 'R001');
      this.http.get('http://140.131.114.143:8080/project/data/readCallingNum.php', {search: params})			
        .subscribe(
          (data) => {
            this.num=data.json()['numPlate'];
            this.id=data.json()['numID'];
            this.updateCallState();
            console.log(this.num);
          }, error => {
              this.showAlert();
          }
        );
    }

    //------------------------------------------------------------------------
    updateCallState(){
      let params = new FormData();
      params.append('callState', '0');
      params.append('numID', this.id);
      this.http.post('http://140.131.114.143:8080/project/data/updateCallState.php',params)
      .subscribe(data => {
          this.r=data.json()['data'];
          console.log(this.r);
        }, error => {
          this.showAlert();
        }
      );
    }

   //連線失敗訊息------------------------------------------------------------
   showAlert() {
    let alert = this.alertCtrl.create({
      title: '連線失敗!',
      subTitle: '請確定網路狀態, 或是主機是否提供服務中.',
      buttons: ['OK']
    });
    alert.present();
  }

}
