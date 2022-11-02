import { Injectable } from '@nestjs/common';
import { EventSource } from 'eventsource';

@Injectable()
export class SSEConsumeService {
  consumeEvent() {
    // new EventSource('https://operator-route.apps.int.mpp.preprod.iad2.dc.paas.redhat.com/api/event').onmessage = async function (eventRequest) {
    //     console.log(eventRequest);
    // };
  }
}
