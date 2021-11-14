import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit, OnDestroy {

  public logs: string[] = [];

  private containerId = '';
  
  public containerName = '';

  private sessionid: string = ''

  private isFollow = true;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private socket: Socket,
    private activatedRoute: ActivatedRoute,
    private _router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.containerId = params['id']
      this.containerName = params['name']
      this.socket.connect();
    });
  }

  ngOnInit(): void {
    this.sessionid = UUID.UUID();
    this.socket.emit('join_log_request', this.containerId, this.sessionid);
    this.socket.on('stream_logs_response', (response: any) => {
      if (response.containerid == this.containerId) {
        this.logs.push(response.log)
        if (this.isFollow) {
          this.scrollToBottom();

        }
      }
    })
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      console.log("scrolling")
    } catch (err) {
      console.log(err)
    }
  }

  ngOnDestroy(): void {
    this.socket.emit('leav_log_request', this.sessionid);
    this.socket.disconnect();
  }

  close() {

    this._router.navigateByUrl(`/container`)
  }

}
