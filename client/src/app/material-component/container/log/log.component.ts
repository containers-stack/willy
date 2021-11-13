import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  sessionid: string = ''

  constructor(private socket: Socket,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.containerId = params['id']
      this.socket.connect();
    });
  }

  ngOnInit(): void {
    this.sessionid = UUID.UUID();
    this.socket.emit('join_log_request', this.containerId, this.sessionid);
    this.socket.on('stream_logs_response', (response: any) => {
      if(response.containerid == this.containerId){
        this.logs.push(response.log)
      }
    })
  }

  ngOnDestroy(): void {
    this.socket.emit('leav_log_request', this.sessionid);
    this.socket.disconnect();
  }

}
