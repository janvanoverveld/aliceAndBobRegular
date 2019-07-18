import {ADD,RES,BYE} from './Message';
import {receiveMessageServer,waitForMessage} from './receiveMessageServer';
import {sendMessage} from './sendMessage';
import {roles,initialize} from './globalObjects';

async function startProtocol() {
   for(let i=0;i<5;i++) {
      let addMessage = new ADD(roles.fred,Math.floor(Math.random() * 5),Math.floor(Math.random() * 5));
      console.log(`stuur een add naar ${roles.bob} met waarden ${addMessage.value1}  ${addMessage.value2}`);
      sendMessage(roles.bob, addMessage );
      let msg = await waitForMessage();
      if ( msg && msg.name === RES.name) {
         let res = <RES> msg;
         console.log(`RES heeft waarde van ${res.sum}`);
      }
   }
   sendMessage( roles.bob, new BYE(roles.fred) );
   receiveMessageServer.terminate();
}

async function start(){
   await initialize(roles.fred, 30003,'localhost');
   startProtocol();
}

start();

console.log(`fred is gestart  ${new Date()}`);