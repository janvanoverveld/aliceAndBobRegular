import {Message,ADD,RES,BYE} from './Message';
import {receiveMessageServer,waitForMessage} from './receiveMessageServer';
import {sendMessage} from './sendMessage';
import {roles, initialize, connectedRoles} from './globalObjects';

async function doAdd(msgAdd:ADD){
   let resValue = msgAdd.value1+msgAdd.value2;
   console.log(`stuur ${RES.name} ${resValue} naar ${msgAdd.role} `);
   sendMessage( msgAdd.role, new RES(resValue) );
}

function doBye(bye:BYE):void{
   connectedRoles.delete(bye.role);
}

async function startProtocol() {
   while ( true ) {
      let msg = await waitForMessage();
      if ( msg && msg.name === ADD.name) {
          doAdd(<ADD>msg);
      }
      if ( msg && msg.name === BYE.name) {
         doBye(<BYE>msg);
         if (connectedRoles.noMoreRelevantRoles()){
            break;
         }
      }
   }
   receiveMessageServer.terminate();
}

async function start(){
   await initialize(roles.bob,30002,'localhost');
   startProtocol();
}

start();

console.log(`bob is gestart  ${new Date()}`);