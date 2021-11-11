import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Socket, SocketIoConfig } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root',
})
export class SocketLogService {

  public log$: BehaviorSubject<any> = new BehaviorSubject('');
  
  config: SocketIoConfig = {
    url: environment.apiURL+'/logs',
    options: {},
  }

  constructor(private _socket: Socket) {
      this._socket = new Socket(this.config)
  }

  public LogsRequest(id: string){
    debugger
    this._socket.emit('stream_logs_request', id);
  };

  public getLogs(){
    this._socket.on('stream_logs_response', (log: any) =>{
        this.log$.next(log);
    });
    return this.log$.asObservable();
  };
}