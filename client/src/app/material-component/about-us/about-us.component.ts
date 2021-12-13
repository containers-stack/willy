import { Component, OnInit } from '@angular/core';


export interface Contributors {
  name: string;
  img: string;
  follow: string;
  discription: string;
  linkdin: string;
  github: string;
  stackoverflow: string
}

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor() { }

  public contributors = [
    {
        "name": "Moti Malka",
        "email": "moti.malka25@gmail.com",
        "discription": "DevOps Engineer & Web Developer",
        "img": "https://media-exp1.licdn.com/dms/image/C5603AQESFECZ4RW-4g/profile-displayphoto-shrink_800_800/0/1627627260610?e=1643241600&v=beta&t=_9BhjQbv1u-epGKP3ULA-m5Ec7CzuKN2wbdfjitAlWs",
        "follow": "https://github.com/moti-malka",
        "linkdin": "https://www.linkedin.com/in/moti-malka-2452b2135/",
        "github": "https://github.com/moti-malka"
      },
     {
        "name": "Shmuel Raichman",
        "email": "dev@raichman.io",
        "discription": "DevOps Engineer",
        "img": "https://media-exp1.licdn.com/dms/image/C4E03AQG5ByGIjmPZYg/profile-displayphoto-shrink_800_800/0/1597911407092?e=1643241600&v=beta&t=XUF603O7hfMswZY56lZY5tBo4z7u4RGNoQYFMOT1-tk",
        "follow": "https://github.com/shmuel-raichman",
        "linkdin": "https://www.linkedin.com/in/shmuel-raichman/",
        "github": "https://github.com/shmuel-raichman",
        "stackoverflow": "https://stackoverflow.com/users/9202256/shmuel"
      }

  ]


  ngOnInit(): void {}

  follow(url:string){
    window.open(url, "_blank");
  }

}
